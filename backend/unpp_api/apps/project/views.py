# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from datetime import date
from django.core.exceptions import PermissionDenied
from django.db import transaction
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status as statuses, serializers
from rest_framework.views import APIView
from rest_framework.generics import (
    ListCreateAPIView,
    ListAPIView,
    CreateAPIView,
    RetrieveUpdateAPIView,
    RetrieveAPIView,
    DestroyAPIView,
)
from rest_framework.response import Response
from rest_framework.filters import OrderingFilter

from django_filters.rest_framework import DjangoFilterBackend

from account.models import User
from agency.permissions import AgencyPermission
from common.consts import CFEI_TYPES, DIRECT_SELECTION_SOURCE
from common.pagination import SmallPagination
from common.permissions import HasUNPPPermission, check_unpp_permission, current_user_has_permission
from notification.consts import NotificationType
from notification.helpers import (
    get_partner_users_for_application_queryset,
    send_notification_cfei_completed,
    send_agency_updated_application_notification,
    send_notification_application_created,
    send_notification,
    send_cfei_review_required_notification, user_received_notification_recently,
    send_partner_made_decision_notification,
)
from partner.permissions import PartnerPermission
from project.exports.application_compare import ApplicationCompareSpreadsheetGenerator
from project.exports.cfei import CFEIPDFExporter
from project.models import Assessment, Application, EOI, Pin, ApplicationFeedback
from project.serializers import (
    BaseProjectSerializer,
    DirectProjectSerializer,
    CreateProjectSerializer,
    PartnerProjectSerializer,
    CreateDirectProjectSerializer,
    ApplicationFullSerializer,
    ApplicationFullEOISerializer,
    AgencyUnsolicitedApplicationSerializer,
    CreateDirectApplicationNoCNSerializer,
    ApplicationsListSerializer,
    ReviewersApplicationSerializer,
    ReviewerAssessmentsSerializer,
    CreateUnsolicitedProjectSerializer,
    ApplicationPartnerOpenSerializer,
    ApplicationPartnerUnsolicitedDirectSerializer,
    ApplicationPartnerDirectSerializer,
    ApplicationFeedbackSerializer,
    ConvertUnsolicitedSerializer,
    ReviewSummarySerializer,
    EOIReviewersAssessmentsSerializer,
    AwardedPartnersSerializer,
    CompareSelectedSerializer,
    AgencyProjectSerializer,
)

from project.filters import (
    BaseProjectFilter,
    ApplicationsFilter,
    ApplicationsEOIFilter,
    ApplicationsUnsolicitedFilter,
)


class BaseProjectAPIView(ListCreateAPIView):
    """
    Base endpoint for Call of Expression of Interest.
    """
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW,
            ],
            partner_permissions=[
                PartnerPermission.CFEI_VIEW
            ]
        ),
    )
    queryset = EOI.objects.select_related("agency").prefetch_related("specializations").distinct()
    serializer_class = BaseProjectSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_class = BaseProjectFilter
    ordering_fields = (
        'title', 'agency', 'specializations__name', 'deadline_date', 'created', 'start_date', 'completed_date'
    )


class OpenProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting OPEN Call of Expression of Interest.
    """

    def get_queryset(self):
        queryset = self.queryset.filter(display_type=CFEI_TYPES.open)

        if self.request.user.is_agency_user:
            return queryset

        return queryset.filter(deadline_date__gte=date.today(), is_completed=False)

    @check_unpp_permission(agency_permissions=[AgencyPermission.CFEI_DRAFT_CREATE])
    def post(self, request, *args, **kwargs):
        serializer = CreateProjectSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        if instance.reviewers.exists():
            send_notification(NotificationType.SELECTED_AS_CFEI_REVIEWER, instance, instance.reviewers.all())

        return Response(serializer.data, status=statuses.HTTP_201_CREATED)


class EOIAPIView(RetrieveUpdateAPIView, DestroyAPIView):
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW,
            ],
            partner_permissions=[
                PartnerPermission.CFEI_VIEW
            ]
        ),
    )
    queryset = EOI.objects.all()

    def retrieve(self, request, *args, **kwargs):
        if request.GET.get('export', '').lower() == 'pdf':
            return CFEIPDFExporter(self.get_object()).get_as_response()
        return super(EOIAPIView, self).retrieve(request, *args, **kwargs)

    def get_serializer_class(self, *args, **kwargs):
        return AgencyProjectSerializer if self.request.user.is_agency_user else PartnerProjectSerializer

    def get_queryset(self):
        queryset = super(EOIAPIView, self).get_queryset()
        if not self.request.method == 'GET':
            queryset = queryset.filter(
                Q(created_by=self.request.user) | Q(focal_points=self.request.user)
            ).filter(is_completed=False)

        if self.request.active_partner:
            queryset = queryset.filter(is_published=True)

        return queryset

    def perform_update(self, serializer):
        eoi = self.get_object()
        currently_invited_partners = list(eoi.invited_partners.all().values_list('id', flat=True))
        current_deadline = eoi.deadline_date
        current_reviewers = list(eoi.reviewers.all().values_list('id', flat=True))

        instance = serializer.save()

        # New partners added
        for partner in instance.invited_partners.exclude(id__in=currently_invited_partners):
            context = {
                'eoi_url': eoi.get_absolute_url()
            }
            send_notification(NotificationType.CFEI_INVITE, eoi, partner.get_users(), context=context)

        # Deadline Changed
        if current_deadline != instance.deadline_date:
            users = get_partner_users_for_application_queryset(instance.applications.all())
            context = {
                'initial_date': current_deadline,
                'revised_date': instance.deadline_date,
                'eoi_url': eoi.get_absolute_url()
            }
            send_notification(NotificationType.CFEI_DEADLINE_UPDATE, eoi, users, context=context)

        # New Reviewers Added
        new_reviewer_ids = []
        for reviewer in instance.reviewers.all():
            if reviewer.id not in current_reviewers:
                new_reviewer_ids.append(reviewer.id)

            if new_reviewer_ids:
                send_notification(
                    NotificationType.SELECTED_AS_CFEI_REVIEWER, eoi, User.objects.filter(id__in=new_reviewer_ids)
                )

        # Completed
        if instance.is_completed:
            send_notification_cfei_completed(instance)

    def perform_destroy(self, cfei):
        if cfei.is_direct:
            if cfei.is_published:
                required_permissions = [AgencyPermission.CFEI_DIRECT_CANCEL]
            else:
                required_permissions = [AgencyPermission.CFEI_DIRECT_DELETE_DRAFT]
        else:
            if cfei.is_published:
                required_permissions = [AgencyPermission.CFEI_PUBLISHED_CANCEL]
            else:
                required_permissions = [AgencyPermission.CFEI_DRAFT_MANAGE]

        current_user_has_permission(self.request, agency_permissions=required_permissions)

        return super(EOIAPIView, self).perform_destroy(cfei)


class DirectProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting DIRECT Call of Expression of Interest.
    """
    serializer_class = DirectProjectSerializer

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return self.serializer_class
        return CreateDirectProjectSerializer

    def get_queryset(self):
        return self.queryset.filter(display_type=CFEI_TYPES.direct).distinct()

    @check_unpp_permission(agency_permissions=[AgencyPermission.CFEI_DIRECT_CREATE_DRAFT_MANAGE_FOCAL_POINTS])
    def post(self, request, *args, **kwargs):
        data = request.data
        try:
            data['eoi']['created_by'] = request.user.id
            data['eoi']['selected_source'] = DIRECT_SELECTION_SOURCE.un
        except Exception:
            pass

        return super(DirectProjectAPIView, self).post(request, *args, **kwargs)


class PinProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting PINNED Call of Expression of Interest for User Partner.
    """

    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[
                PartnerPermission.CFEI_VIEW
            ]
        ),
    )

    ERROR_MSG_WRONG_EOI_PKS = "At least one of given CFEIs could not be found."
    ERROR_MSG_WRONG_PARAMS = "Couldn't properly identify input parameters like 'eoi_ids' and 'pin'."

    def get_queryset(self):
        return self.queryset.filter(
            pins__partner_id=self.request.active_partner.id, deadline_date__gte=date.today()
        ).distinct()

    @check_unpp_permission(partner_permissions=[PartnerPermission.CFEI_PINNING])
    def patch(self, request, *args, **kwargs):
        eoi_ids = request.data.get("eoi_ids", [])
        pin = request.data.get("pin")
        if EOI.objects.filter(id__in=eoi_ids).count() != len(eoi_ids):
            raise serializers.ValidationError({
                'non_field_errors': self.ERROR_MSG_WRONG_EOI_PKS
            })

        partner_id = self.request.active_partner.id
        if pin and eoi_ids:
            Pin.objects.bulk_create([
                Pin(eoi_id=eoi_id, partner_id=partner_id, pinned_by=request.user) for eoi_id in eoi_ids
            ])

            return Response({"eoi_ids": eoi_ids}, status=statuses.HTTP_201_CREATED)
        elif pin is False and eoi_ids:
            Pin.objects.filter(eoi_id__in=eoi_ids, partner_id=partner_id, pinned_by=request.user).delete()

            return Response(status=statuses.HTTP_204_NO_CONTENT)
        else:
            raise serializers.ValidationError({
                'non_field_errors': self.ERROR_MSG_WRONG_PARAMS
            })


class AgencyApplicationListAPIView(ListAPIView):
    """
    Endpoint to allow agencies to get applications
    """
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW_APPLICATIONS,
            ]
        ),
    )

    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_class = ApplicationsFilter
    serializer_class = ApplicationFullEOISerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        return Application.objects.filter(
            Q(eoi__created_by=self.request.user) | Q(eoi__focal_points=self.request.user)
        )


class PartnerEOIApplicationCreateAPIView(CreateAPIView):
    """
    Create Application for open EOI by partner.
    """
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[
                PartnerPermission.CFEI_SUBMIT_CONCEPT_NOTE,
            ]
        ),
    )
    serializer_class = ApplicationFullSerializer

    def perform_create(self, serializer):
        if self.request.active_partner.is_hq:
            raise serializers.ValidationError(
                "You don't have the ability to submit an application if "
                "you are currently toggled under the HQ profile."
            )
        if not self.request.active_partner.has_finished:
            raise serializers.ValidationError(
                "You don't have the ability to submit an application if Your profile is not completed."
            )

        eoi = get_object_or_404(EOI, id=self.kwargs.get('pk'))
        instance = serializer.save(
            eoi=eoi,
            submitter_id=self.request.user.id,
            partner_id=self.request.active_partner.id,
            agency=eoi.agency
        )
        send_notification_application_created(instance)


class PartnerEOIApplicationRetrieveAPIView(RetrieveAPIView):

    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[
                PartnerPermission.CFEI_VIEW,
            ]
        ),
    )
    queryset = Application.objects.all()
    serializer_class = ApplicationFullSerializer

    def get_object(self):
        return get_object_or_404(self.get_queryset(), **{
            'partner_id': self.request.active_partner.id,
            'eoi_id': self.kwargs.get('pk'),
        })


class AgencyEOIApplicationCreateAPIView(PartnerEOIApplicationCreateAPIView):
    """
    Create Application for direct EOI by agency.
    """
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_DIRECT_INDICATE_CSO,
            ]
        ),
    )
    queryset = Application.objects.all()
    serializer_class = CreateDirectApplicationNoCNSerializer

    def perform_create(self, serializer):
        eoi = get_object_or_404(EOI, id=self.kwargs['pk'])
        instance = serializer.save(
            did_win=True, eoi=eoi, submitter_id=self.request.user.id, agency=eoi.agency
        )

        send_notification_application_created(instance)


class AgencyEOIApplicationDestroyAPIView(DestroyAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_DIRECT_INDICATE_CSO,
            ],
        ),
    )
    queryset = Application.objects.all()
    serializer_class = CreateDirectApplicationNoCNSerializer
    lookup_url_kwarg = 'eoi_id'

    def get_queryset(self):
        return super(AgencyEOIApplicationDestroyAPIView, self).get_queryset().filter(
            eoi__agency=self.request.user.agency
        )


class ApplicationAPIView(RetrieveUpdateAPIView):
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[
                PartnerPermission.CFEI_VIEW,
            ],
            agency_permissions=[
                AgencyPermission.CFEI_VIEW_APPLICATIONS,
            ]
        ),
    )
    queryset = Application.objects.select_related("partner", "eoi", "cn").prefetch_related("eoi__reviewers").all()
    serializer_class = ApplicationFullSerializer

    def get_queryset(self):
        queryset = super(ApplicationAPIView, self).get_queryset()
        if self.request.active_partner:
            return queryset.filter(partner=self.request.active_partner)
        elif self.request.agency_member:
            queryset = queryset.filter(Q(is_unsolicited=True, is_published=True) | Q(is_unsolicited=False))
            if not self.request.method == 'GET':
                queryset = queryset.filter(agency=self.request.agency_member.office.agency)

            return queryset

        return queryset.none()

    @check_unpp_permission(
        partner_permissions=[
            PartnerPermission.CFEI_ANSWER_SELECTION,
        ],
        agency_permissions=[
            AgencyPermission.CFEI_PRESELECT_APPLICATIONS,
        ]
    )
    def perform_update(self, serializer):
        data = serializer.validated_data
        instance = serializer.save()
        if data.get('did_accept', False) or data.get('did_decline', False):
            instance.decision_date = timezone.now().date()
            instance.save()

        if self.request.agency_member:
            send_agency_updated_application_notification(instance)
        elif self.request.active_partner:
            send_partner_made_decision_notification(instance)


class EOIApplicationsListAPIView(ListAPIView):
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW_APPLICATIONS,
            ]
        ),
    )
    queryset = Application.objects.select_related(
        "partner", "eoi", "cn"
    ).prefetch_related("assessments", "eoi__reviewers").all()
    serializer_class = ApplicationsListSerializer
    pagination_class = SmallPagination
    filter_backends = (
        DjangoFilterBackend,
        OrderingFilter,
    )
    filter_class = ApplicationsEOIFilter
    ordering_fields = ('status', )
    lookup_field = lookup_url_kwarg = 'pk'

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(eoi_id=self.kwargs.get(self.lookup_field)).filter(
            Q(eoi__created_by=self.request.user) | Q(eoi__focal_points=self.request.user)
        )


class ReviewersStatusAPIView(ListAPIView):
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW_ALL_REVIEWS,
            ]
        ),
    )
    serializer_class = ReviewersApplicationSerializer
    lookup_url_kwarg = 'application_id'

    def get_object(self):
        return get_object_or_404(
            Application.objects.select_related('eoi').prefetch_related('eoi__reviewers'),
            pk=self.kwargs.get(self.lookup_url_kwarg)
        )

    def check_permissions(self, request):
        super(ReviewersStatusAPIView, self).check_permissions(request)
        eoi = self.get_object().eoi
        if not eoi.created_by == request.user and not eoi.focal_points.filter(pk=request.user.pk).exists():
            raise PermissionDenied('Only creators / focal points can list assessments')

    def get_queryset(self, *args, **kwargs):
        return self.get_object().eoi.reviewers.all()


class ReviewerAssessmentsAPIView(ListCreateAPIView, RetrieveUpdateAPIView):
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW_ALL_REVIEWS,
            ]
        ),
    )
    serializer_class = ReviewerAssessmentsSerializer
    reviewer_url_kwarg = 'reviewer_id'
    application_url_kwarg = 'application_id'

    def check_permissions(self, request):
        super(ReviewerAssessmentsAPIView, self).check_permissions(request)
        if not Application.objects.filter(
            id=self.kwargs.get(self.application_url_kwarg),
            eoi__reviewers=self.request.user
        ).exists():
            raise PermissionDenied

    def get_queryset(self, *args, **kwargs):
        return Assessment.objects.filter(application_id=self.kwargs.get(self.application_url_kwarg))

    def get_object(self):
        obj = get_object_or_404(
            self.get_queryset(),
            reviewer_id=self.kwargs.get(self.reviewer_url_kwarg),
            application_id=self.kwargs.get(self.application_url_kwarg),
        )
        self.check_object_permissions(self.request, obj)
        return obj

    def create(self, request, *args, **kwargs):
        request.data['application'] = self.kwargs.get(self.application_url_kwarg)
        request.data['reviewer'] = self.kwargs.get(self.reviewer_url_kwarg)
        return super(ReviewerAssessmentsAPIView, self).create(request, *args, **kwargs)

    def perform_update(self, serializer):
        if not serializer.instance.created_by == self.request.user:
            raise PermissionDenied
        super(ReviewerAssessmentsAPIView, self).perform_update(serializer)


class UnsolicitedProjectListAPIView(ListAPIView):
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW_APPLICATIONS,
            ]
        ),
    )
    queryset = Application.objects.filter(is_unsolicited=True, is_published=True).distinct()
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )
    filter_class = ApplicationsUnsolicitedFilter
    serializer_class = AgencyUnsolicitedApplicationSerializer


class PartnerApplicationOpenListAPIView(ListAPIView):
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[
                PartnerPermission.UCN_VIEW,
            ]
        ),
    )
    queryset = Application.objects.filter(eoi__display_type=CFEI_TYPES.open).distinct()
    serializer_class = ApplicationPartnerOpenSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )
    filter_class = ApplicationsFilter

    def get_queryset(self):
        query = Q(partner=self.request.active_partner)
        if self.request.active_partner.is_hq:
            query |= Q(partner__hq=self.request.active_partner)
        return super(PartnerApplicationOpenListAPIView, self).get_queryset().filter(query)


class PartnerApplicationUnsolicitedListCreateAPIView(ListCreateAPIView):
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[
                PartnerPermission.UCN_VIEW,
            ]
        ),
    )
    queryset = Application.objects.filter(is_unsolicited=True).distinct()
    filter_class = ApplicationsUnsolicitedFilter
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )

    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == 'POST':
            current_user_has_permission(
                self.request, partner_permissions=[PartnerPermission.UCN_DRAFT], raise_exception=True
            )
            return CreateUnsolicitedProjectSerializer
        return ApplicationPartnerUnsolicitedDirectSerializer

    def get_queryset(self, *args, **kwargs):
        query = Q(partner=self.request.active_partner)
        if self.request.active_partner.is_hq:
            query |= Q(partner__hq=self.request.active_partner)
        return super(PartnerApplicationUnsolicitedListCreateAPIView, self).get_queryset().filter(query)


class PartnerApplicationDirectListCreateAPIView(ListAPIView):
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[
                PartnerPermission.DSR_VIEW,
            ]
        ),
    )
    queryset = Application.objects.filter(eoi__display_type=CFEI_TYPES.direct, eoi__is_published=True).distinct()
    filter_class = ApplicationsUnsolicitedFilter
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )
    serializer_class = ApplicationPartnerDirectSerializer

    def get_queryset(self, *args, **kwargs):
        query = Q(partner=self.request.active_partner)
        if self.request.active_partner.is_hq:
            query |= Q(partner__hq=self.request.active_partner)
        return super(PartnerApplicationDirectListCreateAPIView, self).get_queryset().filter(query)


class ApplicationFeedbackListCreateAPIView(ListCreateAPIView):
    serializer_class = ApplicationFeedbackSerializer
    pagination_class = SmallPagination
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW_APPLICATIONS,
            ]
        ),
    )

    def get_queryset(self):
        return ApplicationFeedback.objects.filter(application=self.kwargs['pk'])

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user, application_id=self.kwargs['pk'])


class ConvertUnsolicitedAPIView(CreateAPIView):
    serializer_class = ConvertUnsolicitedSerializer
    queryset = Application.objects.all()
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_PUBLISH,
            ]
        ),
    )

    def perform_create(self, serializer):
        instance = serializer.save()
        send_notification_application_created(instance)


class ReviewSummaryAPIView(RetrieveUpdateAPIView):
    """
    Endpoint for review summary - comment & attachment
    """
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW_APPLICATIONS,
            ]
        ),
    )
    serializer_class = ReviewSummarySerializer
    queryset = EOI.objects.all()

    def check_object_permissions(self, request, obj):
        super(ReviewSummaryAPIView, self).check_object_permissions(request, obj)
        if request.method == 'GET':
            return
        if obj.created_by == request.user or obj.focal_points.filter(id=request.user.id).exists():
            return
        self.permission_denied(request)

    @check_unpp_permission(agency_permissions=[AgencyPermission.CFEI_ADD_REVIEW_SUMMARY])
    def perform_update(self, serializer):
        super(ReviewSummaryAPIView, self).perform_update(serializer)


class EOIReviewersAssessmentsListAPIView(ListAPIView):
    """
    Reviewers with their assessments - summary
    """
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW_ALL_REVIEWS,
            ]
        ),
    )
    serializer_class = EOIReviewersAssessmentsSerializer
    lookup_field = 'eoi_id'

    def get_queryset(self):
        return get_object_or_404(EOI, id=self.kwargs['eoi_id']).reviewers.all()


class EOIReviewersAssessmentsNotifyAPIView(APIView):
    """
    Create Notification to remind users
    """

    NOTIFICATION_MESSAGE_SENT = "Notification message sent successfully"
    NOTIFICATION_MESSAGE_WAIT = "Notification message sent recently. Need to wait 24 hours."

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW_ALL_REVIEWS,
            ]
        ),
    )

    def post(self, request, *args, **kwargs):
        eoi = get_object_or_404(EOI, id=self.kwargs['eoi_id'])
        user = get_object_or_404(eoi.reviewers.all(), id=self.kwargs['reviewer_id'])

        if not user_received_notification_recently(user, eoi, NotificationType.CFEI_REVIEW_REQUIRED):
            send_cfei_review_required_notification(eoi, [user])
            message = self.NOTIFICATION_MESSAGE_SENT
            status = statuses.HTTP_201_CREATED
        else:
            message = self.NOTIFICATION_MESSAGE_WAIT
            status = statuses.HTTP_200_OK

        return Response({"success": message}, status=status)


class AwardedPartnersListAPIView(ListAPIView):
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW,
            ]
        ),
    )
    serializer_class = AwardedPartnersSerializer
    lookup_field = 'eoi_id'

    def get_queryset(self):
        eoi_id = self.kwargs['eoi_id']
        return Application.objects.filter(did_win=True, did_decline=False, eoi_id=eoi_id)


class CompareSelectedListAPIView(ListAPIView):
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW_ALL_REVIEWS,
            ]
        ),
    )
    serializer_class = CompareSelectedSerializer

    def get(self, request, *args, **kwargs):
        export = self.request.query_params.get("export")
        if export == 'xlsx':
            response = HttpResponse(
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            generator = ApplicationCompareSpreadsheetGenerator(
                self.filter_queryset(self.get_queryset()), write_to=response
            )
            generator.generate()
            response['Content-Disposition'] = 'attachment; filename="{}"'.format(generator.filename)
            return response

        return super(CompareSelectedListAPIView, self).get(request, *args, **kwargs)

    def get_queryset(self):
        queryset = Application.objects.select_related("partner").filter(eoi_id=self.kwargs['eoi_id'])

        application_ids = self.request.query_params.get("application_ids")
        if application_ids is not None:
            ids = filter(lambda x: x.isdigit(), application_ids.split(","))
            queryset = queryset.filter(id__in=ids)
        else:
            queryset.none()

        return queryset


class EOISendToPublishAPIView(RetrieveAPIView):
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_DRAFT_SEND_TO_FOCAL_POINT_TO_PUBLISH,
            ]
        ),
    )
    serializer_class = AgencyProjectSerializer
    queryset = EOI.objects.filter(sent_for_publishing=False, is_published=False)

    def check_object_permissions(self, request, obj):
        super(EOISendToPublishAPIView, self).check_object_permissions(request, obj)
        if obj.created_by == request.user:
            return
        self.permission_denied(request)

    def post(self, *args, **kwargs):
        # TODO: Notify focal point
        obj = self.get_object()
        if obj.deadline_passed:
            raise serializers.ValidationError('Deadline date is set in the past, please update it before publishing.')

        obj.sent_for_publishing = True
        obj.save()
        return Response(self.serializer_class(obj).data)


class PublishCFEIAPIView(RetrieveAPIView):
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_PUBLISH,
            ]
        ),
    )
    serializer_class = AgencyProjectSerializer
    queryset = EOI.objects.filter(is_published=False)

    def check_object_permissions(self, request, obj):
        super(PublishCFEIAPIView, self).check_object_permissions(request, obj)
        if obj.created_by == request.user or obj.focal_points.filter(id=request.user.id).exists():
            return
        self.permission_denied(request)

    @transaction.atomic
    def post(self, *args, **kwargs):
        cfei = self.get_object()
        if cfei.deadline_passed:
            raise serializers.ValidationError('Deadline date is set in the past, please update it before publishing.')

        if cfei.is_direct:
            if not all(map(lambda a: a.partner.is_verified, cfei.applications.all())):
                raise serializers.ValidationError('All partners need to be verified before publishing.')
            if not cfei.applications.count() == 1:
                raise serializers.ValidationError('Only a single partner can be indicated.')
            list(map(send_notification_application_created, cfei.applications.all()))

        cfei.is_published = True
        cfei.published_timestamp = timezone.now()
        cfei.save()
        return Response(AgencyProjectSerializer().data)


class PublishOrDestroyUCNAPIView(RetrieveAPIView, DestroyAPIView):
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[]
        ),
    )
    serializer_class = ApplicationPartnerUnsolicitedDirectSerializer
    queryset = Application.objects.filter(is_published=False, is_unsolicited=True)

    def get_queryset(self):
        queryset = super(PublishOrDestroyUCNAPIView, self).get_queryset()
        query = Q(partner=self.request.active_partner)
        if self.request.active_partner.is_hq:
            query |= Q(partner__hq=self.request.active_partner)
        return queryset.filter(query)

    @check_unpp_permission(partner_permissions=[PartnerPermission.UCN_SUBMIT])
    def post(self, *args, **kwargs):
        obj = self.get_object()
        obj.published_timestamp = timezone.now()
        obj.is_published = True
        obj.save()
        send_notification_application_created(obj)
        return Response(self.serializer_class(obj).data)

    @check_unpp_permission(partner_permissions=[PartnerPermission.UCN_DELETE])
    def perform_destroy(self, instance):
        return super(PublishOrDestroyUCNAPIView, self).perform_destroy(instance)

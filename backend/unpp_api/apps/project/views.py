# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from datetime import date
from django.core.exceptions import PermissionDenied
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status as statuses
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
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter

from django_filters.rest_framework import DjangoFilterBackend

from account.models import User
from common.consts import EOI_TYPES, DIRECT_SELECTION_SOURCE
from common.pagination import SmallPagination
from common.permissions import (
    IsAgencyMemberUser,
    IsAtLeastMemberEditor,
    IsAtLeastAgencyMemberEditor,
    IsAgencyProject,
    IsEOIReviewerAssessments,
    IsApplicationAPIEditor,
    IsConvertUnsolicitedEditor,
    IsApplicationFeedbackPerm,
    IsPartnerEOIApplicationCreate,
    IsPartnerEOIApplicationDestroy,
    IsPartner,
)
from common.mixins import PartnerIdsMixin
from notification.consts import NotificationType
from notification.helpers import (
    get_partner_users_for_application_queryset,
    send_notification_cfei_completed,
    send_agency_updated_application_notification,
    send_notification_application_created,
    send_notification,
    send_cfei_review_required_notification, user_received_notification_recently,
    send_partner_made_decision_notification)
from project.exports import ApplicationCompareSpreadsheetGenerator
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
    permission_classes = (IsAuthenticated, )
    queryset = EOI.objects.select_related("agency").prefetch_related("specializations").distinct()
    serializer_class = BaseProjectSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_class = BaseProjectFilter
    ordering_fields = ('deadline_date', 'created', 'start_date',
                       'status', 'completed_date')


class OpenProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting OPEN Call of Expression of Interest.
    """
    permission_classes = (IsAuthenticated, IsAgencyProject)

    def get_queryset(self):
        queryset = self.queryset.filter(display_type=EOI_TYPES.open)

        if self.request.user.is_agency_user:
            return queryset

        today = date.today()

        return queryset.filter(deadline_date__gte=today, is_completed=False)

    def post(self, request, *args, **kwargs):
        serializer = CreateProjectSerializer(data=request.data, context={'request': request})

        if not serializer.is_valid():
            return Response(serializer.errors, status=statuses.HTTP_400_BAD_REQUEST)

        instance = serializer.save()

        if instance.reviewers.exists():
            send_notification('agency_cfei_reviewers_selected', instance, instance.reviewers.all())

        return Response(serializer.data, status=statuses.HTTP_201_CREATED)


class EOIAPIView(RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated,)
    queryset = EOI.objects.all()

    def get_serializer_class(self, *args, **kwargs):
        return AgencyProjectSerializer if self.request.user.is_agency_user else PartnerProjectSerializer

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
            send_notification(
                NotificationType.CFEI_INVITE, eoi, partner.get_users(), check_sent_for_source=False, context=context
            )

        # Deadline Changed
        if current_deadline != instance.deadline_date:
            users = get_partner_users_for_application_queryset(instance.applications.all())
            context = {
                'initial_date': current_deadline,
                'revised_date': instance.deadline_date,
                'eoi_url': eoi.get_absolute_url()
            }
            send_notification('cfei_update_prev', eoi, users, context=context)

        # New Reviewers Added
        new_reviewers = []
        for reviewer in instance.reviewers.all():
            if reviewer.id not in current_reviewers:
                new_reviewers.append(reviewer.id)

            if new_reviewers:
                send_notification('agency_cfei_reviewers_selected', eoi, User.objects.filter(id__in=new_reviewers))

        # Completed
        if instance.is_completed:
            send_notification_cfei_completed(instance)


class DirectProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting DIRECT Call of Expression of Interest.
    """

    permission_classes = (IsAuthenticated, IsAgencyProject)
    serializer_class = DirectProjectSerializer

    def get_queryset(self):
        return self.queryset.filter(display_type=EOI_TYPES.direct).distinct()

    def post(self, request, *args, **kwargs):
        data = request.data or {}
        try:
            data['eoi']['created_by'] = request.user.id
            data['eoi']['selected_source'] = DIRECT_SELECTION_SOURCE.un
        except Exception:
            pass  # serializer.is_valid() will take care of right response

        serializer = CreateDirectProjectSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=statuses.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=statuses.HTTP_201_CREATED)


class PinProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting PINNED Call of Expression of Interest for User Partner.
    """

    permission_classes = (IsAuthenticated, IsPartner)

    ERROR_MSG_WRONG_EOI_PKS = "At least one of given EOI primary key doesn't exists."
    ERROR_MSG_WRONG_PARAMS = "Couldn't properly identify input parameters like 'eoi_ids' and 'pin'."

    def get_queryset(self):
        today = date.today()
        return self.queryset.filter(pins__partner_id=self.request.active_partner.id,
                                    deadline_date__gte=today)\
                            .distinct()

    def patch(self, request, *args, **kwargs):
        eoi_ids = request.data.get("eoi_ids")
        pin = request.data.get("pin")
        if EOI.objects.filter(id__in=eoi_ids).count() != len(eoi_ids):
            return Response(
                {"error": self.ERROR_MSG_WRONG_EOI_PKS},
                status=statuses.HTTP_400_BAD_REQUEST
            )
        partner_id = self.request.active_partner.id
        if pin and len(eoi_ids) > 0:
            pins = []
            for eoi in eoi_ids:
                pins.append(Pin(eoi_id=eoi, partner_id=partner_id, pinned_by=request.user))
            Pin.objects.bulk_create(pins)
            return Response({"eoi_ids": eoi_ids}, status=statuses.HTTP_201_CREATED)
        elif pin is False and len(eoi_ids) > 0:
            Pin.objects.filter(eoi_id__in=eoi_ids, partner_id=partner_id, pinned_by=request.user).delete()
            return Response(status=statuses.HTTP_204_NO_CONTENT)
        else:
            return Response(
                {"error": self.ERROR_MSG_WRONG_PARAMS},
                status=statuses.HTTP_400_BAD_REQUEST
            )


class AgencyApplicationListAPIView(ListAPIView):
    """
    Endpoint to allow agencies to get applications
    """
    permission_classes = (IsAgencyMemberUser,)
    queryset = Application.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_class = ApplicationsFilter
    serializer_class = ApplicationFullEOISerializer
    pagination_class = SmallPagination


class PartnerEOIApplicationDestroyAPIView(DestroyAPIView):
    """
    Destroy Application (concept note) created by partner.
    """
    permission_classes = (IsAuthenticated, IsPartnerEOIApplicationDestroy)
    queryset = Application.objects.all()
    serializer_class = ApplicationFullSerializer

    def delete(self, request, pk, *args, **kwargs):
        app = get_object_or_404(Application, id=pk)
        app.delete()
        return Response({}, status=statuses.HTTP_204_NO_CONTENT)


class PartnerEOIApplicationCreateAPIView(CreateAPIView):
    """
    Create Application for open EOI by partner.
    """
    permission_classes = (IsAuthenticated, IsPartnerEOIApplicationCreate)
    queryset = Application.objects.all()
    serializer_class = ApplicationFullSerializer

    def post(self, request, pk, *args, **kwargs):
        self.eoi = get_object_or_404(EOI, id=pk)
        if Application.objects.filter(eoi=self.eoi, partner_id=self.request.active_partner.id).exists():
            return Response(
                {'non_field_errors': ['The fields eoi, partner must make a unique set.']},
                status=statuses.HTTP_400_BAD_REQUEST
            )
        if self.request.active_partner.is_hq and request.user.member.partner.id != self.request.active_partner.id:
            return Response(
                {'non_field_errors': ["You don't have the ability to submit an application if You are currently "
                                      "toggled under the HQ profile."]},
                status=statuses.HTTP_400_BAD_REQUEST
            )
        if not self.request.active_partner.has_finished:
            return Response(
                {'non_field_errors':
                    ["You don't have the ability to submit an application if Your profile is not completed."]},
                status=statuses.HTTP_400_BAD_REQUEST
            )

        return super(PartnerEOIApplicationCreateAPIView, self).post(request, pk, *args, **kwargs)

    def perform_create(self, serializer):
        instance = serializer.save(eoi=self.eoi,
                                   submitter_id=self.request.user.id,
                                   partner_id=self.request.active_partner.id,
                                   agency=self.eoi.agency)
        send_notification_application_created(instance)


class PartnerEOIApplicationRetrieveAPIView(RetrieveAPIView):
    """
    Create Application for open EOI by partner.
    """
    permission_classes = (IsAuthenticated, IsPartner)
    queryset = Application.objects.all()
    serializer_class = ApplicationFullSerializer

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())
        eoi_id = self.kwargs.get(self.lookup_field)
        partner_id = self.request.active_partner.id
        if partner_id:
            obj = get_object_or_404(queryset, **{
                'partner_id': partner_id,
                'eoi_id': eoi_id,
            })
            self.check_object_permissions(self.request, obj)
            return obj
        return Application.objects.none()


class AgencyEOIApplicationCreateAPIView(PartnerEOIApplicationCreateAPIView):
    """
    Create Application for direct EOI by agency.
    """
    permission_classes = (IsAuthenticated, IsAtLeastAgencyMemberEditor)
    queryset = Application.objects.all()
    serializer_class = CreateDirectApplicationNoCNSerializer

    def perform_create(self, serializer):
        eoi = get_object_or_404(EOI, id=self.kwargs['pk'])
        instance = serializer.save(did_win=True,
                                   eoi=eoi,
                                   submitter_id=self.request.user.id,
                                   agency=eoi.agency)

        send_notification_application_created(instance)


class AgencyEOIApplicationDestroyAPIView(DestroyAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastAgencyMemberEditor)
    queryset = Application.objects.all()
    serializer_class = CreateDirectApplicationNoCNSerializer

    def delete(self, request, eoi_id, pk, *args, **kwargs):
        self.eoi = get_object_or_404(EOI, id=eoi_id)

        allowed_to_modify = \
            list(self.eoi.focal_points.values_list('id', flat=True)) + [self.eoi.created_by_id]
        if request.user.id not in allowed_to_modify or not self.eoi.is_direct:
            raise PermissionDenied

        app = get_object_or_404(Application, id=pk)
        app.delete()
        return Response({}, status=statuses.HTTP_204_NO_CONTENT)


class ApplicationAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated, IsApplicationAPIEditor)
    queryset = Application.objects.select_related("partner", "eoi", "cn").prefetch_related("eoi__reviewers").all()
    serializer_class = ApplicationFullSerializer

    def perform_update(self, serializer):
        data = serializer.validated_data
        instance = serializer.save()
        if data.get('did_accept', False) or data.get('did_decline', False):
            instance.decision_date = timezone.now().date()
            instance.save()

        if self.request.user.is_agency_user:
            send_agency_updated_application_notification(instance)
        elif self.request.user.is_partner_user:
            send_partner_made_decision_notification(instance)


class EOIApplicationsListAPIView(ListAPIView):
    permission_classes = (IsAgencyMemberUser, )
    queryset = Application.objects.select_related("partner", "eoi", "cn")\
        .prefetch_related("assessments", "eoi__reviewers").all()
    serializer_class = ApplicationsListSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_class = ApplicationsEOIFilter
    ordering_fields = ('status', )
    lookup_field = lookup_url_kwarg = 'pk'

    def get_queryset(self, *args, **kwargs):
        eoi_id = self.kwargs.get(self.lookup_field)
        return self.queryset.filter(eoi_id=eoi_id)


class ReviewersStatusAPIView(ListAPIView):
    permission_classes = (IsAgencyMemberUser, IsAtLeastMemberEditor)
    queryset = User.objects.all()
    serializer_class = ReviewersApplicationSerializer
    lookup_field = 'pk'
    lookup_url_kwarg = 'application_id'

    def get_queryset(self, *args, **kwargs):
        application_id = self.kwargs.get(self.lookup_url_kwarg)
        app = get_object_or_404(Application.objects.select_related('eoi').prefetch_related('eoi__reviewers'),
                                pk=application_id)
        return User.objects.filter(pk__in=app.eoi.reviewers.all().values_list("pk"))


class ReviewerAssessmentsAPIView(ListCreateAPIView, RetrieveUpdateAPIView):
    """
    Only reviewers, EOI creator & focal points are allowed to create/modify assessments.
    """
    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor, IsEOIReviewerAssessments)
    queryset = Assessment.objects.all()
    serializer_class = ReviewerAssessmentsSerializer
    lookup_field = 'reviewer_id'
    lookup_url_kwarg = 'application_id'

    def set_bunch_of_required_data(self, request):
        reviewer_id = request.parser_context.get('kwargs', {}).get(self.lookup_field)
        application_id = request.parser_context.get('kwargs', {}).get(self.lookup_url_kwarg)
        request.data['reviewer'] = reviewer_id
        request.data['application'] = application_id

    def check_complex_permissions(self, request):
        # only reviewer can create assessment
        application_id = request.parser_context.get('kwargs', {}).get('application_id')
        app = Application.objects.select_related('eoi').get(id=application_id)
        eoi = app.eoi
        if eoi.reviewers.filter(id=request.user.id).exists():
            return
        raise PermissionDenied

    def create(self, request, application_id, *args, **kwargs):
        self.set_bunch_of_required_data(request)
        request.data['created_by'] = request.user.id
        return super(ReviewerAssessmentsAPIView, self).create(request, application_id, *args, **kwargs)

    def get_queryset(self, *args, **kwargs):
        application_id = self.kwargs.get(self.lookup_url_kwarg)
        return Assessment.objects.filter(application_id=application_id)

    def get_object(self):
        """
            we have defined:
                unique_together = (("reviewer", "application"), )
            so get will return only one item by given reviewer & application
        """
        queryset = self.filter_queryset(self.get_queryset())
        obj = get_object_or_404(queryset, **{
            self.lookup_field: self.kwargs.get(self.lookup_field),
            self.lookup_url_kwarg: self.kwargs.get(self.lookup_url_kwarg),
        })
        self.check_object_permissions(self.request, obj)
        return obj

    def update(self, request, application_id, *args, **kwargs):
        self.set_bunch_of_required_data(request)
        request.data['modified_by'] = request.user.id
        return super(ReviewerAssessmentsAPIView, self).update(request, application_id, *args, **kwargs)


class UnsolicitedProjectAPIView(ListAPIView):
    permission_classes = (IsAgencyMemberUser, )
    queryset = Application.objects.filter(is_unsolicited=True).distinct()
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )
    filter_class = ApplicationsUnsolicitedFilter
    serializer_class = AgencyUnsolicitedApplicationSerializer


class PartnerApplicationOpenListAPIView(PartnerIdsMixin, ListAPIView):
    permission_classes = (IsAuthenticated, IsPartner)
    queryset = Application.objects.filter(eoi__display_type=EOI_TYPES.open).distinct()
    serializer_class = ApplicationPartnerOpenSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )
    filter_class = ApplicationsFilter

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(partner_id__in=self.get_partner_ids())


class PartnerApplicationUnsolicitedListCreateAPIView(PartnerIdsMixin, ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsPartner)
    queryset = Application.objects.filter(is_unsolicited=True).distinct()
    filter_class = ApplicationsUnsolicitedFilter
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )

    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == 'POST':
            return CreateUnsolicitedProjectSerializer
        return ApplicationPartnerUnsolicitedDirectSerializer

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(partner_id__in=self.get_partner_ids())

    def perform_create(self, serializer):
        instance = serializer.save()
        send_notification_application_created(instance)


class PartnerApplicationDirectListCreateAPIView(PartnerApplicationUnsolicitedListCreateAPIView):
    queryset = Application.objects.filter(eoi__display_type=EOI_TYPES.direct).distinct()

    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == 'POST':
            return CreateUnsolicitedProjectSerializer
        return ApplicationPartnerDirectSerializer

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(partner_id__in=self.get_partner_ids())


class ApplicationFeedbackListCreateAPIView(ListCreateAPIView):
    serializer_class = ApplicationFeedbackSerializer
    pagination_class = SmallPagination
    permission_classes = (IsAuthenticated, IsApplicationFeedbackPerm)

    def get_queryset(self):
        return ApplicationFeedback.objects.filter(application=self.kwargs['pk'])

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user,
                        application_id=self.kwargs['pk'])


class ConvertUnsolicitedAPIView(CreateAPIView):
    serializer_class = ConvertUnsolicitedSerializer
    queryset = Application.objects.all()
    permission_classes = (IsAuthenticated, IsConvertUnsolicitedEditor)

    def perform_create(self, serializer):
        instance = serializer.save()
        send_notification_application_created(instance)


class ReviewSummaryAPIView(RetrieveUpdateAPIView):
    """
    Endpoint for review summary - comment & attachement
    """
    permission_classes = (IsAuthenticated, IsAtLeastAgencyMemberEditor)
    serializer_class = ReviewSummarySerializer
    queryset = EOI.objects.all()


class EOIReviewersAssessmentsListAPIView(ListAPIView):
    """
    Reviewers with they assessments - summary
    """
    permission_classes = (IsAgencyMemberUser, IsAtLeastMemberEditor)
    queryset = User.objects.all()
    serializer_class = EOIReviewersAssessmentsSerializer
    lookup_field = 'eoi_id'

    def get_queryset(self):
        eoi = get_object_or_404(EOI, id=self.kwargs['eoi_id'])
        return eoi.reviewers.all()


class EOIReviewersAssessmentsNotifyAPIView(APIView):
    """
    Create Notification to remind users
    """

    NOTIFICATION_MESSAGE_SENT = "Notification message sent successfully"
    NOTIFICATION_MESSAGE_WAIT = "Notification message sent recently. Need to wait 24 hours."

    permission_classes = (IsAgencyMemberUser, IsAtLeastMemberEditor)

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
    permission_classes = (IsAgencyMemberUser, )
    serializer_class = AwardedPartnersSerializer
    lookup_field = 'eoi_id'

    def get_queryset(self):
        eoi_id = self.kwargs['eoi_id']
        return Application.objects.filter(did_win=True, did_decline=False, eoi_id=eoi_id)


class CompareSelectedListAPIView(ListAPIView):
    permission_classes = (IsAgencyMemberUser, IsAtLeastMemberEditor)
    serializer_class = CompareSelectedSerializer

    def get(self, request, *args, **kwargs):
        export = self.request.query_params.get("export")
        if export == 'xlsx':
            response = HttpResponse(
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            generator = ApplicationCompareSpreadsheetGenerator(self.get_queryset(), write_to=response)
            generator.generate()
            response['Content-Disposition'] = 'attachment; filename="{}"'.format(generator.filename)
            return response

        return super(CompareSelectedListAPIView, self).get(request, *args, **kwargs)

    def get_queryset(self):
        eoi_id = self.kwargs['eoi_id']
        queryset = Application.objects.select_related("partner").filter(eoi_id=eoi_id)

        application_ids = self.request.query_params.get("application_ids")
        if application_ids is not None:
            ids = filter(lambda x: x.isdigit(), application_ids.split(","))
            queryset = queryset.filter(id__in=ids)
        else:
            queryset.none()

        return queryset

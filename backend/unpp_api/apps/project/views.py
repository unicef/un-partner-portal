# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from datetime import date
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from rest_framework import status as statuses
from rest_framework.views import APIView
from rest_framework.generics import (
    ListCreateAPIView, ListAPIView, CreateAPIView, RetrieveUpdateAPIView, RetrieveAPIView
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter

from django_filters.rest_framework import DjangoFilterBackend

from account.models import User
from common.consts import EOI_TYPES
from common.paginations import SmallPagination
from common.permissions import (
    IsAtLeastMemberReader,
    IsAtLeastMemberEditor,
    IsAtLeastAgencyMemberEditor,
    IsEOIReviewerAssessments,
    IsPartner,
)
from notification.helpers import (
    send_notification_cfei_completed,
    send_notification_application_updated,
    send_notificiation_application_created,
    send_notification
)
from partner.models import PartnerMember
from .models import Assessment, Application, EOI, Pin, ApplicationFeedback
from .serializers import (
    BaseProjectSerializer,
    DirectProjectSerializer,
    CreateProjectSerializer,
    PartnerProjectSerializer,
    CreateDirectProjectSerializer,
    ProjectUpdateSerializer,
    ApplicationFullSerializer,
    AgencyUnsolicitedApplicationSerializer,
    CreateDirectApplicationNoCNSerializer,
    ApplicationsListSerializer,
    ReviewersApplicationSerializer,
    ReviewerAssessmentsSerializer,
    CreateUnsolicitedProjectSerializer,
    ApplicationPartnerOpenSerializer,
    ApplicationPartnerUnsolicitedDirectSerializer,
    ApplicationFeedbackSerializer,
    ConvertUnsolicitedSerializer,
    ReviewSummarySerializer,
    EOIReviewersAssessmentsSerializer,
    AwardedPartnersSerializer,
    CompareSelectedSerializer,
)

from .filters import BaseProjectFilter, ApplicationsFilter, ApplicationsUnsolicitedFilter


class BaseProjectAPIView(ListCreateAPIView):
    """
    Base endpoint for Call of Expression of Interest.
    """
    permission_classes = (IsAuthenticated, IsAtLeastMemberReader)
    queryset = EOI.objects.prefetch_related("specializations", "agency")
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

    def get_queryset(self):
        return self.queryset.filter(display_type=EOI_TYPES.open)

    def post(self, request, *args, **kwargs):
        serializer = CreateProjectSerializer(data=request.data, context={'request': request})

        if not serializer.is_valid():
            return Response(serializer.errors, status=statuses.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=statuses.HTTP_201_CREATED)


class EOIAPIView(RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer_class = ProjectUpdateSerializer
    queryset = EOI.objects.all()

    def get_serializer_class(self, *args, **kwargs):
        if self.request.user.is_agency_user:
            return ProjectUpdateSerializer
        return PartnerProjectSerializer

    def perform_update(self, serializer):
        eoi = self.get_object()
        curr_invited_parters = list(eoi.invited_partners.all().values_list('id', flat=True))

        instance = serializer.save()

        for partner in instance.invited_partners.all():
            if partner.id not in curr_invited_parters:
                send_notification('cfei_invitation', eoi, partner.get_users(),
                                  check_sent_for_source=False)

        if instance.is_completed:
            send_notification_cfei_completed(instance)



class DirectProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting DIRECT Call of Expression of Interest.
    """

    serializer_class = DirectProjectSerializer

    # TODO - can remove. not using?
    def get_partners_pks(self):
        # Partner Member can have many partners! This case is under construction and can change in future!
        return PartnerMember.objects.filter(user=self.request.user).values_list('partner', flat=True)

    def get_queryset(self):
        return self.queryset.filter(display_type=EOI_TYPES.direct)

    def post(self, request, *args, **kwargs):
        data = request.data or {}
        try:
            data['eoi']['created_by'] = request.user.id
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

    ERROR_MSG_WRONG_EOI_PKS = "At least one of given EOI primary key doesn't exists."
    ERROR_MSG_WRONG_PARAMS = "Couldn't properly identify input parameters like 'eoi_ids' and 'pin'."

    def get_queryset(self):
        return self.queryset.filter(pins__partner_id=self.request.active_partner.id)

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


class ApplicationsPartnerAPIView(CreateAPIView):
    """
    Create Application for open EOI by partner.
    """
    permission_classes = (IsAuthenticated, IsAtLeastMemberReader)
    queryset = Application.objects.all()
    serializer_class = ApplicationFullSerializer

    def perform_create(self, serializer):
        eoi = get_object_or_404(EOI, id=self.kwargs['pk'])
        instance = serializer.save(eoi=eoi,
                                   submitter_id=self.request.user.id,
                                   partner_id=self.request.active_partner.id,
                                   agency=eoi.agency)

        send_notificiation_application_created(instance)


class ApplicationPartnerAPIView(RetrieveAPIView):
    """
    Create Application for open EOI by partner.
    """
    permission_classes = (IsAuthenticated, )
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


class ApplicationsAgencyAPIView(ApplicationsPartnerAPIView):
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

        send_notificiation_application_created(instance)


class ApplicationAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    queryset = Application.objects.all()
    serializer_class = ApplicationFullSerializer

    def perform_update(self, serializer):
        if serializer.validated_data.get('did_accept', False) and \
                serializer.instance.did_accept_date is None:
            instance = serializer.save(did_accept_date=date.today())
        else:
            instance = serializer.save()

        send_notification_application_updated(instance)



class ApplicationsListAPIView(ListAPIView):
    permission_classes = (IsAuthenticated, IsAtLeastMemberReader)
    queryset = Application.objects.all()
    serializer_class = ApplicationsListSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_class = ApplicationsFilter
    ordering_fields = ('status', )
    lookup_field = lookup_url_kwarg = 'pk'

    def get_queryset(self, *args, **kwargs):
        eoi_id = self.kwargs.get(self.lookup_field)
        return Application.objects.filter(eoi_id=eoi_id)


class ReviewersStatusAPIView(ListAPIView):
    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    queryset = User.objects.all()
    serializer_class = ReviewersApplicationSerializer
    lookup_field = 'pk'
    lookup_url_kwarg = 'application_id'

    def get_queryset(self, *args, **kwargs):
        application_id = self.kwargs.get(self.lookup_url_kwarg)
        app = get_object_or_404(Application.objects.select_related('eoi'),
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
    permission_classes = (IsAuthenticated, )
    queryset = Application.objects.filter(is_unsolicited=True)
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )
    filter_class = ApplicationsUnsolicitedFilter
    serializer_class = AgencyUnsolicitedApplicationSerializer


class AppsPartnerOpenAPIView(ListAPIView):
    permission_classes = (IsAuthenticated, IsPartner)
    queryset = Application.objects.filter(eoi__display_type=EOI_TYPES.open)
    serializer_class = ApplicationPartnerOpenSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )
    filter_class = ApplicationsFilter

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(partner_id=self.request.active_partner.id)


class AppsPartnerUnsolicitedAPIView(ListCreateAPIView):
    permission_classes = (IsAuthenticated, IsPartner)
    queryset = Application.objects.filter(is_unsolicited=True)
    filter_class = ApplicationsUnsolicitedFilter
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )

    def get_serializer_class(self, *args, **kwargs):
        if self.request.method == 'POST':
            return CreateUnsolicitedProjectSerializer
        return ApplicationPartnerUnsolicitedDirectSerializer

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(partner_id=self.request.active_partner.id)

    def perform_create(self, serializer):
        instance = serializer.save()
        send_notificiation_application_created(instance)



class AppsPartnerDirectAPIView(AppsPartnerUnsolicitedAPIView):
    queryset = Application.objects.filter(eoi__display_type=EOI_TYPES.direct)

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(partner_id=self.request.active_partner.id)


class ApplicationFeedbackListCreateAPIView(ListCreateAPIView):
    serializer_class = ApplicationFeedbackSerializer
    pagination_class = SmallPagination
    permission_classes = (IsAuthenticated,)  # TODO - tighten up permisions

    def get_queryset(self):
        return ApplicationFeedback.objects.filter(application=self.kwargs['pk'])

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user,
                        application_id=self.kwargs['pk'])


class ConvertUnsolicitedAPIView(CreateAPIView):
    serializer_class = ConvertUnsolicitedSerializer
    queryset = Application.objects.all()
    permission_classes = (IsAuthenticated, IsAtLeastAgencyMemberEditor)

    def perform_create(self, serializer):
        instance = serializer.save()
        send_notificiation_application_created(instance)


class ReviewSummaryAPIView(RetrieveUpdateAPIView):
    """
    Endpoint for review summary - comment & attachement
    """
    permission_classes = (IsAuthenticated, IsAtLeastAgencyMemberEditor,)
    serializer_class = ReviewSummarySerializer
    queryset = EOI.objects.all()


class EOIReviewersAssessmentsListAPIView(ListAPIView):
    """
    Reviewers with they assessments - summary
    """
    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    queryset = User.objects.all()
    serializer_class = EOIReviewersAssessmentsSerializer
    lookup_field = 'eoi_id'

    def get_queryset(self):
        eoi = get_object_or_404(EOI, id=self.kwargs['eoi_id'])
        return eoi.reviewers.all()


class EOIReviewersAssessmentsNotifyAPIView(APIView):
    """
    Created Notification to reminder users
    """

    NOTIFICATION_MESSAGE_SENT = "Notification message sent successfully"
    NOTIFICATION_MESSAGE_WAIT = "Notification message sent recently. Need to wait 24 hours."

    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)

    def post(self, request, *args, **kwargs):
        eoi = get_object_or_404(EOI, id=self.kwargs['eoi_id'])
        user = get_object_or_404(eoi.reviewers.all(), id=self.kwargs['reviewer_id'])
        #TODO - send notification reminder email w/ notification enhancement

        return Response(
            {"success": self.NOTIFICATION_MESSAGE_SENT},
            status=statuses.HTTP_201_CREATED
        )


class AwardedPartnersListAPIView(ListAPIView):
    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer_class = AwardedPartnersSerializer
    lookup_field = 'eoi_id'

    def get_queryset(self):
        eoi_id = self.kwargs['eoi_id']
        return Application.objects.filter(
            did_win=True, did_decline=False, did_withdraw=False, eoi_id=eoi_id)


class CompareSelectedListAPIView(ListAPIView):
    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer_class = CompareSelectedSerializer

    def get_queryset(self):
        eoi_id = self.kwargs['eoi_id']
        query = Application.objects.select_related("partner").filter(eoi_id=eoi_id)

        application_ids = self.request.query_params.get("application_ids")
        if application_ids is not None:
            ids = filter(lambda x: x.isdigit(), application_ids.split(","))
            query = query.filter(id__in=ids)
        else:
            query.none()

        return query

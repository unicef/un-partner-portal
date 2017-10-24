# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.core.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from rest_framework import status as statuses
from rest_framework.generics import (
    ListCreateAPIView, ListAPIView, CreateAPIView, RetrieveUpdateAPIView, RetrieveAPIView
)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
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
from partner.models import PartnerMember
from .models import Assessment, Application, EOI, Pin, ApplicationFeedback
from .serializers import (
    BaseProjectSerializer,
    DirectProjectSerializer,
    CreateProjectSerializer,
    CreateDirectProjectSerializer,
    ProjectUpdateSerializer,
    ApplicationFullSerializer,
    CreateDirectApplicationNoCNSerializer,
    ApplicationsListSerializer,
    ReviewersApplicationSerializer,
    ReviewerAssessmentsSerializer,
    CreateUnsolicitedProjectSerializer,
    ApplicationPartnerOpenSerializer,
    ApplicationPartnerUnsolicitedDirectSerializer,
    ApplicationFeedbackSerializer,
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
                       'status', 'completed_date',)


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


class DirectProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting DIRECT Call of Expression of Interest.
    """

    serializer_class = DirectProjectSerializer

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
        member = get_object_or_404(PartnerMember, user=self.request.user)
        return self.queryset.filter(pins__partner=member.partner)

    def patch(self, request, *args, **kwargs):
        eoi_ids = request.data.get("eoi_ids")
        pin = request.data.get("pin")
        if EOI.objects.filter(id__in=eoi_ids).count() != len(eoi_ids):
            return Response(
                {"error": self.ERROR_MSG_WRONG_EOI_PKS},
                status=statuses.HTTP_400_BAD_REQUEST
            )
        partner = PartnerMember.objects.get(user=request.user).partner
        if pin and len(eoi_ids) > 0:
            pins = []
            for eoi in eoi_ids:
                pins.append(Pin(eoi_id=eoi, partner=partner, pinned_by=request.user))
            Pin.objects.bulk_create(pins)
            return Response({"eoi_ids": eoi_ids}, status=statuses.HTTP_201_CREATED)
        elif pin is False and len(eoi_ids) > 0:
            Pin.objects.filter(eoi_id__in=eoi_ids, partner=partner, pinned_by=request.user).delete()
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

    def create(self, request, pk, *args, **kwargs):
        eoi = get_object_or_404(EOI, id=pk)
        request.data['eoi'] = eoi.id
        request.data['agency'] = eoi.agency.id
        request.data['submitter'] = request.user.id
        partner_member = PartnerMember.objects.filter(user=request.user).first()
        if partner_member:
            request.data['partner'] = partner_member.partner.id
        return super(ApplicationsPartnerAPIView, self).create(request, *args, **kwargs)


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
        partner_member = PartnerMember.objects.filter(user=self.request.user).first()
        if partner_member:
            partner = partner_member.partner
            obj = get_object_or_404(queryset, **{
                'partner': partner,
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

    def create(self, request, pk, *args, **kwargs):
        request.data['did_win'] = True
        return super(ApplicationsAgencyAPIView, self).create(request, pk, *args, **kwargs)


class ApplicationAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    queryset = Application.objects.all()
    serializer_class = ApplicationFullSerializer


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


class UnsolicitedProjectAPIView(CreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (IsAuthenticated, )
    queryset = Application.objects.all()
    serializer_class = CreateUnsolicitedProjectSerializer


class AppsPartnerOpenAPIView(ListAPIView):
    permission_classes = (IsAuthenticated, IsPartner)
    queryset = Application.objects.filter(eoi__display_type=EOI_TYPES.open)
    serializer_class = ApplicationPartnerOpenSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )
    filter_class = ApplicationsFilter

    def get_queryset(self, *args, **kwargs):
        return self.queryset.filter(partner_id=self.request.active_partner)


class AppsPartnerUnsolicitedAPIView(AppsPartnerOpenAPIView):
    queryset = Application.objects.filter(is_unsolicited=True)
    serializer_class = ApplicationPartnerUnsolicitedDirectSerializer
    filter_class = ApplicationsUnsolicitedFilter


class AppsPartnerDirectAPIView(AppsPartnerUnsolicitedAPIView):
    queryset = Application.objects.filter(eoi__display_type=EOI_TYPES.direct)


class ApplicationFeedbackListCreateAPIView(ListCreateAPIView):
    serializer_class = ApplicationFeedbackSerializer
    pagination_class = SmallPagination
    permission_classes = (IsAuthenticated,)  # TODO - tighten up permisions

    def get_queryset(self):
        return ApplicationFeedback.objects.filter(application=self.kwargs['pk'])

    def perform_create(self, serializer):
        serializer.save(provider=self.request.user,
                        application_id=self.kwargs['pk'])

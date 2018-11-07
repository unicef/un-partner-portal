# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db.models import Q
from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
    get_object_or_404,
)
from django_filters.rest_framework import DjangoFilterBackend

from account.serializers import PartnerMemberSerializer
from agency.permissions import AgencyPermission
from common.permissions import HasUNPPPermission
from common.pagination import SmallPagination, TinyResultSetPagination
from common.mixins.serializers import PatchOneFieldErrorMixin
from partner.exports.pdf.partner_profile import PartnerProfilePDFExporter
from partner.permissions import PartnerPermission
from partner.serializers import (
    OrganizationProfileSerializer,
    OrganizationProfileDetailsSerializer,
    PartnerProfileSummarySerializer,
    PartnersListSerializer,
    PartnerShortSerializer,
    PartnerIdentificationSerializer,
    PartnerContactInformationSerializer,
    PartnerProfileMandateMissionSerializer,
    PartnerProfileFundingSerializer,
    PartnerProfileCollaborationSerializer,
    PartnerProfileProjectImplementationSerializer,
    PartnerProfileOtherInfoSerializer,
    PartnerCountryProfileSerializer,
)
from partner.filters import PartnersListFilter
from partner.models import (
    Partner,
    PartnerProfile,
    PartnerMember,
)
from partner.mixins import FilterUsersPartnersMixin, VerifyPartnerProfileUpdatePermissionsMixin


class OrganizationProfileAPIView(FilterUsersPartnersMixin, RetrieveAPIView):
    """
    Endpoint for getting Organization Profile.
    """
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[],
        ),
    )
    serializer_class = OrganizationProfileSerializer
    queryset = Partner.objects.all()


class PartnerProfileAPIView(RetrieveAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
            ],
            partner_permissions=[],
        ),
    )
    serializer_class = OrganizationProfileDetailsSerializer
    queryset = Partner.objects.all()

    def retrieve(self, request, *args, **kwargs):
        if request.GET.get('export', '').lower() == 'pdf':
            return PartnerProfilePDFExporter(self.get_object()).get_as_response()
        return super(PartnerProfileAPIView, self).retrieve(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super(PartnerProfileAPIView, self).get_queryset()
        if self.request.active_partner:
            queryset = queryset.filter(
                Q(id__in=self.request.user.partner_ids) | Q(children__id__in=self.request.user.partner_ids)
            ).order_by().distinct('id')
        return queryset


class PartnerProfileSummaryAPIView(FilterUsersPartnersMixin, RetrieveAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
            ],
            partner_permissions=[],
        ),
    )
    serializer_class = PartnerProfileSummarySerializer
    queryset = Partner.objects.all()


class PartnersListAPIView(ListAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
            ]
        ),
    )
    queryset = Partner.objects.all()
    serializer_class = PartnersListSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )
    filter_class = PartnersListFilter


class PartnerShortListAPIView(ListAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
            ]
        ),
    )
    queryset = Partner.objects.filter(is_locked=False)
    serializer_class = PartnerShortSerializer
    filter_backends = (DjangoFilterBackend, )
    filter_class = PartnersListFilter
    pagination_class = TinyResultSetPagination


class PartnerIdentificationAPIView(
    VerifyPartnerProfileUpdatePermissionsMixin,
    FilterUsersPartnersMixin,
    PatchOneFieldErrorMixin,
    RetrieveUpdateAPIView
):
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[]
        ),
    )
    serializer_class = PartnerIdentificationSerializer
    queryset = Partner.objects.all()

    def get_object(self):
        return super(PartnerIdentificationAPIView, self).get_object().profile


class PartnerContactInformationAPIView(
    FilterUsersPartnersMixin,
    VerifyPartnerProfileUpdatePermissionsMixin,
    PatchOneFieldErrorMixin,
    RetrieveUpdateAPIView
):
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[]
        ),
    )
    serializer_class = PartnerContactInformationSerializer
    queryset = Partner.objects.all()


class PartnerMandateMissionAPIView(
    VerifyPartnerProfileUpdatePermissionsMixin,
    FilterUsersPartnersMixin,
    PatchOneFieldErrorMixin,
    RetrieveUpdateAPIView
):
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[]
        ),
    )
    serializer_class = PartnerProfileMandateMissionSerializer
    queryset = Partner.objects.all()


class PartnerFundingAPIView(
    FilterUsersPartnersMixin,
    VerifyPartnerProfileUpdatePermissionsMixin,
    PatchOneFieldErrorMixin,
    RetrieveUpdateAPIView
):
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[]
        ),
    )
    serializer_class = PartnerProfileFundingSerializer
    queryset = Partner.objects.all()


class PartnerCollaborationAPIView(
    FilterUsersPartnersMixin,
    VerifyPartnerProfileUpdatePermissionsMixin,
    PatchOneFieldErrorMixin,
    RetrieveUpdateAPIView
):
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[]
        ),
    )
    serializer_class = PartnerProfileCollaborationSerializer
    queryset = Partner.objects.all()


class PartnerProjectImplementationAPIView(
    FilterUsersPartnersMixin,
    VerifyPartnerProfileUpdatePermissionsMixin,
    PatchOneFieldErrorMixin,
    RetrieveUpdateAPIView
):
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[]
        ),
    )
    serializer_class = PartnerProfileProjectImplementationSerializer
    queryset = Partner.objects.all()


class PartnerOtherInfoAPIView(
    FilterUsersPartnersMixin,
    VerifyPartnerProfileUpdatePermissionsMixin,
    PatchOneFieldErrorMixin,
    RetrieveUpdateAPIView
):
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[]
        ),
    )
    serializer_class = PartnerProfileOtherInfoSerializer
    queryset = Partner.objects.all()


class PartnerCountryProfileAPIView(FilterUsersPartnersMixin, CreateAPIView, RetrieveAPIView):
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[
                PartnerPermission.CREATE_COUNTRY_OFFICE,
            ]
        ),
    )
    serializer_class = PartnerCountryProfileSerializer
    queryset = Partner.objects.all()


class PartnersMemberListAPIView(FilterUsersPartnersMixin, ListAPIView):

    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[],
            agency_permissions=[
                AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
            ]
        ),
    )
    serializer_class = PartnerMemberSerializer
    queryset = PartnerMember.objects.all()
    pagination_class = SmallPagination
    lookup_field = 'partner_id'
    partner_field = 'partner'

    def get_queryset(self):
        queryset = super(PartnersMemberListAPIView, self).get_queryset()
        if self.request.agency_member:
            return queryset.filter(partner_id=self.kwargs['pk'])
        else:
            partner = get_object_or_404(
                Partner.objects.filter(partner_members__user=self.request.user), id=self.kwargs['pk']
            )
            return queryset.filter(partner=partner)

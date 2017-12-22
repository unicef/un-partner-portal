# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework.generics import (
    ListAPIView,
    CreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from account.serializers import PartnerMemberSerializer
from common.permissions import (
    IsPartner,
    IsAtLeastEditorPartnerOnNotGET,
    IsRoleAdministratorOnNotGET,
    IsAgencyMemberUser,
)
from common.paginations import SmallPagination
from common.mixins import PatchOneFieldErrorMixin
from .serializers import (
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
from .filters import PartnersListFilter
from .models import (
    Partner,
    PartnerProfile,
    PartnerMember,
)


class OrganizationProfileAPIView(RetrieveAPIView):
    """
    Endpoint for getting Organization Profile.
    """
    permission_classes = (IsAuthenticated, IsPartner)
    serializer_class = OrganizationProfileSerializer
    queryset = Partner.objects.all()


class PartnerProfileAPIView(RetrieveAPIView):

    permission_classes = (IsAuthenticated, )
    serializer_class = OrganizationProfileDetailsSerializer
    queryset = Partner.objects.all()


class PartnerProfileSummaryAPIView(RetrieveAPIView):

    permission_classes = (IsAuthenticated, )
    serializer_class = PartnerProfileSummarySerializer
    queryset = Partner.objects.all()


class PartnersListAPIView(ListAPIView):

    permission_classes = (IsAuthenticated, IsAgencyMemberUser)
    queryset = Partner.objects.all()
    serializer_class = PartnersListSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )
    filter_class = PartnersListFilter


class PartnerShortListAPIView(ListAPIView):

    permission_classes = (IsAuthenticated, IsAgencyMemberUser)
    queryset = Partner.objects.all()
    serializer_class = PartnerShortSerializer
    filter_backends = (DjangoFilterBackend, )
    filter_class = PartnersListFilter


class PartnerIdentificationAPIView(PatchOneFieldErrorMixin, RetrieveUpdateAPIView):
    """
    PartnerIdentificationAPIView endpoint return specific partner profile data via serializer,
    by given pk (PartnerProfile)
    """
    permission_classes = (IsAuthenticated, IsAtLeastEditorPartnerOnNotGET)
    serializer_class = PartnerIdentificationSerializer
    queryset = PartnerProfile.objects.all()


class PartnerContactInformationAPIView(PatchOneFieldErrorMixin, RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastEditorPartnerOnNotGET)
    serializer_class = PartnerContactInformationSerializer
    queryset = Partner.objects.all()


class PartnerMandateMissionAPIView(PatchOneFieldErrorMixin, RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastEditorPartnerOnNotGET)
    serializer_class = PartnerProfileMandateMissionSerializer
    queryset = Partner.objects.all()


class PartnerFundingAPIView(PatchOneFieldErrorMixin, RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastEditorPartnerOnNotGET)
    serializer_class = PartnerProfileFundingSerializer
    queryset = Partner.objects.all()


class PartnerCollaborationAPIView(PatchOneFieldErrorMixin, RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastEditorPartnerOnNotGET)
    serializer_class = PartnerProfileCollaborationSerializer
    queryset = Partner.objects.all()


class PartnerProjectImplementationAPIView(PatchOneFieldErrorMixin, RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastEditorPartnerOnNotGET)
    serializer_class = PartnerProfileProjectImplementationSerializer
    queryset = Partner.objects.all()


class PartnerOtherInfoAPIView(PatchOneFieldErrorMixin, RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastEditorPartnerOnNotGET)
    serializer_class = PartnerProfileOtherInfoSerializer
    queryset = Partner.objects.all()


class PartnerCountryProfileAPIView(CreateAPIView, RetrieveAPIView):

    permission_classes = (IsAuthenticated, IsPartner, IsRoleAdministratorOnNotGET)
    serializer_class = PartnerCountryProfileSerializer
    queryset = Partner.objects.all()


class PartnersMemberListAPIView(ListAPIView):

    permission_classes = (IsAuthenticated, )
    serializer_class = PartnerMemberSerializer
    queryset = PartnerMember.objects.all()
    pagination_class = SmallPagination
    lookup_field = 'pk'

    def get_queryset(self, *args, **kwargs):
        partner_id = self.kwargs.get(self.lookup_field)
        return self.queryset.filter(partner_id=partner_id)

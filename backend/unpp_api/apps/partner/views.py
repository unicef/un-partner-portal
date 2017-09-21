# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from rest_framework.generics import ListAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from common.permissions import IsAtLeastMemberEditor
from common.paginations import SmallPagination
from .serializers import (
    OrganizationProfileSerializer,
    OrganizationProfileDetailsSerializer,
    PartnersListSerializer,
    PartnersListItemSerializer,
    PartnerShortSerializer,
    PartnerIdentificationSerializer,
    PartnerContactInformationSerializer,
    PartnerProfileMandateMissionSerializer,
    PartnerProfileFundingSerializer,
)
from .filters import PartnersListFilter
from .models import (
    Partner,
    PartnerProfile,
)


class OrganizationProfileAPIView(RetrieveAPIView):
    """
    Endpoint for getting Organization Profile.
    """
    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer_class = OrganizationProfileSerializer
    queryset = Partner.objects.all()


class PartnerProfileAPIView(RetrieveAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer_class = OrganizationProfileDetailsSerializer
    queryset = Partner.objects.all()


class PartnersListAPIView(ListAPIView):

    permission_classes = (IsAuthenticated, )
    queryset = Partner.objects.all()
    serializer_class = PartnersListSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )
    filter_class = PartnersListFilter


class PartnerShortListAPIView(ListAPIView):
    queryset = Partner.objects.all()
    serializer_class = PartnerShortSerializer


class PartnersListItemAPIView(RetrieveAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer_class = PartnersListItemSerializer
    queryset = Partner.objects.all()


class PartnerIdentificationAPIView(RetrieveUpdateAPIView):
    """
    PartnerIdentificationAPIView endpoint return specific partner profile data via serializer,
    by given pk (PartnerProfile)
    """
    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer_class = PartnerIdentificationSerializer
    queryset = PartnerProfile.objects.all()


class PartnerContactInformationAPIView(RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer_class = PartnerContactInformationSerializer
    queryset = Partner.objects.all()


class PartnerMandateMissionAPIView(RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer_class = PartnerProfileMandateMissionSerializer
    queryset = Partner.objects.all()


class PartnerFundingAPIView(RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer_class = PartnerProfileFundingSerializer
    queryset = Partner.objects.all()

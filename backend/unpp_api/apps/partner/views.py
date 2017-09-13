# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import get_object_or_404

from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from common.permissions import IsAtLeastMemberEditor
from common.paginations import SmallPagination
from .serializers import (
    OrganizationProfileSerializer,
    OrganizationProfileDetailsSerializer,
    PartnersListSerializer,
    PartnersListItemSerializer,
    PartnerShortSerializer
)
from .filters import PartnersListFilter
from .models import (
    Partner,
    PartnerProfile,
    PartnerMailingAddress,
    PartnerHeadOrganization,
    PartnerExperience,
)


class OrganizationProfileAPIView(RetrieveAPIView):
    """
    Endpoint for getting Organization Profile.
    """
    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer = OrganizationProfileSerializer


class PartnerProfileAPIView(RetrieveAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer = OrganizationProfileDetailsSerializer


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


class PartnersListItemAPIView(APIView):

    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)

    def get(self, request, partner_id, format=None):
        mailing = get_object_or_404(PartnerMailingAddress, partner_id=partner_id)
        head_organization = get_object_or_404(PartnerHeadOrganization, partner_id=partner_id)
        profile = get_object_or_404(PartnerProfile, partner_id=partner_id)
        experiences = PartnerExperience.objects.filter(partner_id=partner_id)

        serializer = PartnersListItemSerializer(dict(
            mailing=mailing,
            head_organization=head_organization,
            working_languages=profile and profile.working_languages,
            experiences=experiences
        ))
        return Response(serializer.data)

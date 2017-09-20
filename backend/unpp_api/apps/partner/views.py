# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from rest_framework.generics import ListAPIView, RetrieveAPIView
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

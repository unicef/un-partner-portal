# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from agency.permissions import AgencyPermission
from common.pagination import MediumPagination
from account.models import User
from agency.serializers import AgencySerializer, AgencyOfficeSerializer, AgencyUserListSerializer
from agency.models import Agency, AgencyOffice
from agency.filters import AgencyUserFilter, AgencyFilter
from common.permissions import HasUNPPPermission


class AgencyListAPIView(ListAPIView):
    """
    All Agencies in the system
    """
    serializer_class = AgencySerializer
    pagination_class = MediumPagination
    permission_classes = (IsAuthenticated, )
    filter_backends = (DjangoFilterBackend, )
    filter_class = AgencyFilter
    queryset = Agency.objects.all()


class AgencyOfficeListAPIView(ListAPIView):
    """
    All office for an Agency in the system
    """
    serializer_class = AgencyOfficeSerializer
    pagination_class = MediumPagination
    permission_classes = (IsAuthenticated, )

    def get_queryset(self):
        return AgencyOffice.objects.filter(agency_id=self.kwargs['pk'])


class AgencyMemberListAPIView(ListAPIView):
    """
    All Users for an Agency in the system
    """
    serializer_class = AgencyUserListSerializer
    pagination_class = MediumPagination
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.MANAGE_OWN_AGENCY_USERS
            ]
        ),
    )
    filter_backends = (DjangoFilterBackend, )
    filter_class = AgencyUserFilter

    def get_queryset(self):
        queryset = User.objects.filter(
            agency_members__office__agency=self.request.user.agency
        )
        if 'pk' in self.kwargs:
            queryset = queryset.filter(agency_members__office__agency_id=self.kwargs['pk'])
        return queryset

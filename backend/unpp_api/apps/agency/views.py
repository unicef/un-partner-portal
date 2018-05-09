# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.core.exceptions import PermissionDenied
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from agency.permissions import AgencyPermission
from common.pagination import MediumPagination
from account.models import User
from agency.serializers import AgencySerializer, AgencyOfficeSerializer, AgencyUserOfficesSerializer, \
    AgencyUserSerializer
from agency.models import Agency, AgencyOffice
from agency.filters import AgencyUserFilter, AgencyFilter
from common.permissions import HasAgencyPermission


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
    serializer_class = AgencyUserSerializer
    pagination_class = MediumPagination
    permission_classes = (IsAuthenticated, )
    filter_backends = (DjangoFilterBackend, )
    filter_class = AgencyUserFilter

    def get_queryset(self):
        return User.objects.filter(
            agency_members__office__agency_id=self.kwargs['pk'])


class AgencyUserOfficesView(ListAPIView):
    """
    All Users for an Agency + all of their office memberships
    """
    serializer_class = AgencyUserOfficesSerializer
    pagination_class = MediumPagination
    permission_classes = (
        IsAuthenticated,
        HasAgencyPermission(
            AgencyPermission.MY_AGENCY_LIST_USERS
        ),
    )
    filter_backends = (DjangoFilterBackend, )
    filter_class = AgencyUserFilter

    def get_queryset(self):
        agency = self.request.user.get_agency()
        if not agency:
            raise PermissionDenied

        return User.objects.filter(agency_members__office__agency=agency)

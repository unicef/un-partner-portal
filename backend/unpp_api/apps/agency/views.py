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
                AgencyPermission.MANAGE_USERS
            ]
        ),
    )
    filter_backends = (DjangoFilterBackend, )
    filter_class = AgencyUserFilter

    def get_queryset(self):
        return User.objects.filter(
            agency_members__office__agency=self.request.user.agency
        )


class AgencyOfficeMemberListAPIView(AgencyMemberListAPIView):
    """
    All Users for an Agency Office in the system
    """
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW  # TODO: Check where this is used and fix permission
            ]
        ),
    )

    def get_queryset(self):
        return super(AgencyOfficeMemberListAPIView, self).get_queryset().filter(
            agency_members__office_id=self.kwargs['pk']
        )

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from common.paginations import MediumPagination
from account.models import User
from account.serializers import AgencyUserSerializer
from .serializers import AgencySerializer, AgencyOfficeSerializer
from .models import Agency, AgencyOffice
from .filters import AgencyUserFilter


class AgencyListAPIView(ListAPIView):
    """
    All Agencies in the system
    """
    serializer_class = AgencySerializer
    pagination_class = MediumPagination
    permission_classes = (IsAuthenticated, )
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

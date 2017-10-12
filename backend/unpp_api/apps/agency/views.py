# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework.generics import ListAPIView

from common.paginations import MediumPagination
from common.permissions import IsAtLeastMemberReader
from account.models import User
from .serializers import (AgencySerializer, AgencyOfficeSerializer,
                          AgencyUserSerializer)
from .models import Agency, AgencyOffice


class AgencyListAPIView(ListAPIView):
    """
    Retreiving All Agencies in the system
    """
    serializer_class = AgencySerializer
    pagination_class = MediumPagination
    queryset = Agency.objects.all()


class AgencyOfficeListAPIView(ListAPIView):
    """
    Retreiving All Users for an Agency in the system
    """
    serializer_class = AgencyOfficeSerializer
    pagination_class = MediumPagination
    permission_classes = (IsAtLeastMemberReader, )

    def get_queryset(self):
        return AgencyOffice.objects.filter(agency_id=self.kwargs['pk'])


class AgencyMemberListAPIView(ListAPIView):
    """
    Retreiving All Users for an Agency in the system
    """
    serializer_class = AgencyUserSerializer
    pagination_class = MediumPagination
    permission_classes = (IsAtLeastMemberReader, )

    def get_queryset(self):
        return User.objects.filter(
            agency_members__office__agency_id=self.kwargs['pk'])

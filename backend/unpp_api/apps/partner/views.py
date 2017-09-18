# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import get_object_or_404
# from rest_framework import status as statuses
# from rest_framework.generics import ListAPIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
# from django_filters.rest_framework import DjangoFilterBackend
from common.permissions import IsAtLeastMemberEditor
from .serializers import OrganizationProfileSerializer, OrganizationProfileDetailsSerializer
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
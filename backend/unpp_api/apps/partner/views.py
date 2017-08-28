# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import get_object_or_404
# from rest_framework import status as statuses
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
# from django_filters.rest_framework import DjangoFilterBackend
from common.permissions import IsAtLeastMemberEditor
from .serializers import OrganizationProfileSerializer
from .models import Partner


class OrganizationProfileAPIView(APIView):
    """
    Endpoint for getting Call of Expression of Interest.
    """
    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer_class = OrganizationProfileSerializer
    lookup_field = lookup_url_kwarg = 'partner_id'

    def get_object(self, pk):
        return get_object_or_404(Partner, id=pk)

    def get(self, request, partner_id, format=None):
        org_profile = self.get_object(partner_id)
        serializer = OrganizationProfileSerializer(org_profile)
        return Response(serializer.data)

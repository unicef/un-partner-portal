# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import get_object_or_404
# from rest_framework import status as statuses
from rest_framework.generics import ListAPIView
# from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
# from django_filters.rest_framework import DjangoFilterBackend
from common.permissions import IsAtLeastMemberEditor
from .serializers import OrganizationProfileSerializer
from .models import Partner


class OrganizationProfileAPIView(ListAPIView):
    """
    Endpoint for getting Call of Expression of Interest.
    """
    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer_class = OrganizationProfileSerializer
    lookup_field = lookup_url_kwarg = 'partner_id'

    def get_queryset(self):
        partner_id = self.kwargs.get(self.lookup_field)
        return Partner.objects.filter(id=partner_id)

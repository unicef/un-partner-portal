# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import get_object_or_404
# from rest_framework import status as statuses
from rest_framework.generics import ListAPIView
# from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

# from django_filters.rest_framework import DjangoFilterBackend

from common.permissions import IsAtLeastMemberReader
from partner.models import PartnerProfile, PartnerMember
from .serializers import PartnerFullProfilesSerializer


class PartnerProfilesAPIView(ListAPIView):
    """
    Endpoint for getting Call of Expression of Interest.
    """
    permission_classes = (IsAuthenticated, IsAtLeastMemberReader)
    queryset = PartnerProfile.objects.all()
    serializer_class = PartnerFullProfilesSerializer

    def get_queryset(self):
        member = get_object_or_404(PartnerMember, user=self.request.user)
        return self.queryset.filter(partner=member.partner)

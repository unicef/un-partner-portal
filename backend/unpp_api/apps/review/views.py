# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView

from common.paginations import SmallPagination
from .serializers import PartnerFlagSerializer, PartnerVerificationSerializer
from .models import PartnerFlag, PartnerVerification


class PartnerFlagListCreateAPIView(ListCreateAPIView):
    """
    Endpoint for getting and creating flags
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = PartnerFlagSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        return PartnerFlag.objects.filter(partner=self.kwargs['pk'])

    def perform_create(self, serializer):
        serializer.save(submitter=self.request.user,
                        partner_id=self.kwargs['pk'])


class PartnerVerificationListCreateAPIView(ListCreateAPIView):
    """
    Endpoint for getting and creating partner verifications
    """
    permission_classes = (IsAuthenticated,)
    serializer_class = PartnerVerificationSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        return PartnerVerification.objects.filter(partner=self.kwargs['pk'])

    def perform_create(self, serializer):
        serializer.save(submitter=self.request.user,
                        partner_id=self.kwargs['pk'])

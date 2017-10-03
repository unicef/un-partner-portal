# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView

from common.paginations import SmallPagination
from common.permissions import IsAtLeastAgencyMemberEditor
from .serializers import PartnerFlagSerializer, PartnerVerificationSerializer
from .models import PartnerFlag, PartnerVerification


class PartnerFlagListCreateAPIView(ListCreateAPIView):
    """
    Endpoint for getting and creating flags
    """
    permission_classes = (IsAuthenticated, IsAtLeastAgencyMemberEditor,)
    serializer_class = PartnerFlagSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        return PartnerFlag.objects.filter(partner=self.kwargs['partner_id'])

    def perform_create(self, serializer):
        serializer.save(submitter=self.request.user,
                        partner_id=self.kwargs['partner_id'])


class PartnerVerificationListCreateAPIView(ListCreateAPIView):
    """
    Endpoint for getting and creating partner verifications
    """
    permission_classes = (IsAuthenticated, IsAtLeastAgencyMemberEditor,)
    serializer_class = PartnerVerificationSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        return PartnerVerification.objects.filter(partner=self.kwargs['partner_id'])

    def perform_create(self, serializer):
        serializer.save(submitter=self.request.user,
                        partner_id=self.kwargs['partner_id'])


class PartnerFlagRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    """
    Endpoint for updating valid status. Only accepts is_valid
    """
    permission_classes = (IsAuthenticated, IsAtLeastAgencyMemberEditor,)
    serializer_class = PartnerFlagSerializer

    def get_queryset(self):
        return PartnerFlag.objects.filter(partner=self.kwargs['partner_id'])

    def perform_update(self, serializer):
        serializer.save(update_fields=['is_valid'])


class PartnerVerificationRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    """
    Endpoint for updating valid status. Only accepts is_valid
    """
    permission_classes = (IsAuthenticated, IsAtLeastAgencyMemberEditor,)
    serializer_class = PartnerVerificationSerializer

    def get_queryset(self):
        return PartnerVerification.objects.filter(partner=self.kwargs['partner_id'])

    def perform_update(self, serializer):
        serializer.save(update_fields=['is_valid'])

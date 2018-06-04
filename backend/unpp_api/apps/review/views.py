# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView, get_object_or_404

from agency.permissions import AgencyPermission
from common.pagination import SmallPagination
from common.permissions import (
    HasUNPPPermission,
    current_user_has_permission,
)
from partner.models import Partner
from review.serializers import PartnerFlagSerializer, PartnerVerificationSerializer
from review.models import PartnerFlag, PartnerVerification


class PartnerFlagListCreateAPIView(ListCreateAPIView):
    """
    Endpoint for getting and creating flags
    """
    permission_classes = (
        IsAuthenticated,
        HasUNPPPermission(
            #  TODO: Permissions
        ),
    )
    serializer_class = PartnerFlagSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        return PartnerFlag.objects.filter(partner=self.kwargs['partner_id'])

    def perform_create(self, serializer):
        serializer.save(submitter=self.request.user, partner_id=self.kwargs['partner_id'])


class PartnerVerificationListCreateAPIView(ListCreateAPIView):
    """
    Endpoint for getting and creating partner verifications
    """
    permission_classes = (
        IsAuthenticated,
        HasUNPPPermission(
            agency_permissions=[]
        ),
    )
    serializer_class = PartnerVerificationSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        return PartnerVerification.objects.filter(partner=self.kwargs['partner_id'])

    def perform_create(self, serializer):
        partner = get_object_or_404(Partner, id=self.kwargs['partner_id'])
        if partner.is_hq:
            current_user_has_permission(
                self.request, agency_permissions=[AgencyPermission.VERIFY_INGO_HQ], raise_exception=True
            )
        elif current_user_has_permission(self.request, agency_permissions=[AgencyPermission.VERIFY_CSOS_GLOBALLY]):
            pass
        elif current_user_has_permission(
            self.request, agency_permissions=[AgencyPermission.VERIFY_CSOS_FOR_OWN_COUNTRY]
        ):
            if not partner.country_code == self.request.agency_member.office.country.code:
                raise PermissionDenied

        serializer.save(submitter=self.request.user, partner=partner)


class PartnerFlagRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    """
    Endpoint for updating valid status. Only accepts is_valid
    """
    permission_classes = (
        IsAuthenticated,
        HasUNPPPermission(
            #  TODO: Permissions
        ),
    )
    serializer_class = PartnerFlagSerializer
    schema = None  # Because get_object is called in get_serializer

    def get_queryset(self):
        return PartnerFlag.objects.filter(partner=self.kwargs.get('partner_id'))

    def get_serializer(self, *args, **kwargs):
        flag = self.get_object()
        return PartnerFlagSerializer(
            flag,
            data={
                'is_valid': kwargs['data'].get('is_valid', flag.is_valid)
            },
            partial=True
        )


class PartnerVerificationRetrieveUpdateAPIView(RetrieveUpdateAPIView):
    """
    Endpoint for updating valid status. Only accepts is_valid
    """
    permission_classes = (
        IsAuthenticated,
        HasUNPPPermission(
            #  TODO: Permissions
        ),
    )
    serializer_class = PartnerVerificationSerializer
    schema = None  # Because get_object is called in get_serializer

    def get_queryset(self):
        return PartnerVerification.objects.filter(partner=self.kwargs['partner_id'])

    def get_serializer(self, *args, **kwargs):
        verification = self.get_object()
        return PartnerVerificationSerializer(verification,
                                             data={'is_valid': kwargs['data'].get('is_valid', verification.is_valid)},
                                             partial=True)

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateAPIView, get_object_or_404, RetrieveAPIView

from agency.permissions import AgencyPermission
from common.consts import FLAG_TYPES
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
            agency_permissions=[
                AgencyPermission.VIEW_PROFILE_OBSERVATION_FLAG_COMMENTS,
            ]
        ),
    )
    serializer_class = PartnerFlagSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        return PartnerFlag.objects.filter(partner=self.kwargs['partner_id'])

    def perform_create(self, serializer):
        partner = get_object_or_404(Partner, id=self.kwargs['partner_id'])
        if current_user_has_permission(
            self.request,
            agency_permissions=[AgencyPermission.ADD_FLAG_OBSERVATION_ALL_CSO_PROFILES],
        ):
            pass
        else:
            current_user_has_permission(
                self.request,
                agency_permissions=[AgencyPermission.ADD_FLAG_OBSERVATION_COUNTRY_CSO_PROFILES],
                raise_exception=True
            )
            if partner.is_hq:
                raise PermissionDenied

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
            agency_permissions=[
                AgencyPermission.VIEW_PROFILE_OBSERVATION_FLAG_COMMENTS,
            ]
        ),
    )
    serializer_class = PartnerFlagSerializer

    def get_queryset(self):
        return PartnerFlag.objects.filter(partner=self.kwargs.get('partner_id'))

    def get_object(self):
        flag = super(PartnerFlagRetrieveUpdateAPIView, self).get_object()
        if flag.flag_type == FLAG_TYPES.escalated:
            current_user_has_permission(
                self.request,
                agency_permissions=[AgencyPermission.RESOLVE_ESCALATED_FLAG_ALL_CSO_PROFILES],
                raise_exception=True
            )
        elif not flag.submitter == self.request.user:
            raise PermissionDenied("This flag can only be edited by it's creator")

        return flag


class PartnerVerificationRetrieveUpdateAPIView(RetrieveAPIView):
    permission_classes = (
        IsAuthenticated,
        HasUNPPPermission(
            agency_permissions=[]
        ),
    )
    serializer_class = PartnerVerificationSerializer

    def get_queryset(self):
        return PartnerVerification.objects.filter(partner=self.kwargs['partner_id'])

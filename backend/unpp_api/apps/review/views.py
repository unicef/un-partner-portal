# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers
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
from review.filters import PartnerFlagFilter
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
    filter_backends = (
        DjangoFilterBackend,
    )
    filter_class = PartnerFlagFilter

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
                raise PermissionDenied("You don't have permission to flag HQ profile")
            if not partner.country_code == self.request.agency_member.office.country.code:
                raise PermissionDenied('You do not have permission to flag partner outside your country office.')

        serializer.save(submitter=self.request.user, partner=partner)


class PartnerVerificationListCreateAPIView(ListCreateAPIView):
    """
    Endpoint for getting and creating partner verifications
    """
    permission_classes = (
        IsAuthenticated,
        HasUNPPPermission(
            agency_permissions=[]  # Permissions verified below
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
                raise PermissionDenied('You do not have permission to verify partner outside your country office.')
        else:
            raise PermissionDenied

        if not partner.profile_is_complete:
            raise serializers.ValidationError('You cannot verify partners before they complete their profile.')

        if partner.has_sanction_match:
            raise serializers.ValidationError(
                'Partner has a potential UN Security Council Sanctions List match. '
                'This needs to be resolved before verifying.'
            )

        if partner.hq and not partner.hq.is_verified:
            raise serializers.ValidationError('INGO HQ profile needs to be verified before country office.')

        if partner.has_red_flag:
            raise serializers.ValidationError(
                "This partner has red flags against it's profile. This needs to be resolved before verifying."
            )

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
        partner = get_object_or_404(Partner, id=self.kwargs.get('partner_id'))

        return PartnerFlag.objects.filter(Q(partner=partner) | Q(partner=partner.hq))

    def get_object(self):
        flag = super(PartnerFlagRetrieveUpdateAPIView, self).get_object()
        if not self.request.method == 'GET':
            if flag.flag_type == FLAG_TYPES.escalated:
                current_user_has_permission(
                    self.request,
                    agency_permissions=[AgencyPermission.RESOLVE_ESCALATED_FLAG_ALL_CSO_PROFILES],
                    raise_exception=True
                )
            elif flag.submitter and not flag.submitter == self.request.user:
                raise PermissionDenied("This flag can only be edited by it's creator.")

        return flag


class PartnerVerificationRetrieveAPIView(RetrieveAPIView):
    permission_classes = (
        IsAuthenticated,
        HasUNPPPermission(
            agency_permissions=[]
        ),
    )
    serializer_class = PartnerVerificationSerializer

    def get_queryset(self):
        return PartnerVerification.objects.filter(partner=self.kwargs['partner_id'])

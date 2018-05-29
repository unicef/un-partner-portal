from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView

from account.models import User
from agency.models import AgencyOffice
from agency.permissions import AgencyPermission
from agency.roles import AgencyRole
from common.pagination import SmallPagination
from common.permissions import HasUNPPPermission
from management.filters import AgencyUserFilter, PartnerUserFilter
from management.serializers import AgencyUserManagementSerializer, PartnerOfficeManagementSerializer, \
    AgencyOfficeManagementSerializer, PartnerUserManagementSerializer
from partner.models import Partner
from partner.permissions import PartnerPermission


class UserViewSet(CreateAPIView, ListAPIView, UpdateAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.MANAGE_USERS,
            ],
            partner_permissions=[
                PartnerPermission.MANAGE_USERS,
            ]
        ),
    )
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend,)

    @property
    def filter_class(self):
        if self.request.agency_member:
            return AgencyUserFilter
        elif self.request.partner_member:
            return PartnerUserFilter

    def get_serializer_class(self):
        if self.request.agency_member:
            return AgencyUserManagementSerializer
        elif self.request.partner_member:
            return PartnerUserManagementSerializer

    def get_queryset(self):
        queryset = User.objects.none()
        if self.request.agency_member:
            queryset = User.objects.filter(agency_members__office__agency=self.request.user.agency).distinct('id')
        elif self.request.partner_member:
            query = Q(partner_members__partner=self.request.partner_member.partner)
            if self.request.partner_member.partner.is_hq:
                query |= Q(partner_members__partner__hq=self.request.partner_member.partner)

            queryset = User.objects.filter(query).distinct('id')

        # We don't want user to edit own account
        return queryset.exclude(id=self.request.user.id)


class OfficeListView(ListAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.MANAGE_USERS,
            ],
            partner_permissions=[
                PartnerPermission.MANAGE_USERS,
            ]
        ),
    )

    def get_queryset(self):
        if self.request.agency_member:
            queryset = AgencyOffice.objects.filter(agency=self.request.user.agency)
            if not self.request.agency_member.role == AgencyRole.HQ_EDITOR.name:
                # Only HQ_EDITOR users can assign users freely between all offices
                queryset = queryset.filter(agency_members__user=self.request.user)
            return queryset
        elif self.request.partner_member:
            query = Q(id=self.request.partner_member.partner_id)
            if self.request.partner_member.partner.is_hq:
                query |= Q(hq=self.request.partner_member.partner)

            return Partner.objects.filter(query)
        return Partner.objects.none()

    def get_serializer_class(self):
        if self.request.agency_member:
            return AgencyOfficeManagementSerializer
        else:
            return PartnerOfficeManagementSerializer

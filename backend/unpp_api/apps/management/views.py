from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView

from account.models import User
from agency.models import AgencyOffice
from agency.permissions import AgencyPermission
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
                AgencyPermission.MANAGE_OWN_AGENCY_USERS,
            ],
            partner_permissions=[
                PartnerPermission.MANAGE_OFFICE_USERS,
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
        if self.request.agency_member:
            return User.objects.filter(agency_members__office__agency=self.request.user.agency).distinct('id')
        elif self.request.partner_member:
            query = Q(partner_members__partner=self.request.partner_member.partner)
            if self.request.partner_member.partner.is_hq:
                query |= Q(partner_members__partner__hq=self.request.partner_member.partner)

            return User.objects.filter(query).distinct('id')


class OfficeListView(ListAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.MANAGE_OWN_AGENCY_USERS,
            ],
            partner_permissions=[
                PartnerPermission.MANAGE_OFFICE_USERS,
            ]
        ),
    )

    def get_queryset(self):
        if self.request.agency_member:
            return AgencyOffice.objects.filter(agency=self.request.user.agency)
        elif self.request.partner_member:
            query = Q(id=self.request.partner_member.partner_id)
            if self.request.partner_member.partner.is_hq:
                query |= Q(hq=self.request.partner_member.partner)

            return Partner.objects.filter(query)

    def get_serializer_class(self):
        if self.request.agency_member:
            return AgencyOfficeManagementSerializer
        elif self.request.partner_member:
            return PartnerOfficeManagementSerializer

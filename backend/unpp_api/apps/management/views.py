from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView

from account.models import User
from agency.models import AgencyOffice
from agency.permissions import AgencyPermission
from common.permissions import HasUNPPPermission
from management.serializers import AgencyUserManagementSerializer, PartnerOfficeManagementSerializer, \
    AgencyOfficeManagementSerializer, PartnerUserManagementSerializer
from partner.models import Partner


class UserViewSet(CreateAPIView, ListAPIView, UpdateAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.MANAGE_OWN_AGENCY_USERS
            ]
        ),
    )

    def get_serializer_class(self):
        if self.request.agency_member:
            return AgencyUserManagementSerializer
        elif self.request.partner_member:
            return PartnerUserManagementSerializer

    def get_queryset(self):
        if self.request.agency_member:
            return User.objects.filter(agency_members__office__agency=self.request.user.agency)
        elif self.request.partner_member:
            # TODO: Filter
            return User.objects.all()


class OfficeListView(ListAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.MANAGE_OWN_AGENCY_USERS
            ]
        ),
    )

    def get_queryset(self):
        if self.request.agency_member:
            return AgencyOffice.objects.filter(agency=self.request.user.agency)
        elif self.request.partner_member:
            # TODO: Filter
            return Partner.objects.all()

    def get_serializer_class(self):
        if self.request.agency_member:
            return AgencyOfficeManagementSerializer
        elif self.request.partner_member:
            return PartnerOfficeManagementSerializer

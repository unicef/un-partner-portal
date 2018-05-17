from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView

from account.models import User
from agency.permissions import AgencyPermission
from common.permissions import HasUNPPPermission
from management.serializers import AgencyUserManagementSerializer


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
            return None

    def get_queryset(self):
        return User.objects.filter(agency_members__office__agency=self.request.user.agency)

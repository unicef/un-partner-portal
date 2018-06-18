from django.db.models import Q

from common.permissions import current_user_has_permission
from partner.permissions import PartnerPermission


class FilterUsersPartnersMixin(object):

    def get_queryset(self):
        queryset = super(FilterUsersPartnersMixin, self).get_queryset()
        query = Q(id=self.request.active_partner.id)
        if self.request.active_partner.is_hq:
            query |= Q(hq=self.request.active_partner)

        return queryset


class VerifyPartnerProfileUpdatePermissionsMixin(object):

    def perform_update(self, serializer):
        current_user_has_permission(
            self.request,
            partner_permissions=[
                PartnerPermission.EDIT_HQ_PROFILE if serializer.instance.is_hq else PartnerPermission.EDIT_PROFILE
            ],
            raise_exception=True
        )

        return super(VerifyPartnerProfileUpdatePermissionsMixin, self).perform_update(serializer)

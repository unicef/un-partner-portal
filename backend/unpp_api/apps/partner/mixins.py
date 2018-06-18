from django.db.models import Q
from django.db.models.constants import LOOKUP_SEP

from common.permissions import current_user_has_permission
from partner.permissions import PartnerPermission


class FilterUsersPartnersMixin(object):

    partner_field = ''

    def get_queryset(self):
        queryset = super(FilterUsersPartnersMixin, self).get_queryset()
        query = Q(**{
            LOOKUP_SEP.join(filter(None, [self.partner_field, 'id'])): self.request.active_partner.id
        })
        if self.request.active_partner.is_hq:
            query |= Q(**{
                LOOKUP_SEP.join(filter(None, [self.partner_field, 'hq_id'])): self.request.active_partner.id
            })

        return queryset.filter(query)


class VerifyPartnerProfileUpdatePermissionsMixin(object):

    def perform_update(self, serializer):
        partner = serializer.instance.partner if hasattr(serializer.instance, 'partner') else serializer.instance

        current_user_has_permission(
            self.request,
            partner_permissions=[
                PartnerPermission.EDIT_HQ_PROFILE if partner.is_hq else PartnerPermission.EDIT_PROFILE
            ],
            raise_exception=True
        )

        return super(VerifyPartnerProfileUpdatePermissionsMixin, self).perform_update(serializer)

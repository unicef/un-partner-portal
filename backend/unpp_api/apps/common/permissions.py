import logging

from rest_framework.permissions import IsAuthenticated

logger = logging.getLogger(__name__)


class CustomizablePermission(IsAuthenticated):

    def __call__(self, *args, **kwargs):
        # Need this to get around calling __init__ when setting up permission
        return self


class HasUNPPPermission(CustomizablePermission):

    def __init__(self, agency_permissions=None, partner_permissions=None):
        self.agency_permissions = agency_permissions or []
        self.partner_permissions = partner_permissions or []

    def has_permission(self, request, view):
        if not super(HasUNPPPermission, self).has_permission(request, view):
            return False

        if request.office_member:
            return set(self.agency_permissions).issubset(request.office_member.user_permissions)
        elif request.active_partner:
            # TODO
            return True

        return False

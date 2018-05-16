import logging

from rest_framework.permissions import IsAuthenticated

logger = logging.getLogger(__name__)


class CustomizablePermission(IsAuthenticated):

    def __call__(self, *args, **kwargs):
        # Need this to get around calling __init__ when setting up permission
        return self


class HasUNPPPermission(CustomizablePermission):

    def __init__(self, agency_permissions=None, partner_permissions=None):
        self.agency_permissions = agency_permissions
        self.partner_permissions = partner_permissions

    def has_permission(self, request, view):
        if not super(HasUNPPPermission, self).has_permission(request, view):
            return False

        if self.agency_permissions is not None and request.agency_member:
            return set(self.agency_permissions).issubset(request.agency_member.user_permissions)
        elif self.partner_permissions is not None and request.partner_member:
            return set(self.partner_permissions).issubset(request.partner_member.user_permissions)

        # TODO: Disallow by default once all views have permissions properly saved up
        return True

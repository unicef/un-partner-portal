from rest_framework.exceptions import NotAuthenticated, PermissionDenied
from rest_framework.permissions import IsAuthenticated


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

        if not any((request.agency_member, request.partner_member)):
            raise NotAuthenticated('Neither Partner nor Agency info available for current user')

        return False


def check_current_user_has_permission(request, agency_permissions=None, partner_permissions=None):
    if agency_permissions is not None and request.agency_member:
        if set(agency_permissions).issubset(request.agency_member.user_permissions):
            return
    elif partner_permissions is not None and request.partner_member:
        if set(partner_permissions).issubset(request.partner_member.user_permissions):
            return
    raise PermissionDenied()


# class method decorator
def check_unpp_permission(agency_permissions=None, partner_permissions=None):
    def has_unpp_permission_method_decorator(class_method):

        def has_unpp_permission_inner(self, *args, **kwargs):
            check_current_user_has_permission(
                self.request, agency_permissions=agency_permissions, partner_permissions=partner_permissions
            )
            return class_method(self, *args, **kwargs)

        return has_unpp_permission_inner
    return has_unpp_permission_method_decorator

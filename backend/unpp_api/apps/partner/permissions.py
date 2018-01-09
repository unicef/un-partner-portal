from rest_framework.permissions import BasePermission


class IsAgencyUserOrPartnerMember(BasePermission):

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated():
            return False

        if request.user.is_agency_user:
            return True
        elif request.user.is_partner:
            return request.user.partner_members.filter(partner=obj).exists()

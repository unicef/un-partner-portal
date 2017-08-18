import logging
from rest_framework.permissions import BasePermission
from agency.models import AgencyMember
from partner.models import PartnerMember
from .consts import POWER_MEMBER_ROLES, MEMBER_ROLES

logger = logging.getLogger(__name__)


class IsAuthenticated(BasePermission):
    """
    Allows access only to authenticated users.
    """

    def has_permission(self, request, view):
        return request.user.is_authenticated()


class IsAtLeastMemberReader(BasePermission):
    """
    Allows access only to user that has at least Reader role (Partner or Agency member).
    """

    MIN_POWER = POWER_MEMBER_ROLES[MEMBER_ROLES.reader]

    def pass_at_least(self, role):
        power = POWER_MEMBER_ROLES[role]
        return power >= self.MIN_POWER

    def has_permission(self, request, view):
        member = PartnerMember.objects.filter(user=request.user).first()
        if member:
            role = member.role
        else:
            member = AgencyMember.objects.filter(user=request.user).first()
            if member is None:
                logger.error("User has no member object like partner or agency")
                return False
            role = member.role
        return self.pass_at_least(role)

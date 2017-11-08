import logging
from django.shortcuts import get_object_or_404
from rest_framework.permissions import BasePermission
from agency.models import AgencyMember
from partner.models import Partner, PartnerMember
from project.models import Application
from .consts import POWER_MEMBER_ROLES, MEMBER_ROLES

logger = logging.getLogger(__name__)


class IsAgencyMemberUser(BasePermission):

    def has_permission(self, request, user):
        if not request.user.is_authenticated():
            return False

        return request.user.is_agency_user


class IsAtLeastMemberReader(BasePermission):
    """
    Allows access only to user that has at least Reader role (Partner or Agency member).
    """

    MIN_POWER = POWER_MEMBER_ROLES[MEMBER_ROLES.reader]

    def pass_at_least(self, role, min_power=None):
        """
        POWER_MEMBER_ROLES contain negative integers or zero to admin.
        In that case it's very easy to present is member power stronger (less negative) then expected.
        :param role: one of common.consts.MEMBER_ROLES
        :param min_power: min power controlled by given extra param instead of const var
        :rtype Boolean
        """
        power = POWER_MEMBER_ROLES[role]
        return power >= (self.MIN_POWER if min_power is not None else min_power)

    def has_permission(self, request, view):
        try:
            member = PartnerMember.objects.get(user=request.user)
        except PartnerMember.DoesNotExist:
            member = None

        if member is None:
            try:
                member = AgencyMember.objects.get(user=request.user)
            except AgencyMember.DoesNotExist:
                member = None

        if member is None:
            logger.error(
                "User (pk: {}) has no member object like partner or agency. Data are not integrated!".format(
                    request.user.id
                ))
            return False

        return self.pass_at_least(member.role)


class IsAtLeastMemberEditor(IsAtLeastMemberReader):

    MIN_POWER = POWER_MEMBER_ROLES[MEMBER_ROLES.editor]


class IsAtLeastAgencyMemberEditor(IsAtLeastMemberReader):

    MIN_POWER = POWER_MEMBER_ROLES[MEMBER_ROLES.editor]

    def has_permission(self, request, view):
        if PartnerMember.objects.filter(user=request.user).exists():
            return False

        try:
            member = AgencyMember.objects.get(user=request.user)
        except AgencyMember.DoesNotExist:
            logger.error(
                "User (pk: {}) has no member object like partner or agency. Data are not integrated!".format(
                    request.user.id
                ))
            return False

        return self.pass_at_least(member.role)


class IsAtLeastPartnerMemberEditor(IsAtLeastMemberReader):

    MIN_POWER = POWER_MEMBER_ROLES[MEMBER_ROLES.editor]

    def has_permission(self, request, view):
        if AgencyMember.objects.filter(user=request.user).exists():
            return False

        try:
            member = PartnerMember.objects.get(user=request.user)
        except PartnerMember.DoesNotExist:
            logger.error(
                "User (pk: {}) has no member object like partner or agency. Data are not integrated!".format(
                    request.user.id
                ))
            return False

        return self.pass_at_least(member.role)


class IsEOIReviewerAssessments(BasePermission):

    def has_permission(self, request, view):
        application_id = request.parser_context.get('kwargs', {}).get(view.lookup_url_kwarg)
        reviewer_id = request.parser_context.get('kwargs', {}).get(view.lookup_field)
        app = Application.objects.select_related('eoi').filter(id=application_id)
        if app.exists():
            eoi = app.get().eoi
            if eoi.reviewers.filter(id=request.user.id).exists():
                if reviewer_id and int(reviewer_id) == request.user.id:
                    return True
            if eoi.created_by_id == request.user.id:
                return True
            if eoi.focal_points.filter(id=request.user.id).exists():
                return True

        return False


class IsPartner(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_partner_user


class IsApplicationAPIEditor(IsAtLeastMemberReader):

    MIN_POWER = POWER_MEMBER_ROLES[MEMBER_ROLES.editor]

    def has_permission(self, request, view):
        app_id = request.parser_context.get('kwargs', {}).get(view.lookup_field)
        app = get_object_or_404(Application.objects.select_related('eoi'), id=app_id)
        am = AgencyMember.objects.filter(user=request.user).first()
        if am is not None:
            if app.agency != am.office.agency:
                return False
            if request.method == 'GET':
                return True  # all
            else:
                return self.pass_at_least(am.role)

        else:
            pm = PartnerMember.objects.filter(user=request.user).first()

            partner_ids = [request.active_partner.id]
            if request.active_partner.is_hq:
                partner_ids.extend(Partner.objects.filter(hq=request.active_partner).values_list('id', flat=True))

            if app.partner.id in partner_ids:
                if request.method == 'GET':
                    return True  # all
                else:
                    return self.pass_at_least(pm.role)

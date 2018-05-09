import logging
from django.shortcuts import get_object_or_404
from rest_framework.permissions import BasePermission
from agency.models import AgencyMember
from partner.models import PartnerMember
from project.models import Application
from .consts import PARTNER_MEMBER_POWER, PARTNER_ROLES

logger = logging.getLogger(__name__)


class IsAgencyMemberUser(BasePermission):

    def has_permission(self, request, view):
        if not request.user.is_authenticated():
            return False

        return request.user.is_agency_user


class IsAtLeastMemberReader(BasePermission):
    """
    Allows access only to user that has at least Reader role (Partner or Agency member).
    """

    MIN_POWER = PARTNER_MEMBER_POWER[PARTNER_ROLES.reader]

    def pass_at_least(self, role):
        """
        POWER_MEMBER_ROLES contain negative integers or zero to admin.
        In that case it's very easy to present is member power stronger (less negative) then expected.
        :param role: one of common.consts.MEMBER_ROLES
        :rtype Boolean
        """
        power = PARTNER_MEMBER_POWER[role]
        return power >= self.MIN_POWER

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

    MIN_POWER = PARTNER_MEMBER_POWER[PARTNER_ROLES.editor]


class IsAtLeastAgencyMemberEditor(IsAtLeastMemberReader):

    MIN_POWER = PARTNER_MEMBER_POWER[PARTNER_ROLES.editor]

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

    MIN_POWER = PARTNER_MEMBER_POWER[PARTNER_ROLES.editor]

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


class IsAgency(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_agency_user


class IsAtLeastEditorPartnerOnNotGET(IsAtLeastMemberReader):

    MIN_POWER = PARTNER_MEMBER_POWER[PARTNER_ROLES.editor]

    def has_permission(self, request, view):
        if request.method != 'GET':
            if request.user.is_partner_user:
                return self.pass_at_least(request.user.member.role)
            return False
        return True


class IsRoleAdministratorOnNotGET(IsAtLeastEditorPartnerOnNotGET):

    MIN_POWER = PARTNER_MEMBER_POWER[PARTNER_ROLES.admin]


class IsApplicationAPIEditor(IsAtLeastMemberReader):

    MIN_POWER = PARTNER_MEMBER_POWER[PARTNER_ROLES.editor]

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
            if app.partner.id in request.user.get_partner_ids_i_can_access():
                if request.method == 'GET':
                    return True  # all
                else:
                    return self.pass_at_least(request.user.member.role)


class IsConvertUnsolicitedEditor(IsAtLeastMemberReader):

    MIN_POWER = PARTNER_MEMBER_POWER[PARTNER_ROLES.editor]

    def has_object_permission(self, request, view, obj):
        if obj.is_unsolicited:
            return True
        return False

    def has_permission(self, request, view):
        if not request.user.is_agency_user:
            return False

        user_agency = request.user.get_agency()
        member = request.user.member
        app_id = request.parser_context.get('kwargs', {}).get(view.lookup_field)
        app = get_object_or_404(Application.objects.select_related('eoi'), id=app_id)
        if app.agency.id != user_agency.id:
            return False

        return self.pass_at_least(member.role)


class IsApplicationFeedbackPerm(IsAtLeastMemberReader):

    MIN_POWER = PARTNER_MEMBER_POWER[PARTNER_ROLES.editor]

    def has_permission(self, request, view):
        app_id = request.parser_context.get('kwargs', {}).get(view.lookup_field)
        app = get_object_or_404(Application.objects.select_related('eoi'), id=app_id)

        if request.user.is_partner_user:
            if request.method == 'GET' and app.partner.id == request.user.member.partner.id:
                return True
            return False

        # agency
        user_agency = request.user.get_agency()
        if app.agency.id != user_agency.id:
            return False
        if request.method != 'GET':
            return self.pass_at_least(request.user.member.role)  # editor & admin can post
        else:
            # agency reader can read
            return True


class IsPartnerEOIApplicationCreate(IsAtLeastPartnerMemberEditor):

    def has_permission(self, request, view):
        if request.user.is_agency_user:
            return False

        if request.method != 'GET':
            return request.user.member and self.pass_at_least(request.user.member.role)
        else:
            return True


class IsPartnerEOIApplicationDestroy(IsAtLeastPartnerMemberEditor):

    def has_permission(self, request, view):
        if request.user.is_agency_user:
            return False

        if request.method != 'GET':
            app_id = request.parser_context.get('kwargs', {}).get(view.lookup_field)
            app = get_object_or_404(Application, id=app_id)
            if app.submitter == request.user.id:
                return True
            return request.user.member and self.pass_at_least(request.user.member.role)
        else:
            return True


class IsAgencyProject(IsAtLeastMemberReader):

    MIN_POWER = PARTNER_MEMBER_POWER[PARTNER_ROLES.editor]

    def has_permission(self, request, view):
        if request.method == 'GET':
            return True  # all
        elif request.user.is_agency_user:
            return self.pass_at_least(request.user.member.role)
        return False


class HasAgencyPermission(BasePermission):

    def __init__(self, *permissions):
        self.permissions = permissions

    def has_permission(self, request, view):
        return set(self.permissions).issubset(request.user.agency_permissions)

    def __call__(self, *args, **kwargs):
        return self

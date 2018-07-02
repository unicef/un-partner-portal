from django.utils.functional import SimpleLazyObject

from common.headers import CustomHeader
from partner.models import Partner


def get_partner_and_member_objects(request):
    partner_id = request.META.get(CustomHeader.PARTNER_ID.value, None)
    partner = None
    partner_member = None

    if request.user.is_authenticated():
        # HQ profiles ability to log in as any country office complicates code a bit here
        # since they won't have a corresponding PartnerMember object
        active_partner_members = request.user.partner_members.exclude(partner__is_locked=True)

        partner_member = active_partner_members.filter(
            partner_id=partner_id
        ).first() or active_partner_members.filter(
            partner__children__id=partner_id
        ).first()

        if partner_member:
            partner = Partner.objects.filter(id=partner_id).first()

    if not partner and partner_member:
        partner = partner_member.partner

    return partner, partner_member


class ActivePartnerMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.active_partner, request.partner_member = SimpleLazyObject(lambda: get_partner_and_member_objects(
            request
        ))
        response = self.get_response(request)
        return response


def get_office_member_object(request):
    if request.user.is_authenticated():
        agency_members = request.user.agency_members.first()
        if not agency_members:
            return None

        office_id = request.META.get(CustomHeader.AGENCY_OFFICE_ID.value, None)

        if office_id:
            return request.user.agency_members.filter(office_id=office_id).first()

    return None


class ActiveAgencyOfficeMiddleware(object):

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.agency_member = SimpleLazyObject(lambda: get_office_member_object(request))
        response = self.get_response(request)
        return response


class ClientTimezoneMiddleware(object):

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.timezone_name = request.META.get('HTTP_CLIENT_TIMEZONE_NAME', 'UTC')
        response = self.get_response(request)
        return response

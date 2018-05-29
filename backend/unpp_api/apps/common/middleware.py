from django.core.exceptions import ObjectDoesNotExist
from django.utils.functional import SimpleLazyObject
from django.conf import settings

from partner.models import PartnerMember


def get_partner_object(request):
    partner_id = request.META.get('HTTP_PARTNER_ID', None)
    partner = None
    partner_member = None

    if request.user.is_authenticated():
        if partner_id:
            partner_member = PartnerMember.objects.filter(user=request.user, partner_id=partner_id).first()

    if partner_member:
        partner = partner_member.partner

    return partner, partner_member


class ActivePartnerMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.active_partner, request.partner_member = SimpleLazyObject(lambda: get_partner_object(request))
        response = self.get_response(request)
        return response


def get_office_member_object(request):
    if request.user.is_authenticated():
        agency_members = request.user.agency_members.first()
        if not agency_members:
            return None

        office_id = request.META.get('HTTP_AGENCY_OFFICE_ID', None)

        if office_id:
            try:
                return request.user.agency_members.get(office_id=office_id)
            except ObjectDoesNotExist:
                return None

    return None


class ActiveAgencyOfficeMiddleware(object):

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.agency_member = SimpleLazyObject(lambda: get_office_member_object(request))
        response = self.get_response(request)
        return response

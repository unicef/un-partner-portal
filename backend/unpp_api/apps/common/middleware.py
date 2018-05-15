from django.core.exceptions import ObjectDoesNotExist
from django.utils.functional import SimpleLazyObject
from django.conf import settings

from partner.models import Partner


def get_partner_object(request):
    partner_id = request.META.get('HTTP_PARTNER_ID', None)
    partner = None

    if partner_id:
        try:
            partner = Partner.objects.get(id=partner_id)
        except Partner.DoesNotExist:
            pass

    # for easier development process
    # should be removed when we finish whole logic for http headers (like: HTTP_ACTIVE_PARTNER)
    # TODO
    if settings.IS_DEV:
        partner = Partner.objects.first()
    return partner, None


class ActivePartnerMiddleware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.active_partner, request.partner_member = SimpleLazyObject(lambda: get_partner_object(request))
        response = self.get_response(request)
        return response


def get_office_member_object(request):
    agency_members = request.user.agency_members.first()
    if not agency_members:
        return None

    office_id = request.META.get('HTTP_AGENCY_OFFICE_ID', None)

    if office_id:
        try:
            return request.user.agency_members.filter(office_id=office_id)
        except ObjectDoesNotExist:
            return None

    if settings.IS_DEV:
        # TODO: Remove once header is added on the frontend
        return request.user.agency_members.first()
    return None


class ActiveAgencyOfficeMiddleware(object):

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.office_member = SimpleLazyObject(lambda: get_office_member_object(request))
        response = self.get_response(request)
        return response

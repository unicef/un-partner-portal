from django.utils.functional import SimpleLazyObject
from django.conf import settings

from partner.models import Partner


def get_actual_value(request):
    partner_id = request.META.get('HTTP_ACTIVE_PARTNER', None)

    if partner_id:
        try:
            return Partner.objects.get(id=partner_id)
        except Partner.DoesNotExist:
            return None
    # for easier development process
    # should be removed when we finish whole logic for http headers (like: HTTP_ACTIVE_PARTNER)
    if settings.IS_DEV:
        return Partner.objects.first()
    return None

class ActivePartnerMiddlewware(object):
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.active_partner = SimpleLazyObject(lambda: get_actual_value(request))
        response = self.get_response(request)
        return response

from partner.models import Partner


class PartnerIdsMixin(object):

    __partner_ids = None

    def get_partner_ids(self):
        if self.__partner_ids is None:
            if hasattr(self, 'request'):
                active_partner = self.request.active_partner
            else:
                active_partner = self.context['request'].active_partner

            self.__partner_ids = [active_partner.id]
            if active_partner.is_hq:
                self.__partner_ids.extend(Partner.objects.filter(hq=active_partner).values_list('id', flat=True))
            return self.__partner_ids
        else:
            return self.__partner_ids
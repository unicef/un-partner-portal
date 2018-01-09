from partner.models import Partner


class FilterAvailablePartnersMixin(object):

    queryset = Partner.objects.all()

    def get_queryset(self):
        qs = super(FilterAvailablePartnersMixin, self).get_queryset()

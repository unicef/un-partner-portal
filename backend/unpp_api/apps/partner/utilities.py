from datetime import date

from django.db.models import Q

from partner.models import PartnerBudget


def get_recent_budgets_for_partner(partner):
    current_year = date.today().year
    budgets = PartnerBudget.objects.filter(partner=partner, year__gte=current_year - 2)
    if not budgets.count() == 3:
        budgets = [
            PartnerBudget.objects.get_or_create(partner=partner, year=current_year)[0],
            PartnerBudget.objects.get_or_create(partner=partner, year=current_year - 1)[0],
            PartnerBudget.objects.get_or_create(partner=partner, year=current_year - 2)[0],
        ]
    return budgets


class FilterUsersPartnersMixin(object):

    def get_queryset(self):
        queryset = super(FilterUsersPartnersMixin, self).get_queryset()
        query = Q(id=self.request.active_partner.id)
        if self.request.active_partner.is_hq:
            query |= Q(hq=self.request.active_partner)

        return queryset

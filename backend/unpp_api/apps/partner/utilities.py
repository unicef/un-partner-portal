from datetime import date

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

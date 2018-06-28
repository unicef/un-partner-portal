from datetime import date

from notification.helpers import send_partner_marked_for_deletion_email
from partner.models import PartnerBudget, Partner


def get_recent_budgets_for_partner(partner: Partner):
    current_year = date.today().year
    budgets = PartnerBudget.objects.filter(partner=partner, year__gte=current_year - 2)
    if not budgets.count() == 3:
        budgets = [
            PartnerBudget.objects.get_or_create(partner=partner, year=current_year)[0],
            PartnerBudget.objects.get_or_create(partner=partner, year=current_year - 1)[0],
            PartnerBudget.objects.get_or_create(partner=partner, year=current_year - 2)[0],
        ]
    return budgets


def lock_partner_for_deactivation(partner: Partner):
    partner.is_locked = True
    partner.save()
    send_partner_marked_for_deletion_email(partner)

    if partner.is_hq:
        for child_profile in partner.children.all():
            lock_partner_for_deactivation(child_profile)

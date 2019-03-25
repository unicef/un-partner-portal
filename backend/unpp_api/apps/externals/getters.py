from django.db.models import Sum
from django.utils import timezone

from agency.agencies import UNICEF
from externals.models import PartnerVendorNumber, UNICEFVendorData


def get_unicef_cash_transfers_to_partner_for_year(partner, year: int=None):
    year = year or timezone.now().year

    vendor_number = PartnerVendorNumber.objects.filter(
        parnter=partner,
        agency=UNICEF.model_instance
    )
    if not vendor_number:
        return None

    return UNICEFVendorData.objects.filter(
        vendor_number=vendor_number.number, year=year
    ).order_by().annotate(total=Sum('cash_transfers_this_year'))['total']

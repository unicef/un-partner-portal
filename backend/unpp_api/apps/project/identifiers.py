from django.db import transaction

from sequences import get_next_value

from django.utils import timezone
from django_countries.fields import Country


def get_eoi_display_identifier(agency_name: str, country_code: str, year=None):
    year = year or timezone.now().year

    agency_code = agency_name[-3:].upper()
    country_code = Country(code=country_code).alpha3.upper()

    sequence_name = f"{agency_code}-{country_code}-{year}"

    with transaction.atomic():
        sub_id = get_next_value(sequence_name)

    return f"{agency_code}/{country_code}/{year}/{str(sub_id).zfill(3)}"

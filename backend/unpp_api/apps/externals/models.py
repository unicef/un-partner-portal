from django.db import models
from model_utils.models import TimeStampedModel

from common.business_areas import BUSINESS_AREAS, BUSINESS_AREA_TO_CODE
from common.database_fields import FixedTextField


class PartnerVendorNumber(TimeStampedModel):

    partner = models.ForeignKey('partner.Partner', related_name='vendor_numbers')
    agency = models.ForeignKey('agency.Agency', related_name='vendor_numbers')
    business_area = FixedTextField(choices=BUSINESS_AREAS, null=True, blank=True)
    number = models.TextField(max_length=1024)

    class Meta:
        unique_together = (
            ('agency', 'partner'),
            ('agency', 'partner', 'number'),
        )

    def __str__(self):
        return f"[{self.agency.name}] {self.partner} Vendor Number #{self.number}"

    @property
    def business_area_code(self):
        return BUSINESS_AREA_TO_CODE[self.business_area]


class UNICEFVendorData(TimeStampedModel):

    business_area = FixedTextField(choices=BUSINESS_AREAS)
    vendor_number = models.TextField(max_length=1024)
    vendor_name = models.TextField(max_length=1024)
    year = models.IntegerField()
    total_cash_transfers = models.FloatField()
    cash_transfers_this_year = models.FloatField(
        help_text='Total amount received Year-To-Date. This will be set back to 0 each year on the 1st of Jan.'
    )

    class Meta:
        unique_together = (
            ('business_area', 'vendor_number', 'year'),
        )

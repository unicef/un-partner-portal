from django.db import models
from model_utils.models import TimeStampedModel


class PartnerVendorNumber(TimeStampedModel):

    partner = models.ForeignKey('partner.Partner', related_name='vendor_numbers')
    agency = models.ForeignKey('agency.Agency', related_name='vendor_numbers')
    number = models.TextField(max_length=1024)

    class Meta:
        unique_together = (
            ('agency', 'partner'),
            ('agency', 'partner', 'number'),
        )

    def __str__(self):
        return f"[{self.agency.name}] {self.partner} Vendor Number #{self.number}"

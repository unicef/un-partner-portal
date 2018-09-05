from django.db import models
from model_utils.models import TimeStampedModel

from common.database_fields import FixedTextField


class MigratedTimeStampedModel(TimeStampedModel):
    SOURCE_UNHCR = 'UNHCR'
    SOURCE_CHOICES = (
        (SOURCE_UNHCR, 'UNHCR Database'),
    )

    migrated_from = FixedTextField(choices=SOURCE_CHOICES, null=True, blank=True, editable=False)
    migrated_original_id = models.PositiveIntegerField(null=True, blank=True, editable=False)
    migrated_timestamp = models.DateTimeField(null=True, blank=True, editable=False)

    class Meta:
        abstract = True

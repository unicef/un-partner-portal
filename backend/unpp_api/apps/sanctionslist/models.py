# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from model_utils.models import TimeStampedModel

from common.consts import SANCTION_LIST_TYPES, SANCTION_MATCH_TYPES


class SanctionedItem(TimeStampedModel):
    sanctioned_type = models.CharField(max_length=3, choices=SANCTION_LIST_TYPES)
    is_active = models.BooleanField(default=True)
    data_id = models.IntegerField(db_index=True, unique=True)
    listed_on = models.DateField(null=True, blank=True)
    last_updated = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.__class__.__name__} [{self.pk}] {self.get_sanctioned_type_display()}"


class SanctionedName(TimeStampedModel):
    item = models.ForeignKey(SanctionedItem, related_name='check_names')
    name = models.TextField()
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = (
            ('item', 'name'),
        )

    def __str__(self):
        return f"{self.__class__.__name__} [{self.pk}] {self.name}"


class SanctionedNameMatch(TimeStampedModel):
    name = models.ForeignKey(SanctionedName, related_name='matches')
    can_ignore = models.BooleanField(default=False)
    partner = models.ForeignKey('partner.Partner', related_name='sanction_matches')
    match_type = models.CharField(max_length=3, choices=SANCTION_MATCH_TYPES)
    match_text = models.TextField(null=True, blank=True)
    can_ignore_text = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = (
            ('name', 'partner'),
        )

    def __str__(self):
        return "Partner:{} Name:{}".format(self.partner, self.name)

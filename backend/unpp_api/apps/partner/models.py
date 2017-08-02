# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from model_utils.models import TimeStampedModel


class Partner(TimeStampedModel):
    """

    """
    name = models.CharField(max_length=255)
    # display_type = International, national

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Partner: {} <pk:{}>".format(self.name, self.id)


class PartnerOperation(TimeStampedModel):
    """

    """
    partner = models.ForeignKey(Partner, related_name="partner_operations")
    country = models.ForeignKey('common.Country', related_name="partner_operations")
    is_hq = models.BooleanField(default=True, verbose_name='Is HQ?')

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerOperation <pk:{}>".format(self.id)


class PartnerOperationMember(TimeStampedModel):
    """

    """
    user = models.ForeignKey('account.User', related_name="partner_operation_members")
    operation = models.ForeignKey(PartnerOperation, related_name="partner_operation_members")
    # role = ??? the same that we have in agency?

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models

from model_utils.models import TimeStampedModel

from common.consts import FLAG_TYPES


class PartnerFlag(TimeStampedModel):
    """
    Flags on a Partner
    """
    partner = models.ForeignKey('partner.Partner', related_name="flags")
    flag_type = models.CharField(
        max_length=3, choices=FLAG_TYPES, default=FLAG_TYPES.yellow)
    is_valid = models.BooleanField(default=True)
    submitter = models.ForeignKey('account.User', related_name="given_flags")
    comment = models.TextField(null=True, blank=True)
    contact_person = models.CharField(max_length=255, null=True, blank=True)
    contact_phone = models.CharField(max_length=16, null=True, blank=True)
    contact_email = models.EmailField(null=True, blank=True)
    attachment = models.FileField(null=True, blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Partner: {} Flag Type::{}>".format(self.partner, self.flag_type)


class PartnerVerification(TimeStampedModel):
    """
    Verification on a Partner
    """
    partner = models.ForeignKey(
        'partner.Partner', related_name="verifications")
    is_valid = models.BooleanField(default=True)
    is_verified = models.BooleanField()
    submitter = models.ForeignKey(
        'account.User', related_name="given_verifications")
    is_cert_uploaded = models.BooleanField()
    cert_uploaded_comment = models.TextField(null=True, blank=True)
    is_mm_consistent = models.BooleanField()
    mm_consistent_comment = models.TextField(null=True, blank=True)
    is_indicate_results = models.BooleanField()
    indicate_results_comment = models.TextField(null=True, blank=True)
    is_rep_risk = models.BooleanField()
    rep_risk_comment = models.TextField(null=True, blank=True)
    is_yellow_flag = models.BooleanField()
    yellow_flag_comment = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return "Partner: {} Verified:{}>".format(self.partner, self.is_verified)

    def _passed_verify(self):
        return all([self.is_cert_uploaded, self.is_mm_consistent, self.is_indicate_results,
                    not self.is_rep_risk, not self.is_yellow_flag])

    def save(self, *args, **kwargs):
        self.is_verified = self._passed_verify()
        super(PartnerVerification, self).save(*args, **kwargs)

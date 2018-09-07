# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.db import models

from model_utils.models import TimeStampedModel

from common.consts import FLAG_TYPES, FLAG_CATEGORIES
from common.database_fields import FixedTextField


class PartnerFlag(TimeStampedModel):
    """
    Flags on a Partner
    """
    partner = models.ForeignKey('partner.Partner', related_name="flags")
    flag_type = FixedTextField(choices=FLAG_TYPES, default=FLAG_TYPES.yellow)
    type_history = ArrayField(flag_type, default=list, blank=True, null=True)
    category = FixedTextField(choices=FLAG_CATEGORIES, null=True, blank=True)
    is_valid = models.NullBooleanField(default=True)
    submitter = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="given_flags", null=True)
    comment = models.TextField(null=True, blank=True, max_length=5120)
    validation_comment = models.TextField(null=True, blank=True, max_length=5120)
    contact_person = models.CharField(max_length=255, null=True, blank=True)
    contact_phone = models.CharField(max_length=16, null=True, blank=True)
    contact_email = models.EmailField(null=True, blank=True)
    attachment = models.ForeignKey('common.CommonFile', related_name="flag_attachments", null=True, blank=True)
    sanctions_match = models.ForeignKey('sanctionslist.SanctionedNameMatch', null=True, blank=True)
    escalation_comment = models.TextField(null=True, blank=True, max_length=5120)

    class Meta:
        ordering = (
            '-created',
        )

    def __str__(self):
        return "Partner: {} Flag Type::{}>".format(self.partner, self.flag_type)

    @property
    def has_been_escalated(self):
        return FLAG_TYPES.escalated in self.type_history


class PartnerVerification(TimeStampedModel):
    partner = models.ForeignKey('partner.Partner', related_name="verifications")
    submitter = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="given_verifications")
    is_valid = models.BooleanField(default=True)
    is_verified = models.BooleanField()

    is_cert_uploaded = models.BooleanField(
        help_text='Has the CSO/partner uploaded its valid, '
                  'non-expired registration certificate issued by the correct government body?'
    )
    cert_uploaded_comment = models.TextField(null=True, blank=True)

    is_mm_consistent = models.BooleanField(
        help_text='Are the mandate and mission of the CSO/partner consistent with that of the UN?'
    )
    mm_consistent_comment = models.TextField(null=True, blank=True)

    is_indicate_results = models.BooleanField(
        help_text='Does the CSO/partner have mechanisms to combat fraud and corruption, '
                  'prevent sexual exploitation and abuse, and protect and safeguard beneficiaries?'
    )
    indicate_results_comment = models.TextField(null=True, blank=True)

    is_rep_risk = models.BooleanField(
        help_text='Are there any other risk-related observations associated with the CSO/partner that are not '
                  'captured in UN Partner Portal, but which pose unacceptable risk to the UN?'
    )
    rep_risk_comment = models.TextField(null=True, blank=True)

    is_yellow_flag = models.BooleanField(help_text='Do these observations pose unacceptable risk to the UN?')
    yellow_flag_comment = models.TextField(null=True, blank=True)

    class Meta:
        ordering = (
            '-created',
        )

    def __str__(self):
        return "Partner: {} Verified: {}>".format(self.partner, self.is_verified)

    def _passed_verify(self):
        return all([
            self.is_cert_uploaded,
            self.is_mm_consistent,
            self.is_indicate_results,
            not self.is_rep_risk,
            not self.is_yellow_flag
        ])

    def save(self, *args, **kwargs):
        self.is_verified = self._passed_verify()
        super(PartnerVerification, self).save(*args, **kwargs)

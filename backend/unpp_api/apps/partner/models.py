# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from model_utils.models import TimeStampedModel

from common.consts import (
    SATISFACTION_SCALES,
    PARTNER_REVIEW_TYPES,
    PARTNER_TYPES,
    MEMBER_ROLES,
    MEMBER_STATUSES,
)


class Partner(TimeStampedModel):
    """

    """
    legal_name = models.CharField(max_length=255)
    display_type = models.CharField(max_length=3, choices=PARTNER_TYPES)
    hq = models.ForeignKey('self', null=True, blank=True, related_name='children')
    country = models.ForeignKey('common.Country', related_name="partners")
    is_active = models.BooleanField(default=True)
    registration_number = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Partner: {} <pk:{}>".format(self.name, self.id)


class PartnerProfile(TimeStampedModel):
    """

    """
    partner = models.ForeignKey(Partner, related_name="profile")
    alias_name = models.CharField(max_length=255, null=True, blank=True)
    former_legal_name = models.CharField(max_length=255, null=True, blank=True)
    org_head_first_name = models.CharField(max_length=255, null=True, blank=True)
    org_head_last_name = models.CharField(max_length=255, null=True, blank=True)
    org_head_email = models.EmailField(max_length=255, null=True, blank=True)
    register_country = models.BooleanField(default=False, verbose_name='Register to work in country?')
    flagged = models.BooleanField(default=False)
    start_cooperate_date = models.DateField()
    annual_budget = models.DecimalField(decimal_places=2, max_digits=12, blank=True, null=True)
    have_gov_doc = models.BooleanField(default=False, verbose_name='Does the organization have a government document?')
    registration_doc = models.FileField(null=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerProfile <pk:{}>".format(self.id)


class PartnerMember(TimeStampedModel):
    """

    """
    user = models.ForeignKey('account.User', related_name="partner_members")
    partner = models.ForeignKey(Partner, related_name="partners")
    title = models.CharField(max_length=255)
    role = models.CharField(max_length=3, choices=MEMBER_ROLES, default=MEMBER_ROLES.reader)
    status = models.CharField(max_length=3, choices=MEMBER_STATUSES, default=MEMBER_STATUSES.invited)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerMember: {} <pk:{}>".format(self.title, self.id)


class PartnerReview(TimeStampedModel):
    # This class is under construction at all UNICEF projects.. they are figuring out the right result of this entity.
    # We should keep in mind that this class can totally change!
    partner = models.ForeignKey(Partner, related_name="reviews")
    agency = models.ForeignKey('agency.Agency', related_name="partner_reviews")
    reviewer = models.ForeignKey('account.User', related_name="partner_reviews")
    display_type = models.CharField(max_length=3, choices=PARTNER_REVIEW_TYPES)
    eoi = models.ForeignKey('project.EOI', related_name="partner_reviews")
    performance_pm = models.CharField(max_length=3, choices=SATISFACTION_SCALES)
    peformance_financial = models.CharField(max_length=3, choices=SATISFACTION_SCALES)
    performance_com_eng = models.CharField(max_length=3, choices=SATISFACTION_SCALES)
    ethical_concerns = models.BooleanField(default=False, verbose_name='Ethical concerns?')
    does_recommend = models.BooleanField(default=False, verbose_name='Does recommend?')
    comment = models.TextField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerReview <pk:{}>".format(self.id)

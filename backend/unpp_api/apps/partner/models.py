# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from model_utils.models import TimeStampedModel


class Partner(TimeStampedModel):
    """

    """
    legal_name = models.CharField(max_length=255)
    # display_type = International, national
    hq = models.ForeignKey('self', null=True, blank=True, related_name='children', db_index=True)
    country = models.ForeignKey('common.Country', related_name="partners")

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

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerProfile <pk:{}>".format(self.id)


class PartnerMember(TimeStampedModel):
    """

    """
    user = models.ForeignKey('account.User', related_name="partner_members")
    partner_profile = models.ForeignKey(PartnerProfile, related_name="partner_members")
    title = models.CharField(max_length=255)
    # role = ??? the same that we have in agency?

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerMember: {} <pk:{}>".format(self.title, self.id)


class PartnerReview(TimeStampedModel):
    partner = models.ForeignKey(Partner, related_name="reviews")
    agency = models.ForeignKey('agency.Agency', related_name="partner_reviews")
    reviewer = models.ForeignKey('account.User', related_name="partner_reviews")
    # display_type = TODO: need to get !
    eoi = models.ForeignKey('project.EOI', related_name="partner_reviews")
    # performance_pm = Highly satisfactory, satisfactory, not satisfactory
    # peformance_financial = Highly satisfactory, satisfactory, not satisfactory
    # performance_com_eng = Highly satisfactory, satisfactory, not satisfactory
    ethical_concerns = models.BooleanField(default=False, verbose_name='Ethical concerns?')
    does_recommend = models.BooleanField(default=False, verbose_name='Does recommend?')
    comment = models.TextField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerReview <pk:{}>".format(self.id)

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.db.models.signals import post_save
from django.contrib.postgres.fields import ArrayField
from model_utils.models import TimeStampedModel

from common.countries import COUNTRIES_ALPHA2_CODE
from common.consts import (
    MEMBER_ROLES,
    MEMBER_STATUSES,
)


class OtherAgency(TimeStampedModel):
    """
    Other Agencies are defined for Partner Profile history like accreditation, references and this entity is
    something different then core Agency like Unicef and others.
    """
    name = models.CharField(max_length=255)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Other Agency: {} <pk:{}>".format(self.name, self.id)


class Agency(models.Model):
    name = models.CharField(max_length=255)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Agency: {} <pk:{}>".format(self.name, self.id)


class AgencyProfile(TimeStampedModel):
    eoi_template = models.FileField()
    agency = models.OneToOneField(Agency, related_name="profile")

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "AgencyProfile: {} <pk:{}>".format(self.agency.name, self.id)

    @classmethod
    def create_agency_profile(cls, sender, instance, created, **kwargs):
        """
        Signal handler to create agency profiles automatically
        """
        if created:
            cls.objects.create(agency=instance)


class AgencyOffice(TimeStampedModel):
    name = models.CharField(max_length=255)
    agency = models.ForeignKey(Agency, related_name="agency_offices")
    countries_code = ArrayField(
        models.CharField(max_length=2, choices=COUNTRIES_ALPHA2_CODE),
        default=list
    )

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "AgencyOffice: {} <pk:{}>".format(self.name, self.id)


class AgencyMember(TimeStampedModel):
    user = models.ForeignKey('account.User', related_name="agency_members")
    role = models.CharField(max_length=3, choices=MEMBER_ROLES, default=MEMBER_ROLES.reader)
    office = models.ForeignKey(AgencyOffice, related_name="agency_members")
    telephone = models.CharField(max_length=255, null=True, blank=True)
    status = models.CharField(max_length=3, choices=MEMBER_STATUSES, default=MEMBER_STATUSES.invited)

    class Meta:
        ordering = ['id']
        unique_together = (
            'user', 'office'
        )

    def __str__(self):
        return "AgencyMember <pk:{}>".format(self.id)


post_save.connect(AgencyProfile.create_agency_profile, sender=Agency)

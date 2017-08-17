# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.db.models.signals import post_save
from django.contrib.postgres.fields import ArrayField
from model_utils.models import TimeStampedModel

from common.countries import COUNTRIES_ALPHA2_CODE
from common.consts import (
    MEMBER_ROLES,
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


class Agency(TimeStampedModel):
    """

    """
    name = models.CharField(max_length=255)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Agency: {} <pk:{}>".format(self.name, self.id)


class AgencyProfile(TimeStampedModel):
    """

    """
    eoi_template = models.FileField()
    agency = models.OneToOneField(Agency, related_name="profile")

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "AgencyProfile: {} <pk:{}>".format(self.name, self.id)

    @classmethod
    def create_agency_profile(cls, sender, instance, created, **kwargs):
        """
        Signal handler to create agency profiles automatically
        """
        if created:
            cls.objects.create(user=instance)


class AgencyOffice(TimeStampedModel):
    """

    """
    name = models.CharField(max_length=255)
    agency = models.ForeignKey(Agency, related_name="agency_offices")
    countries_code = ArrayField(
        models.CharField(max_length=3, choices=COUNTRIES_ALPHA2_CODE),
        default=list
    )


class AgencyMember(TimeStampedModel):
    """

    """
    user = models.ForeignKey('account.User', related_name="agency_members")
    role = models.CharField(max_length=3, choices=MEMBER_ROLES, default=MEMBER_ROLES.reader)
    office = models.ForeignKey(AgencyOffice, related_name="agency_members")


# # Signals
#
# post_save.connect(AgencyProfile.create_agency_profile, sender=Agency)

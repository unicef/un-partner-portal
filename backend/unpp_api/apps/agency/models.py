# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.db.models.signals import post_save
from django_countries.fields import CountryField
from model_utils.models import TimeStampedModel

from agency.roles import AgencyRole, AGENCY_ROLE_PERMISSIONS
from common.fields import FixedTextField


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
    name = models.CharField(max_length=255, unique=True)

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
    """
    AgencyOffice model is just a lean country container for permission purposes
    """
    agency = models.ForeignKey(Agency, related_name="agency_offices")
    country = CountryField()

    class Meta:
        ordering = ['id']
        unique_together = (
            'agency', 'country'
        )

    def __str__(self):
        return "AgencyOffice: {} <pk:{}>".format(self.name, self.id)

    @property
    def name(self):
        return self.country.name


class AgencyMember(TimeStampedModel):
    user = models.ForeignKey('account.User', related_name="agency_members")
    role = FixedTextField(choices=AgencyRole.get_choices(), default=AgencyRole.READER.name)
    office = models.ForeignKey(AgencyOffice, related_name="agency_members")
    telephone = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ['id']
        unique_together = (
            'user', 'office'
        )

    def __str__(self):
        return "AgencyMember <pk:{}>".format(self.id)

    @property
    def user_permissions(self):
        return AGENCY_ROLE_PERMISSIONS[AgencyRole[self.role]]


post_save.connect(AgencyProfile.create_agency_profile, sender=Agency)

# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from model_utils.models import TimeStampedModel
from .countries import COUNTRIES_ALPHA2_CODE


class PointQuerySet(models.QuerySet):

    def get_or_create(self, lat, lon, admin_level_1):
        admin_inst, created = AdminLevel1.objects.get_or_create(**admin_level_1)
        qs = self.filter(lat=lat, lon=lon, admin_level_1=admin_inst)
        if qs.exists():
            return qs.first(), False
        return self.create(lat=lat, lon=lon, admin_level_1=admin_inst), True


class AdminLevel1(models.Model):
    """
    Admin level 1 - is like California in USA or Mazowieckie in Poland
    """
    name = models.CharField(max_length=255)
    country_code = models.CharField(max_length=3, choices=COUNTRIES_ALPHA2_CODE)

    class Meta:
        ordering = ['id']
        unique_together = (('name', 'country_code'), )

    def __str__(self):
        return "AdminLevel1 <pk:{}>".format(self.id)


class Point(models.Model):
    lat = models.DecimalField(
        verbose_name='Latitude',
        null=True,
        blank=True,
        max_digits=8,
        decimal_places=5,
        validators=[MinValueValidator(Decimal(-180)), MaxValueValidator(Decimal(180))]
    )
    lon = models.DecimalField(
        verbose_name='Longitude',
        null=True,
        blank=True,
        max_digits=8,
        decimal_places=5,
        validators=[MinValueValidator(Decimal(-180)), MaxValueValidator(Decimal(180))]
    )
    admin_level_1 = models.ForeignKey(AdminLevel1, related_name="points")

    objects = PointQuerySet.as_manager()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Point <pk:{}>".format(self.id)


class Sector(models.Model):
    """

    """
    name = models.CharField(max_length=255)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Sector: {} <pk:{}>".format(self.name, self.id)


class Specialization(models.Model):
    """

    """
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Sector, related_name="specializations")

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Specialization: {} <pk:{}>".format(self.name, self.id)


class CommonFile(TimeStampedModel):
    file_field = models.FileField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "CommonFile <pk:{}>".format(self.id)

    @property
    def has_existing_reference(self):
        """
        Returns True if this file is referenced from at least one other object
        """
        has_existing_reference = any([
            self.partner_capacity_assessments.exists(),
            self.collaboration_evidences.exists(),
            self.concept_notes.exists(),
            self.ethic_fraud_policies.exists(),
            self.ethic_safeguard_policies.exists(),
            self.flag_attachments.exists(),
            self.gov_docs.exists(),
            self.governance_organigrams.exists(),
            self.partner_audit_reports.exists(),
            self.other_info_doc_1.exists(),
            self.other_info_doc_2.exists(),
            self.other_info_doc_3.exists(),
            self.others_info.exists(),
            self.registration_docs.exists(),
            self.reports.exists(),
            self.review_summary_attachments.exists(),
        ])

        if has_existing_reference:
            return True
        return False

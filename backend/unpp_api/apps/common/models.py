# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from decimal import Decimal

from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator, FileExtensionValidator
from imagekit.models import ImageSpecField
from model_utils.models import TimeStampedModel
from pilkit.processors import ResizeToFill

from common.countries import COUNTRIES_ALPHA2_CODE, COUNTRIES_ALPHA2_CODE_DICT


class PointQuerySet(models.QuerySet):

    def get_point(self, lat=None, lon=None, admin_level_1=None):
        admin_level_1, _ = AdminLevel1.objects.get_or_create(
            name=admin_level_1.get('name'),
            country_code=admin_level_1['country_code'],
        )
        point, _ = self.get_or_create(lat=lat, lon=lon, admin_level_1=admin_level_1)

        return point


class AdminLevel1(models.Model):
    """
    Admin level 1 - is like California in USA or Mazowieckie in Poland
    """
    name = models.CharField(max_length=255, null=True, blank=True)
    country_code = models.CharField(max_length=3, choices=COUNTRIES_ALPHA2_CODE)

    class Meta:
        ordering = ['id']
        unique_together = ('name', 'country_code')

    def __str__(self):
        return f"[{self.country_name}] {self.name}"

    @property
    def country_name(self):
        return COUNTRIES_ALPHA2_CODE_DICT[self.country_code]


class Point(models.Model):
    lat = models.DecimalField(
        verbose_name='Latitude',
        null=True,
        blank=True,
        max_digits=8,
        decimal_places=5,
        validators=[MinValueValidator(Decimal(-90)), MaxValueValidator(Decimal(90))]
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
    name = models.CharField(max_length=255)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Sector: {} <pk:{}>".format(self.name, self.id)


class Specialization(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Sector, related_name="specializations")

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f'<{self.pk}> {self.category.name}: {self.name}'


class CommonFile(TimeStampedModel):
    file_field = models.FileField(validators=(
        FileExtensionValidator(settings.ALLOWED_EXTENSIONS),
    ))
    # Only applicable for image files
    __thumbnail = ImageSpecField(
        source='file_field',
        processors=[
            ResizeToFill(150, 75)
        ],
        format='JPEG',
        options={
            'quality': 80
        },
    )

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"CommonFile [{self.pk}] {self.file_field}"

    @property
    def thumbnail_url(self):
        """
        Done this way to fail gracefully when trying to get thumbnail for non-image file
        """
        try:
            return self.__thumbnail.url
        except OSError:
            return None

    @property
    def has_existing_reference(self):
        """
        Returns True if this file is referenced from at least one other object
        """
        for attr_name in dir(self):
            if attr_name == CommonFile.has_existing_reference.fget.__name__ or not hasattr(self, attr_name):
                continue
            attribute = getattr(self, attr_name)
            if callable(getattr(attribute, 'exists', None)) and attribute.exists():
                return True

        return False

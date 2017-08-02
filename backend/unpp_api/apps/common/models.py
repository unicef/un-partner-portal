# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from decimal import Decimal
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from model_utils.models import TimeStampedModel


class Country(TimeStampedModel):
    """

    """
    name = models.CharField(max_length=255)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Country: {} <pk:{}>".format(self.name, self.id)


class Point(TimeStampedModel):
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
    admin_level_1 = models.CharField(max_length=255)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Point <pk:{}>".format(self.id)


class Sector(TimeStampedModel):
    """

    """
    name = models.CharField(max_length=255)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Sector: {} <pk:{}>".format(self.name, self.id)


class Specialization(TimeStampedModel):
    """

    """
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Sector, related_name="specializations")

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Specialization: {} <pk:{}>".format(self.name, self.id)

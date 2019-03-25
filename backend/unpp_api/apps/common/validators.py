# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.core.exceptions import ValidationError
from django.utils import timezone


def max_current_year_validator(value):
    if value > timezone.now().year:
        raise ValidationError('Ensure this given year is older than or equal to current year.')


def past_date_validator(value):
    if value > timezone.now().date():
        raise ValidationError('Ensure that given date is in the past.')


def future_date_validator(value):
    if value < timezone.now().date():
        raise ValidationError('Ensure that given date is in the future.')

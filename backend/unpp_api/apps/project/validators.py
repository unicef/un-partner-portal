# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.core.exceptions import ValidationError


def validate_weight_adjustments(value):
    if len(value) > 0 and sum(map(lambda x: x.get('weight'), value)) != 100:
        raise ValidationError('The sum of all weight criteria must be equal to 100.')

# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.core.exceptions import ValidationError


def validate_weight_adjustments(value):
    """
    Validator check only sum of weight.
    Has weight is controlled in other place.
    """
    if len(value) > 0 and \
            all(map(lambda x: x.get('weight'), value)) and \
            sum(map(lambda x: x.get('weight', 0), value)) != 100:
        raise ValidationError('The sum of all weight criteria must be equal to 100.')

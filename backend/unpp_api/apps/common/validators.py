# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from datetime import date
from django.core.validators import BaseValidator
from django.utils.deconstruct import deconstructible


@deconstructible
class MaxCurrentYearValidator(BaseValidator):
    """
    Validator that check if given year is not bigger the current year.
    """
    message = 'Ensure this given year is older than or equal to current year %(limit_value)s.'
    code = 'max_year'

    def __init__(self, limit_value=None, message=None):
        if limit_value is None:
            limit_value = date.today().year
        super(MaxCurrentYearValidator, self).__init__(limit_value, message)

    def __call__(self, value=None):
        if value is None:
            value = date.today().year
        super(MaxCurrentYearValidator, self).__call__(value)

    def compare(self, a, b):
        return a > b


class PastDateValidator(BaseValidator):

    message = 'Ensure that given date is in the past.'

    def __init__(self, limit_value=None, message=None):
        super(PastDateValidator, self).__init__(limit_value=limit_value, message=message)

    def compare(self, a, b):
        return a > date.today()


class FutureDateValidator(BaseValidator):

    message = 'Ensure that given date is in the future.'

    def __init__(self, limit_value=None, message=None):
        super(FutureDateValidator, self).__init__(limit_value=limit_value, message=message)

    def compare(self, a, b):
        return a < date.today()

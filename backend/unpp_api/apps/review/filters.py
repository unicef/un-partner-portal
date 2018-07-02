# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import django_filters
from django_filters.filters import BooleanFilter, ChoiceFilter
from django_filters.widgets import BooleanWidget

from common.consts import FLAG_TYPES, FLAG_CATEGORIES
from review.models import PartnerFlag


class PartnerFlagFilter(django_filters.FilterSet):

    flag_type = ChoiceFilter(choices=FLAG_TYPES)
    category = ChoiceFilter(choices=FLAG_CATEGORIES)
    only_mine = BooleanFilter(method='filter_only_mine', widget=BooleanWidget())

    class Meta:
        model = PartnerFlag
        fields = [
            'flag_type',
            'category',
            'only_mine',
        ]

    def filter_only_mine(self, queryset, name, value):
        if value:
            queryset = queryset.filter(submitter=self.request.user)
        return queryset

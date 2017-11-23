# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import django_filters
from django_filters.filters import CharFilter, ModelMultipleChoiceFilter
from django_filters.widgets import CSVWidget

from common.models import Specialization
from .models import Partner


class PartnersListFilter(django_filters.FilterSet):

    legal_name = CharFilter(method='get_legal_name')
    verification_status = CharFilter(method='get_verification_status')
    display_type = CharFilter(method='get_display_type')
    country_code = CharFilter(method='get_country_code')
    country_codes = CharFilter(method='get_country_codes')
    specializations = ModelMultipleChoiceFilter(widget=CSVWidget(),
                                                name='experiences__specialization',
                                                queryset=Specialization.objects.all())
    concern = CharFilter(method='get_concern')
    limit = CharFilter(method='get_limit')

    class Meta:
        model = Partner
        fields = ['legal_name', 'country_code', 'display_type', 'specializations', 'concern']

    def get_legal_name(self, queryset, name, value):
        return queryset.filter(legal_name__icontains=value)

    def get_country_code(self, queryset, name, value):
        return queryset.filter(country_code=(value and value.upper()))

    def get_country_codes(self, queryset, name, value):
        country_codes = filter(lambda x: x.isalpha() and len(x) == 2, value and value.upper().split(","))
        return queryset.filter(country_code__in=country_codes)

    def get_display_type(self, queryset, name, value):
        return queryset.filter(display_type=value)

    def get_concern(self, queryset, name, value):
        return queryset.filter(mandate_mission__concern_groups__contains=[value])

    def get_limit(self, queryset, name, value):
        if value.isdigit():
            return queryset[:value]
        return queryset

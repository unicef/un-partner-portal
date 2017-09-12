# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import django_filters
from django_filters.filters import CharFilter
from .models import Partner


class PartnersListFilter(django_filters.FilterSet):

    legal_name = CharFilter(method='get_legal_name')
    verification_status = CharFilter(method='get_verification_status')
    display_type = CharFilter(method='get_display_type')
    country_code = CharFilter(method='get_country_code')
    specializations = CharFilter(method='get_specializations')
    concern = CharFilter(method='get_concern')

    class Meta:
        model = Partner
        fields = ['legal_name', 'country_code', 'display_type', 'specializations', 'concern']

    def get_legal_name(self, queryset, name, value):
        return queryset.filter(legal_name__icontains=value)

    def get_country_code(self, queryset, name, value):
        return queryset.filter(country_code=(value and value.upper()))

    def get_display_type(self, queryset, name, value):
        return queryset.filter(display_type=value)

    def get_specializations(self, queryset, name, value):
        return queryset.filter(experiences__specialization=value)

    def get_concern(self, queryset, name, value):
        return queryset.filter(mandate_mission__concern_groups__contains=[value])

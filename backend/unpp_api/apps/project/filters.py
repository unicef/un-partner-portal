# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import django_filters
from django_filters.filters import CharFilter
from .models import EOI


class BaseProjectFilter(django_filters.FilterSet):

    title = CharFilter(method='get_title')
    country_code = CharFilter(method='get_country_code')
    locations = CharFilter(method='get_locations')
    specializations = CharFilter(method='get_specializations')

    class Meta:
        model = EOI
        fields = ['title', 'country_code', 'locations', 'specializations', 'status']

    def get_title(self, queryset, name, value):
        return queryset.filter(title__icontains=value)

    def get_country_code(self, queryset, name, value):
        return queryset.filter(country_code=(value and value.upper()))

    def get_locations(self, queryset, name, value):
        return queryset.filter(locations__admin_level_1=value)

    def get_specializations(self, queryset, name, value):
        return queryset.filter(specializations=value)

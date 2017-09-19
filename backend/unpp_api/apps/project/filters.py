# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import django_filters
from django_filters.filters import CharFilter
from .models import EOI, Application


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


class ApplicationsFilter(django_filters.FilterSet):

    legal_name = CharFilter(method='get_legal_name')
    country_code = CharFilter(method='get_country_code')
    location = CharFilter(method='get_location')
    specialization = CharFilter(method='get_specialization')
    year = CharFilter(method='get_year')
    concern = CharFilter(method='get_concern')
    status = CharFilter(method='get_status')

    class Meta:
        model = Application
        fields = ['legal_name', 'country_code', 'eoi', 'partner', 'status']

    def get_legal_name(self, queryset, name, value):
        return queryset.filter(partner__legal_name__icontains=value)

    def get_country_code(self, queryset, name, value):
        return queryset.filter(eoi__country_code=(value and value.upper()))

    def get_locations(self, queryset, name, value):
        return queryset.filter(eoi__locations__admin_level_1=value)

    def get_specialization(self, queryset, name, value):
        return queryset.filter(eoi__specializations=value)

    def get_year(self, queryset, name, value):
        return queryset.filter(partner__experiences__years=value)

    def get_concern(self, queryset, name, value):
        return queryset.filter(partner__mandate_mission__concern_groups__in=value)

    def get_status(self, queryset, name, value):
        return queryset.filter(status=value)

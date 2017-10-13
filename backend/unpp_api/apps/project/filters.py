# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db.models import Q
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

    project_title = CharFilter(method='get_project_title')
    legal_name = CharFilter(method='get_legal_name')
    country_code = CharFilter(method='get_country_code')
    location = CharFilter(method='get_location')
    specialization = CharFilter(method='get_specialization')
    year = CharFilter(method='get_year')
    concern = CharFilter(method='get_concern')
    status = CharFilter(method='get_status')
    agency = CharFilter(method='get_agency')

    class Meta:
        model = Application
        fields = ['project_title', 'legal_name', 'country_code', 'eoi', 'partner', 'status']

    def get_project_title(self, queryset, name, value):
        return queryset.filter(eoi__title__icontains=value)

    def get_legal_name(self, queryset, name, value):
        return queryset.filter(partner__legal_name__icontains=value)

    def get_country_code(self, queryset, name, value):
        return queryset.filter(eoi__locations__admin_level_1__country_code=(value and value.upper()))

    def get_locations(self, queryset, name, value):
        return queryset.filter(eoi__locations__admin_level_1=value)

    def get_specialization(self, queryset, name, value):
        return queryset.filter(eoi__specializations=value)

    def get_year(self, queryset, name, value):
        return queryset.filter(partner__experiences__years=value)

    def get_concern(self, queryset, name, value):
        return queryset.filter(partner__mandate_mission__concern_groups__contains=[value])

    def get_status(self, queryset, name, value):
        return queryset.filter(status=value)

    def get_agency(self, queryset, name, value):
        return queryset.filter(eoi__agency=value)


class ApplicationsUnsolicitedFilter(django_filters.FilterSet):

    project_title = CharFilter(method='get_project_title')
    country_code = CharFilter(method='get_country_code')
    location = CharFilter(method='get_location')
    specialization = CharFilter(method='get_specialization')
    agency = CharFilter(method='get_agency')

    class Meta:
        model = Application
        fields = ['project_title', 'country_code', 'location', 'specialization', 'agency']

    def get_project_title(self, queryset, name, value):
        return queryset.filter(
            Q(proposal_of_eoi_details__contains={"title": value}) |  # unsolicited
            Q(eoi__title__contains=value)  # direct selection - developed from unsolicited
        )

    def get_specialization(self, queryset, name, value):
        return queryset.filter(
            Q(proposal_of_eoi_details__contains={"specialization": [value]}) |  # unsolicited
            Q(eoi__specializations=[value])  # direct selection - developed from unsolicited
        )

    def get_country_code(self, queryset, name, value):
        return queryset.filter(
            Q(locations_proposal_of_eoi__admin_level_1__country_code=value) |  # unsolicited
            Q(eoi__locations__admin_level_1__country_code=value)  # direct selection - developed from unsolicited
        )

    def get_locations(self, queryset, name, value):
        return queryset.filter(
            Q(locations_proposal_of_eoi__admin_level_1=[value]) |  # unsolicited
            Q(eoi__locations__admin_level_1=[value])  # direct selection - developed from unsolicited
        )

    def get_agency(self, queryset, name, value):
        return queryset.filter(agency=value)

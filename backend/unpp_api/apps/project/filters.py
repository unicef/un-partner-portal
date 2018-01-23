# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db.models import Q
import django_filters
from django_filters.filters import CharFilter, DateFilter, BooleanFilter, ModelMultipleChoiceFilter, ChoiceFilter
from django_filters.widgets import BooleanWidget, CSVWidget

from common.consts import EXTENDED_APPLICATION_STATUSES
from common.models import Specialization
from .models import EOI, Application


class BaseProjectFilter(django_filters.FilterSet):

    title = CharFilter(method='get_title')
    country_code = CharFilter(method='get_country_code')
    locations = CharFilter(method='get_locations')
    specializations = ModelMultipleChoiceFilter(widget=CSVWidget(),
                                                queryset=Specialization.objects.all())
    active = BooleanFilter(method='get_active', widget=BooleanWidget())
    posted_from_date = DateFilter(name='created', lookup_expr='date__gte')
    posted_to_date = DateFilter(name='created', lookup_expr='date__lte')
    selected_source = CharFilter(lookup_expr='iexact')

    class Meta:
        model = EOI
        fields = ['title', 'country_code', 'locations', 'specializations', 'agency', 'active', 'selected_source']

    def get_title(self, queryset, name, value):
        return queryset.filter(title__icontains=value)

    def get_country_code(self, queryset, name, value):
        return queryset.filter(locations__admin_level_1__country_code=(value and value.upper()))

    def get_locations(self, queryset, name, value):
        return queryset.filter(locations__admin_level_1=value)

    def get_active(self, queryset, name, value):
        if value:
            return queryset.filter(is_completed=False)
        return queryset.filter(is_completed=True)


class ApplicationsFilter(django_filters.FilterSet):

    project_title = CharFilter(method='get_project_title')
    legal_name = CharFilter(method='get_legal_name')
    country_code = CharFilter(method='get_country_code')
    location = CharFilter(method='get_location')
    specialization = CharFilter(method='get_specialization')
    specializations = ModelMultipleChoiceFilter(widget=CSVWidget(),
                                                name='eoi__specializations',
                                                queryset=Specialization.objects.all())
    year = CharFilter(method='get_year')
    concern = CharFilter(method='get_concern')
    status = CharFilter(method='get_status')
    agency = CharFilter(method='get_agency')
    did_win = BooleanFilter(widget=BooleanWidget())
    cfei_active = BooleanFilter(method='get_cfei_active', widget=BooleanWidget())

    applications_status = ChoiceFilter(method='filter_applications_status', choices=EXTENDED_APPLICATION_STATUSES)

    class Meta:
        model = Application
        fields = ['project_title', 'legal_name', 'country_code', 'eoi', 'partner', 'status', 'did_win']

    def get_project_title(self, queryset, name, value):
        return queryset.filter(eoi__title__icontains=value)

    def get_legal_name(self, queryset, name, value):
        return queryset.filter(partner__legal_name__icontains=value)

    def get_country_code(self, queryset, name, value):
        return queryset.filter(eoi__locations__admin_level_1__country_code=(value and value.upper()))

    def get_location(self, queryset, name, value):
        return queryset.filter(eoi__locations__admin_level_1=value)

    # TODO - remove once frontend has integrated with specializations
    def get_specialization(self, queryset, name, value):
        return queryset.filter(eoi__specializations=value)

    def get_year(self, queryset, name, value):
        return queryset.filter(partner__experiences__years=value)

    def get_concern(self, queryset, name, value):
        return queryset.filter(partner__mandate_mission__concern_groups__contains=[value])

    def get_status(self, queryset, name, value):
        return queryset.filter(status=value)

    def filter_applications_status(self, queryset, name, value):
        # Logic here should match Application.application_status property
        filters = {
            EXTENDED_APPLICATION_STATUSES.review: {
                'did_win': False,
                'eoi__is_completed': False,
            },
            EXTENDED_APPLICATION_STATUSES.unsuccessful: {
                'did_win': False,
                'eoi__is_completed': True,
            },
            EXTENDED_APPLICATION_STATUSES.retracted: {
                'did_win': True,
                'did_withdraw': True,
            },
            EXTENDED_APPLICATION_STATUSES.successful: {
                'did_win': True,
                'did_decline': False,
                'did_accept': False,
                'decision_date__isnull': True,
            },
            EXTENDED_APPLICATION_STATUSES.accepted: {
                'did_win': True,
                'did_accept': True,
                'decision_date__isnull': False,
            },
            EXTENDED_APPLICATION_STATUSES.declined: {
                'did_win': True,
                'did_decline': True,
                'decision_date__isnull': False,
            },
        }

        return queryset.filter(**filters.get(value, {}))

    def get_agency(self, queryset, name, value):
        return queryset.filter(eoi__agency=value)

    def get_cfei_active(self, queryset, name, value):
        if value:
            return queryset.filter(eoi__is_completed=False)
        return queryset.filter(eoi__is_completed=True)

    def get_type_of_org(self, queryset, name, value):
        return queryset.filter(partner__display_type__icontains=value)


class ApplicationsEOIFilter(django_filters.FilterSet):
    legal_name = CharFilter(method='get_legal_name')
    country_code = CharFilter(method='get_country_code')
    location = CharFilter(method='get_location')
    specializations = ModelMultipleChoiceFilter(widget=CSVWidget(),
                                                name='partner__experiences__specialization',
                                                queryset=Specialization.objects.all())
    concern = CharFilter(method='get_concern')
    type_of_org = CharFilter(method='get_type_of_org')
    status = CharFilter(method='get_status')

    class Meta:
        model = Application
        fields = ['legal_name', 'country_code', 'location', 'specializations', 'concern', 'type_of_org']

    def get_legal_name(self, queryset, name, value):
        return queryset.filter(partner__legal_name__icontains=value)

    def get_country_code(self, queryset, name, value):
        return queryset.filter(partner__country_code=(value and value.upper()))

    def get_location(self, queryset, name, value):
        return queryset.filter(partner__country_presence__contains=[value and value.upper()])

    def get_concern(self, queryset, name, value):
        return queryset.filter(partner__mandate_mission__concern_groups__contains=[value])

    def get_type_of_org(self, queryset, name, value):
        return queryset.filter(partner__display_type__icontains=value)

    def get_status(self, queryset, name, value):
        return queryset.filter(status=value)


class ApplicationsUnsolicitedFilter(django_filters.FilterSet):

    project_title = CharFilter(method='get_project_title')
    country_code = CharFilter(method='get_country_code')
    location = CharFilter(method='get_location')
    specializations = ModelMultipleChoiceFilter(widget=CSVWidget(),
                                                method='get_specializations',
                                                queryset=Specialization.objects.all())
    specialization = CharFilter(method='get_specialization')
    agency = CharFilter(method='get_agency')
    ds_converted = BooleanFilter(method='get_ds_converted', widget=BooleanWidget())

    class Meta:
        model = Application
        fields = ['project_title', 'country_code', 'location', 'specialization', 'agency']

    def get_project_title(self, queryset, name, value):
        return queryset.filter(
            Q(proposal_of_eoi_details__title__icontains=value) |  # unsolicited
            Q(eoi__title__icontains=value)  # direct selection - developed from unsolicited
        )

    # TODO - remove once frontend has integrated with specializations
    def get_specialization(self, queryset, name, value):
        return queryset.filter(
            Q(proposal_of_eoi_details__contains={"specialization": [value]}) |  # unsolicited
            Q(eoi__specializations=[value])  # direct selection - developed from unsolicited
        )

    def get_specializations(self, queryset, name, value):
        if value:
            value = list(value.values_list('id', flat=True))
            query = Q()
            for pk in value:
                query |= Q(proposal_of_eoi_details__specializations__contains=pk)
            return queryset.filter(query)
        return queryset

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

    def get_ds_converted(self, queryset, name, value):
        return queryset.filter(eoi_converted__isnull=(not value))

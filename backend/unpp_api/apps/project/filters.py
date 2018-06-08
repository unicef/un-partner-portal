# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from datetime import date
from django.db.models import Q
import django_filters
from django_filters.filters import CharFilter, DateFilter, BooleanFilter, ModelMultipleChoiceFilter, ChoiceFilter
from django_filters.widgets import BooleanWidget, CSVWidget

from common.consts import EXTENDED_APPLICATION_STATUSES, CFEI_STATUSES
from common.models import Specialization
from .models import EOI, Application


class BaseProjectFilter(django_filters.FilterSet):

    title = CharFilter(method='filter_title')
    country_code = CharFilter(method='filter_country_code')
    locations = CharFilter(method='filter_locations')
    specializations = ModelMultipleChoiceFilter(
        widget=CSVWidget(), queryset=Specialization.objects.all()
    )
    active = BooleanFilter(method='filter_active', widget=BooleanWidget())
    is_published = BooleanFilter(method='filter_is_published', widget=BooleanWidget())
    posted_from_date = DateFilter(name='created', lookup_expr='date__gte')
    posted_to_date = DateFilter(name='created', lookup_expr='date__lte')
    selected_source = CharFilter(lookup_expr='iexact')
    status = ChoiceFilter(method='filter_status', choices=CFEI_STATUSES)
    focal_point = CharFilter(method='filter_focal_point')

    class Meta:
        model = EOI
        fields = [
            'title',
            'country_code',
            'locations',
            'specializations',
            'agency',
            'active',
            'selected_source',
            'is_published',
            'status',
            'focal_point',
        ]

    def filter_title(self, queryset, name, value):
        return queryset.filter(title__icontains=value)

    def filter_focal_point(self, queryset, name, value):
        return queryset.filter(
            Q(focal_points__email__icontains=value) | Q(focal_points__fullname__icontains=value)
        )

    def filter_country_code(self, queryset, name, value):
        return queryset.filter(locations__admin_level_1__country_code=(value and value.upper()))

    def filter_locations(self, queryset, name, value):
        return queryset.filter(locations__admin_level_1=value)

    def filter_active(self, queryset, name, value):
        if value:
            return queryset.filter(is_completed=False)
        return queryset.filter(is_completed=True)

    def filter_is_published(self, queryset, name, value):
        if value:
            return queryset.filter(is_published=True)
        elif value is False:
            return queryset.filter(is_published=False)
        return queryset

    def filter_status(self, queryset, name, value):
        # Logic here should match EOI.status property
        filters = {
            CFEI_STATUSES.draft: {
                'is_published': False,
                'sent_for_publishing': False,
            },
            CFEI_STATUSES.sent: {
                'is_published': False,
                'sent_for_publishing': True,
            },
            CFEI_STATUSES.completed: {
                'is_completed': True,
            },
            CFEI_STATUSES.closed: {
                'is_completed': False,
                'deadline_date__lt': date.today(),
            },
            CFEI_STATUSES.open: {
                'is_completed': False,
                'deadline_date__gte': date.today(),
            },
        }

        return queryset.filter(**filters.get(value, {}))


class ApplicationsFilter(django_filters.FilterSet):

    project_title = CharFilter(method='filter_project_title')
    legal_name = CharFilter(method='filter_legal_name')
    country_code = CharFilter(method='filter_country_code')
    location = CharFilter(method='filter_location')
    specializations = ModelMultipleChoiceFilter(
        widget=CSVWidget(), name='eoi__specializations', queryset=Specialization.objects.all()
    )
    year = CharFilter(method='filter_year')
    concern = CharFilter(method='filter_concern')
    status = CharFilter(method='filter_status')
    agency = CharFilter(method='filter_agency')
    did_win = BooleanFilter(widget=BooleanWidget())
    cfei_active = BooleanFilter(method='filter_cfei_active', widget=BooleanWidget())

    applications_status = ChoiceFilter(method='filter_applications_status', choices=EXTENDED_APPLICATION_STATUSES)

    class Meta:
        model = Application
        fields = ['project_title', 'legal_name', 'country_code', 'eoi', 'partner', 'status', 'did_win']

    def filter_project_title(self, queryset, name, value):
        return queryset.filter(eoi__title__icontains=value)

    def filter_legal_name(self, queryset, name, value):
        return queryset.filter(partner__legal_name__icontains=value)

    def filter_country_code(self, queryset, name, value):
        return queryset.filter(eoi__locations__admin_level_1__country_code__iexact=value)

    def filter_location(self, queryset, name, value):
        return queryset.filter(eoi__locations__admin_level_1=value)

    def filter_year(self, queryset, name, value):
        return queryset.filter(partner__experiences__years=value)

    def filter_concern(self, queryset, name, value):
        return queryset.filter(partner__mandate_mission__concern_groups__contains=[value])

    def filter_status(self, queryset, name, value):
        return queryset.filter(status=value)

    def filter_applications_status(self, queryset, name, value):
        # Logic here should match Application.application_status property
        filters = {
            EXTENDED_APPLICATION_STATUSES.draft: {
                'is_unsolicited': True,
                'is_published': False,
            },
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

    def filter_agency(self, queryset, name, value):
        return queryset.filter(eoi__agency=value)

    def filter_cfei_active(self, queryset, name, value):
        if value:
            return queryset.filter(eoi__is_completed=False)
        return queryset.filter(eoi__is_completed=True)


class ApplicationsEOIFilter(django_filters.FilterSet):
    legal_name = CharFilter(method='filter_legal_name')
    country_code = CharFilter(method='filter_country_code')
    location = CharFilter(method='filter_location')
    specializations = ModelMultipleChoiceFilter(
        widget=CSVWidget(), name='partner__experiences__specialization', queryset=Specialization.objects.all()
    )
    concern = CharFilter(method='filter_concern')
    type_of_org = CharFilter(method='filter_type_of_org')
    status = CharFilter(method='filter_status')

    class Meta:
        model = Application
        fields = ['legal_name', 'country_code', 'location', 'specializations', 'concern', 'type_of_org']

    def filter_legal_name(self, queryset, name, value):
        return queryset.filter(partner__legal_name__icontains=value)

    def filter_country_code(self, queryset, name, value):
        return queryset.filter(partner__country_code__iexact=value)

    def filter_location(self, queryset, name, value):
        return queryset.filter(partner__country_presence__contains=[value and value.upper()])

    def filter_concern(self, queryset, name, value):
        return queryset.filter(partner__mandate_mission__concern_groups__contains=[value])

    def filter_type_of_org(self, queryset, name, value):
        return queryset.filter(partner__display_type__icontains=value)

    def filter_status(self, queryset, name, value):
        return queryset.filter(status=value)


class ApplicationsUnsolicitedFilter(django_filters.FilterSet):

    project_title = CharFilter(method='filter_project_title')
    country_code = CharFilter(method='filter_country_code')
    location = CharFilter(method='filter_locations')
    specializations = ModelMultipleChoiceFilter(
        widget=CSVWidget(), method='filter_specializations', queryset=Specialization.objects.all()
    )
    agency = CharFilter(method='filter_agency')
    ds_converted = BooleanFilter(method='filter_ds_converted', widget=BooleanWidget())

    class Meta:
        model = Application
        fields = ['project_title', 'country_code', 'location', 'specializations', 'agency']

    def filter_project_title(self, queryset, name, value):
        return queryset.filter(
            Q(proposal_of_eoi_details__title__icontains=value) |  # unsolicited
            Q(eoi__title__icontains=value)  # direct selection - developed from unsolicited
        )

    def filter_country_code(self, queryset, name, value):
        return queryset.filter(
            Q(locations_proposal_of_eoi__admin_level_1__country_code=value) |  # unsolicited
            Q(eoi__locations__admin_level_1__country_code=value)  # direct selection - developed from unsolicited
        )

    def filter_locations(self, queryset, name, value):
        return queryset.filter(
            Q(locations_proposal_of_eoi__admin_level_1=[value]) |  # unsolicited
            Q(eoi__locations__admin_level_1=[value])  # direct selection - developed from unsolicited
        )

    def filter_agency(self, queryset, name, value):
        return queryset.filter(agency=value)

    def filter_ds_converted(self, queryset, name, value):
        return queryset.filter(eoi_converted__isnull=(not value))

    def filter_specializations(self, queryset, name, value):
        if value:
            query = Q(eoi__specializations__in=value)
            for specialization in value:
                query |= Q(proposal_of_eoi_details__specializations__contains=specialization.pk)
            return queryset.filter(query)
        return queryset

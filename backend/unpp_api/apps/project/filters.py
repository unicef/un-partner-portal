# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from datetime import date
from functools import reduce

from django.db.models import Q
import django_filters
from django_filters.filters import CharFilter, DateFilter, BooleanFilter, ModelMultipleChoiceFilter, ChoiceFilter
from django_filters.widgets import BooleanWidget, CSVWidget

from account.models import User
from common.consts import EXTENDED_APPLICATION_STATUSES, CFEI_STATUSES, CFEI_TYPES
from common.countries import COUNTRIES_ALPHA2_CODE
from common.filter_fields import CommaSeparatedListFilter
from common.models import Specialization, AdminLevel1
from project.models import EOI, Application


class BaseProjectFilter(django_filters.FilterSet):

    title = CharFilter(lookup_expr='icontains')
    displayID = CharFilter(lookup_expr='icontains')
    country_code = django_filters.ChoiceFilter(
        choices=COUNTRIES_ALPHA2_CODE, name='locations__admin_level_1__country_code', lookup_expr='iexact'
    )
    locations = django_filters.ModelChoiceFilter(
        queryset=AdminLevel1.objects.all(), name='locations__admin_level_1'
    )
    specializations = ModelMultipleChoiceFilter(
        widget=CSVWidget(), queryset=Specialization.objects.all()
    )
    active = BooleanFilter(method='filter_active', widget=BooleanWidget(), label='Is completed')
    is_published = BooleanFilter(method='filter_is_published', widget=BooleanWidget())
    posted_from_date = DateFilter(name='created', lookup_expr='date__gte')
    posted_to_date = DateFilter(name='created', lookup_expr='date__lte')
    selected_source = CharFilter(lookup_expr='iexact')
    status = CommaSeparatedListFilter(custom_method='filter_status', choices=CFEI_STATUSES, label='Statuses')
    focal_points = ModelMultipleChoiceFilter(
        widget=CSVWidget(), queryset=User.objects.all()
    )

    class Meta:
        model = EOI
        fields = (
            'title',
            'displayID',
            'country_code',
            'locations',
            'specializations',
            'agency',
            'active',
            'selected_source',
            'is_published',
            'status',
            'focal_points',
        )

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

    def filter_status(self, queryset, values):
        filters = {
            CFEI_STATUSES.draft: Q(
                is_published=False,
                sent_for_publishing=False,
            ),
            CFEI_STATUSES.sent: Q(
                is_published=False,
                sent_for_publishing=True,
            ),
            CFEI_STATUSES.finalized: Q(
                is_completed=True,
                is_published=True,
            ),
            CFEI_STATUSES.closed: Q(
                is_completed=False,
                is_published=True,
                deadline_date__lt=date.today(),
            ),
            CFEI_STATUSES.open: Q(
                is_completed=False,
                is_published=True,
            ) & (
                Q(display_type=CFEI_TYPES.open, deadline_date__gte=date.today()) |
                Q(display_type=CFEI_TYPES.direct, completed_date=None)
            ),
        }

        queries = [filters.get(val) for val in values]

        if queries:
            query = reduce(lambda x, y: x | y, queries)
            queryset = queryset.filter(query)

        return queryset


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
    status = CommaSeparatedListFilter(name='status')
    agency = CharFilter(method='filter_agency')
    did_win = BooleanFilter(widget=BooleanWidget())
    cfei_active = BooleanFilter(method='filter_cfei_active', widget=BooleanWidget())
    eoi = CharFilter(method='filter_eoi_type')
    agency_app = CharFilter(method='filter_agency_applications')

    applications_status = ChoiceFilter(method='filter_applications_status', choices=EXTENDED_APPLICATION_STATUSES)

    class Meta:
        model = Application
        fields = (
            'project_title',
            'legal_name',
            'country_code',
            'eoi',
            'partner',
            'status',
            'did_win',
        )

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
                'partner_decision_date__isnull': True,
            },
            EXTENDED_APPLICATION_STATUSES.accepted: {
                'did_win': True,
                'did_accept': True,
                'partner_decision_date__isnull': False,
            },
            EXTENDED_APPLICATION_STATUSES.declined: {
                'did_win': True,
                'did_decline': True,
                'partner_decision_date__isnull': False,
            },
        }

        return queryset.filter(**filters.get(value, {}))

    def filter_agency(self, queryset, name, value):
        return queryset.filter(eoi__agency=value)

    def filter_cfei_active(self, queryset, name, value):
        if value:
            return queryset.filter(eoi__is_completed=False)
        return queryset.filter(eoi__is_completed=True)

    def filter_eoi_type(self, quesryset, name, value):
        if value == 'Ucn':
            return quesryset.filter(is_unsolicited=True)
        else:
            return quesryset.filter(eoi__display_type=value)

    def filter_agency_applications(self, quesryset, name, value):
        return quesryset.filter(agency=value)


class ApplicationsEOIFilter(django_filters.FilterSet):
    legal_name = CharFilter(method='filter_legal_name')
    country_code = CharFilter(method='filter_country_code')
    location = CharFilter(method='filter_location')
    specializations = ModelMultipleChoiceFilter(
        widget=CSVWidget(), name='partner__experiences__specialization', queryset=Specialization.objects.all()
    )
    concern = CharFilter(method='filter_concern')
    type_of_org = CharFilter(method='filter_type_of_org')
    status = CommaSeparatedListFilter(name='status')

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

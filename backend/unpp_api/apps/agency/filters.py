# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import django_filters
from django_filters.filters import MultipleChoiceFilter, CharFilter, BooleanFilter
from django_filters.widgets import CSVWidget, BooleanWidget

from account.models import User
from agency.models import Agency
from agency.roles import AgencyRole, VALID_FOCAL_POINT_ROLE_NAMES, VALID_REVIEWER_ROLE_NAMES
from common.filter_fields import CommaSeparatedListFilter


class AgencyUserFilter(django_filters.FilterSet):

    name = CharFilter(name='fullname', lookup_expr='icontains')
    office_name = CharFilter(name='agency_members__office__name', lookup_expr='icontains')
    role = MultipleChoiceFilter(
        widget=CSVWidget(),
        name='agency_members__role',
        choices=AgencyRole.get_choices()
    )
    focal = BooleanFilter(
        method='filter_focal_points', widget=BooleanWidget(), label='Can be selected as focal point'
    )
    reviewer = BooleanFilter(
        method='filter_reviewers', widget=BooleanWidget(), label='Can be selected as reviewer'
    )
    exclude = CommaSeparatedListFilter(name='id', exclude=True)

    class Meta:
        model = User
        fields = (
            'role',
            'name',
            'office_name',
            'focal',
            'reviewer',
            'exclude',
        )

    def filter_focal_points(self, queryset, name, value):
        if value is True:
            queryset = queryset.filter(agency_members__role__in=VALID_FOCAL_POINT_ROLE_NAMES)
        elif value is False:
            queryset = queryset.exclude(agency_members__role__in=VALID_FOCAL_POINT_ROLE_NAMES)

        return queryset.distinct('id')

    def filter_reviewers(self, queryset, name, value):
        if value is True:
            queryset = queryset.filter(agency_members__role__in=VALID_REVIEWER_ROLE_NAMES)
        elif value is False:
            queryset = queryset.exclude(agency_members__role__in=VALID_REVIEWER_ROLE_NAMES)

        return queryset.distinct('id')


class AgencyFilter(django_filters.FilterSet):

    exclude = CharFilter(name='name', lookup_expr='iexact', exclude=True)

    class Meta:
        model = Agency
        fields = ['name']

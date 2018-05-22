# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import django_filters
from django_filters.filters import MultipleChoiceFilter, CharFilter, BooleanFilter
from django_filters.widgets import CSVWidget, BooleanWidget

from account.models import User
from agency.models import Agency
from agency.roles import AgencyRole


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

    class Meta:
        model = User
        fields = ['role', 'name', 'office_name']

    def filter_focal_points(self, queryset, name, value):
        valid_focal_point_role_names = {
            AgencyRole.EDITOR_ADVANCED.name,
            AgencyRole.EDITOR_ADVANCED_MFT.name,
        }

        if value is True:
            queryset.filter(agency_members__role__in=valid_focal_point_role_names)
        elif value is False:
            queryset.exclude(agency_members__role__in=valid_focal_point_role_names)

        return queryset


class AgencyFilter(django_filters.FilterSet):

    exclude = CharFilter(name='name', lookup_expr='iexact', exclude=True)

    class Meta:
        model = Agency
        fields = ['name']

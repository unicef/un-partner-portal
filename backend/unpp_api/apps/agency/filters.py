# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import django_filters
from django_filters.filters import MultipleChoiceFilter, CharFilter
from django_filters.widgets import CSVWidget

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

    class Meta:
        model = User
        fields = ['role', 'name', 'office_name']


class AgencyFilter(django_filters.FilterSet):

    exclude = CharFilter(name='name', lookup_expr='iexact', exclude=True)

    class Meta:
        model = Agency
        fields = ['name']

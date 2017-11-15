# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db.models import Q

import django_filters
from django_filters.filters import MultipleChoiceFilter, CharFilter
from django_filters.widgets import CSVWidget

from account.models import User
from common.consts import MEMBER_ROLES


class AgencyUserFilter(django_filters.FilterSet):

    name = CharFilter(method='get_name')
    role = MultipleChoiceFilter(
        widget=CSVWidget(),
        name='agency_members__role',
        choices=MEMBER_ROLES)

    class Meta:
        model = User
        fields = ['role', 'name']

    def get_name(self, queryset, name, value):
        return queryset.filter(
            Q(first_name__icontains=value) |
            Q(last_name__icontains=value)
        )

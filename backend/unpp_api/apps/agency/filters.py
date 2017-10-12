# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import django_filters
from django_filters.filters import MultipleChoiceFilter
from django_filters.widgets import CSVWidget

from account.models import User
from .models import AgencyMember
from common.consts import MEMBER_ROLES


class AgencyUserFilter(django_filters.FilterSet):

    role = MultipleChoiceFilter(
        widget=CSVWidget(),
        name='agency_members__role',
        choices=MEMBER_ROLES)

    class Meta:
        model = User
        fields = ['role']

    def get_role(self, queryset, name, value):
        return queryset.filter(agency_members__role=value)

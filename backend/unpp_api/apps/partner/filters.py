# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import django_filters
from django_filters.filters import CharFilter, ModelMultipleChoiceFilter
from django_filters.widgets import CSVWidget

from common.consts import PARTNER_TYPES, FLAG_TYPES
from common.filter_fields import CommaSeparatedListFilter
from common.models import Specialization
from review.models import PartnerVerification
from partner.models import Partner


class PartnersListFilter(django_filters.FilterSet):

    legal_name = CharFilter(method='filter_legal_name')
    is_verified = CharFilter(method='filter_is_verified')
    display_type = CharFilter(method='filter_display_type')
    country_code = CharFilter(method='filter_country_code')
    country_codes = CharFilter(method='filter_country_codes')
    specializations = ModelMultipleChoiceFilter(
        widget=CSVWidget(), name='experiences__specialization', queryset=Specialization.objects.all()
    )
    concern = CharFilter(method='filter_concern')
    limit = CharFilter(method='filter_limit')
    is_hq = CharFilter(method='filter_is_hq')
    no_flags = CommaSeparatedListFilter(choices=FLAG_TYPES, name='flags__flag_type', exclude=True)

    class Meta:
        model = Partner
        fields = ('legal_name', 'country_code', 'display_type', 'specializations', 'concern')

    def filter_legal_name(self, queryset, name, value):
        return queryset.filter(legal_name__icontains=value)

    def filter_is_verified(self, queryset, name, value):
        latest_verifications = PartnerVerification.objects.distinct('partner_id').order_by('partner_id', '-created')
        if value == 'verified':
            return queryset.filter(verifications__in=latest_verifications, verifications__is_verified=True)
        if value == 'unverified':
            return queryset.filter(verifications__in=latest_verifications, verifications__is_verified=False)
        if value == 'pending':
            return queryset.filter(verifications__is_verified__isnull=True)

    def filter_country_code(self, queryset, name, value):
        return queryset.filter(country_code=(value and value.upper()))

    def filter_country_codes(self, queryset, name, value):
        country_codes = filter(lambda x: x.isalpha() and len(x) == 2, value and value.upper().split(","))
        return queryset.filter(country_code__in=country_codes)

    def filter_display_type(self, queryset, name, value):
        return queryset.filter(display_type=value)

    def filter_concern(self, queryset, name, value):
        return queryset.filter(mandate_mission__concern_groups__contains=[value])

    def filter_limit(self, queryset, name, value):
        if value.isdigit():
            return queryset[:value]
        return queryset

    def filter_is_hq(self, queryset, name, value):
        if value and value.lower() == 'true':
            queryset = queryset.filter(display_type=PARTNER_TYPES.international, hq=None)
        if value and value.lower() == 'false':
            queryset = queryset.exclude(display_type=PARTNER_TYPES.international, hq=None)
        return queryset

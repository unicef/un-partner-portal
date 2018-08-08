import django_filters
from django_filters.widgets import BooleanWidget

from common.consts import PARTNER_TYPES, FLAG_TYPES, FLAG_CATEGORIES
from common.filter_fields import CommaSeparatedListFilter
from partner.models import Partner
from project.filters import BaseProjectFilter
from review.models import PartnerVerification


class VerificationChoices:
    VERIFIED = 'verified'
    UNVERIFIED = 'unverified'
    PENDING = 'pending'

    _CHOICES = [
        VERIFIED, UNVERIFIED, PENDING
    ]
    CHOICES = zip(_CHOICES, _CHOICES)


class PartnerReportFilter(django_filters.FilterSet):

    ids = CommaSeparatedListFilter(name='id', label='IDs')
    display_types = CommaSeparatedListFilter(
        choices=PARTNER_TYPES, name='display_type', label='Partner Types'
    )
    specializations = CommaSeparatedListFilter(name='experiences__specialization')
    registered = django_filters.BooleanFilter(name='profile__registered_to_operate_in_country', widget=BooleanWidget)
    collabs = CommaSeparatedListFilter(name='collaborations_partnership__agency')
    has_experience = django_filters.BooleanFilter(
        method='filter_has_experience', widget=BooleanWidget, label='Has UN Experience'
    )
    is_verified = django_filters.CharFilter(method='filter_is_verified', label='Verification Status')
    verification_year = django_filters.NumberFilter(method='filter_verification_year', label='Verification Year')
    flag = django_filters.ChoiceFilter(
        choices=FLAG_TYPES, name='flags__flag_type', label='Has Flag Type'
    )
    flag_category = django_filters.ChoiceFilter(
        choices=FLAG_CATEGORIES, name='flags__category', label='Has Flag Category'
    )
    is_hq = django_filters.BooleanFilter(
        method='filter_is_hq', widget=BooleanWidget, label='Is INGO HQ'
    )

    class Meta:
        model = Partner
        fields = (
            'ids',
            'country_code',
            'display_type',
            'specializations',
            'registered',
            'collabs',
            'has_experience',
            'is_verified',
            'verification_year',
            'flag',
            'flag_category',
            'is_hq',
        )

    def filter_has_experience(self, queryset, name, value):
        if value is True:
            return queryset.exclude(collaborations_partnership=None)
        if value is False:
            return queryset.filter(collaborations_partnership=None)
        return queryset

    def filter_is_hq(self, queryset, name, value):
        if value is True:
            return queryset.filter(display_type=PARTNER_TYPES.international, hq=None)
        return queryset

    def filter_verification_year(self, queryset, name, value):
        if value:
            latest_verifications = PartnerVerification.objects.distinct('partner_id').order_by('partner_id', '-created')
            return queryset.filter(verifications__in=latest_verifications, verifications__created__year=value)
        return queryset

    def filter_is_verified(self, queryset, name, value):
        latest_verifications = PartnerVerification.objects.distinct('partner_id').order_by('partner_id', '-created')
        if value == VerificationChoices.VERIFIED:
            return queryset.filter(verifications__in=latest_verifications, verifications__is_verified=True)
        if value == VerificationChoices.UNVERIFIED:
            return queryset.filter(verifications__in=latest_verifications, verifications__is_verified=False)
        if value == VerificationChoices.PENDING:
            return queryset.filter(verifications__is_verified__isnull=True)
        return queryset


class ProjectReportFilter(BaseProjectFilter):

    ids = CommaSeparatedListFilter(name='id', label='IDs')
    posted_year = django_filters.NumberFilter(name='published_timestamp__year', label='Year Posted')

    class Meta(BaseProjectFilter.Meta):
        fields = BaseProjectFilter.Meta.fields + (
            'ids',
            'display_type',
            'posted_year',
        )

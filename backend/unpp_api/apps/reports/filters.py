import django_filters
from django_filters.widgets import BooleanWidget

from common.filter_fields import CommaSeparatedListFilter
from partner.models import Partner


class PartnerProfileReportFilter(django_filters.FilterSet):

    specializations = CommaSeparatedListFilter(name='experiences__specialization')
    registered = django_filters.BooleanFilter(name='profile__registration_to_operate_in_country', widget=BooleanWidget)
    collabs = CommaSeparatedListFilter(name='collaborations_partnership__agency')
    has_experience = django_filters.BooleanFilter(method='filter_has_experience', widget=BooleanWidget)

    class Meta:
        model = Partner
        fields = (
            'country_code',
            'display_type',
            'specializations',
            'registered',
            'collabs',
        )

    def filter_has_experience(self, queryset, name, value):
        if value is True:
            return queryset.exclude(collaborations_partnership=None)
        if value is False:
            return queryset.filter(collaborations_partnership=None)
        return queryset

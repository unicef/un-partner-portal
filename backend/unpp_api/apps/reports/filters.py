import django_filters
from django_filters.widgets import BooleanWidget

from common.filter_fields import CommaSeparatedListFilter
from partner.models import Partner


class PartnerProfileReportFilter(django_filters.FilterSet):

    specializations = CommaSeparatedListFilter(name='experiences__specialization')
    registered = django_filters.BooleanFilter(name='profile__registration_to_operate_in_country', widget=BooleanWidget)
    agencies = CommaSeparatedListFilter(name='collaborations_partnership__agency')

    class Meta:
        model = Partner
        fields = (
            'country_code',
            'display_type',
            'specializations',
            'registered',
            'agencies',
        )

import django_filters
from django_countries.fields import Country
from django_filters.widgets import CSVWidget

from account.models import User
from agency.roles import AgencyRole
from partner.roles import PartnerRole


class PartnerUserFilter(django_filters.FilterSet):

    name = django_filters.CharFilter(name='fullname', lookup_expr='icontains')
    office = django_filters.CharFilter(name='partner_members__partner__legal_name', lookup_expr='icontains')
    role = django_filters.MultipleChoiceFilter(
        widget=CSVWidget(),
        name='agency_members__role',
        choices=PartnerRole.get_choices()
    )

    class Meta:
        model = User
        fields = ['role', 'name', 'office']


class AgencyUserFilter(PartnerUserFilter):

    office = django_filters.CharFilter(name='agency_members__office__name', method='filter_office')
    role = django_filters.MultipleChoiceFilter(
        widget=CSVWidget(),
        name='agency_members__role',
        choices=AgencyRole.get_choices()
    )

    def filter_office(self, queryset, name, value):
        country_codes = queryset.values_list('agency_members__office__country', flat=True).distinct(
            'agency_members__office__country'
        ).order_by()
        valid_codes = []
        for code in country_codes:
            if value in Country(code).name.lower():
                valid_codes.append(code)

        return queryset.filter(agency_members__office__country__in=valid_codes)

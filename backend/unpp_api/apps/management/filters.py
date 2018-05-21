import django_filters
from django_filters.widgets import CSVWidget

from account.models import User
from agency.roles import AgencyRole
from partner.roles import PartnerRole


class PartnerUserFilter(django_filters.FilterSet):

    name = django_filters.CharFilter(name='fullname', lookup_expr='icontains')
    office = django_filters.NumberFilter(name='partner_members__partner__id')
    role = django_filters.MultipleChoiceFilter(
        widget=CSVWidget(),
        name='partner_members__role',
        choices=PartnerRole.get_choices()
    )

    class Meta:
        model = User
        fields = ['role', 'name', 'office']


class AgencyUserFilter(PartnerUserFilter):

    office = django_filters.NumberFilter(name='agency_members__office__id')
    role = django_filters.MultipleChoiceFilter(
        widget=CSVWidget(),
        name='agency_members__role',
        choices=AgencyRole.get_choices()
    )

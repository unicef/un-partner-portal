import itertools
from django.urls import reverse

from agency.models import Agency
from agency.roles import AgencyRole
from common.factories import PartnerFactory
from common.tests.base import BaseAPITestCase
from partner.models import Partner


class TestPartnerProfileReportAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED
    initial_factories = []

    def test_list(self):
        PartnerFactory.create_batch(20)
        partners = Partner.objects.all()
        list_url = reverse('reports:partner-information')
        list_response = self.client.get(list_url)
        self.assertResponseStatusIs(list_response)
        self.assertEqual(list_response.data['count'], partners.count())

        for country_code in partners.values_list('country_code').distinct():
            list_response = self.client.get(list_url + f'?country_code={country_code}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], partners.filter(country_code=country_code).count())

        for display_type in partners.values_list('display_type').distinct():
            list_response = self.client.get(list_url + f'?display_type={display_type}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], partners.filter(display_type=display_type).count())

        for registration_to_operate_in_country in (True, False):
            list_response = self.client.get(list_url + f'?registered={registration_to_operate_in_country}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], partners.filter(
                profile__registration_to_operate_in_country=registration_to_operate_in_country
            ).count())

        for agency in Agency.objects.all():
            list_response = self.client.get(list_url + f'?collabs={agency.id}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], partners.filter(
                collaborations_partnership__agency=agency
            ).count())

        spec_options = set(map(
            frozenset, itertools.permutations(partners.values_list('experiences__specialization__id', flat=True), 2)
        ))

        for ids in spec_options:
            list_response = self.client.get(list_url + f'?specializations={",".join(map(str, ids))}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], partners.filter(
                experiences__specialization__in=ids
            ).distinct().count())

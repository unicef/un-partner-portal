from django.urls import reverse

from agency.roles import AgencyRole
from common.factories import PartnerFactory
from common.tests.base import BaseAPITestCase


class TestPartnerProfileReportAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED
    initial_factories = []

    def test_list_all(self):
        partners = PartnerFactory.create_batch(20)
        list_url = reverse('reports:partner-information')
        list_response = self.client.get(list_url)
        self.assertResponseStatusIs(list_response)
        self.assertEqual(list_response.data['count'], len(partners))

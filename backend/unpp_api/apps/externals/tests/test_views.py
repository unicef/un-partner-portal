from django.urls import reverse

from rest_framework import status

from agency.roles import AgencyRole
from common.tests.base import BaseAPITestCase
from common.factories import PartnerSimpleFactory


class TestPartnerVendorNumberAPIViewTestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    def test_add_vendor_number(self):
        url = reverse('externals:vendor-number-create')
        partner = PartnerSimpleFactory()
        number = 'TEST_VENDOR_NUMBER'

        create_response = self.client.post(url, data={
            'partner': partner.pk,
            'number': number,
        })
        self.assertResponseStatusIs(create_response, status.HTTP_201_CREATED)

        details_url = reverse('externals:vendor-number-details', kwargs={'pk': create_response.data['id']})
        update_response = self.client.patch(details_url, data={
            'number': 'OTHER_NUMBER',
        })
        self.assertResponseStatusIs(update_response, status.HTTP_200_OK)
        self.assertNotEqual(update_response.data['number'], number)

        update_response = self.client.patch(details_url, data={
            'partner': PartnerSimpleFactory().pk,
        })
        self.assertResponseStatusIs(update_response, status.HTTP_200_OK)

        details_response = self.client.get(details_url)
        self.assertResponseStatusIs(details_response)
        self.assertEqual(details_response.data['partner'], partner.id)

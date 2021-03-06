import os
import random
from datetime import date

from django.urls import reverse
from httmock import all_requests, HTTMock

from rest_framework import status

from agency.agencies import UNICEF
from agency.roles import AgencyRole
from common.business_areas import BUSINESS_AREAS
from common.tests.base import BaseAPITestCase
from common.factories import PartnerSimpleFactory, UNICEFVendorDataFactory
from externals.models import PartnerVendorNumber, UNICEFVendorData
from externals.sources.unicef import UNICEFInfoDownloader


class TestPartnerVendorNumberAPIViewTestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    def test_add_vendor_number(self):
        url = reverse('externals:vendor-number-create')
        partner = PartnerSimpleFactory(country_code='XZ')

        number = 'TEST_VENDOR_NUMBER'

        create_response = self.client.post(url, data={
            'partner': partner.pk,
            'business_area': random.choice(list(BUSINESS_AREAS._db_values)),
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

        partner_summary = self.client.get(reverse('partners:partner-profile-summary', kwargs={'pk': partner.pk}))
        self.assertResponseStatusIs(partner_summary)
        self.assertIsNotNone(partner_summary.data['vendor_numbers'])

    def test_add_vendor_number_no_business_area(self):
        url = reverse('externals:vendor-number-create')
        partner = PartnerSimpleFactory(country_code='XZ')

        number = 'TEST_VENDOR_NUMBER'

        create_response = self.client.post(url, data={
            'partner': partner.pk,
            'number': number,
        })
        self.assertResponseStatusIs(create_response, status.HTTP_201_CREATED)


class TestUNICEFVendorDataTestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    def test_add_vendor_number(self):
        partner = PartnerSimpleFactory()
        test_vendor_number = 'TEST_VN'

        current_year = date.today().year
        for year in range(max(2015, current_year - 5), current_year + 1):
            UNICEFVendorDataFactory(year=year, vendor_number=test_vendor_number)

        PartnerVendorNumber.objects.create(
            partner=partner,
            agency=UNICEF.model_instance,
            number=test_vendor_number,
            business_area=random.choice(list(BUSINESS_AREAS._db_values))
        )

        partner_erp_data_url = reverse('externals:partner-external-details', kwargs={
            'agency_id': UNICEF.model_instance.id,
            'partner_id': partner.id,
        })
        partner_erp_data_response = self.client.get(partner_erp_data_url)
        self.assertResponseStatusIs(partner_erp_data_response)
        data_row = partner_erp_data_response.data['tables'][0]['rows'][0]

        for number in data_row[2:]:
            self.assertTrue(number)

    def test_vendor_data_sync(self):
        response_sample_file_path = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), 'samples', 'UNICEF_API_SAMPLE_OUTPUT.xml'
        )

        @all_requests
        def unicef_api_response(url, request):
            with open(response_sample_file_path, 'rb') as api_sample_file:
                return {
                    'status_code': 200,
                    'content': api_sample_file.read()
                }

        with HTTMock(unicef_api_response):
            UNICEFInfoDownloader().sync_business_areas()

        self.assertEqual(
            UNICEFVendorData.objects.count(),
            (len(BUSINESS_AREAS) - 1) * 3
        )

from django.urls import reverse

from common.factories import OpenEOIFactory
from common.tests.base import BaseAPITestCase


class TestProjectPublicListing(BaseAPITestCase):

    quantity = 50
    initial_factories = [
        OpenEOIFactory,
    ]

    def test_listing(self):
        self.client.logout()

        url = reverse('public:project-listing')

        while url:
            response = self.client.get(url)
            self.assertResponseStatusIs(response)

            for project_data in response.data['results']:
                pdf_response = self.client.get(project_data['pdf_export_url'])
                self.assertResponseStatusIs(pdf_response)
                self.assertEqual(pdf_response.content_type, 'application/pdf')
            url = response.data['next']

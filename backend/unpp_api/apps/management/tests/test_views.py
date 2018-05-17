import random

from django.urls import reverse

from agency.roles import AgencyRole
from common.factories import AgencyFactory, UserFactory, PartnerFactory, AgencyOfficeFactory, AgencyMemberFactory
from common.tests.base import BaseAPITestCase
from rest_framework import status


class TestAgencyUserManagement(BaseAPITestCase):

    quantity = 1
    initial_factories = [
        AgencyFactory,
        UserFactory,
        PartnerFactory,
    ]
    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.ADMINISTRATOR

    def test_invite_agency_user(self):
        url = reverse('management:user-add')
        payload = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@test.com',
        }

        response = self.client.post(url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('office_memberships', response.data)

        payload['office_memberships'] = [{
            'office_id': self.user.member.office.id,
        }]

        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.data)
        self.assertEqual(len(response.data['office_memberships']), 1)
        self.assertEqual(response.data['office_memberships'][0]['role'], AgencyRole.READER.name)
        self.assertEqual(response.data['status'], 'Invited')

        # Test Update
        new_offices = AgencyOfficeFactory.create_batch(2, agency=self.user.agency)
        payload['office_memberships'] = [{
            'office_id': office.id,
            'role': random.choice(list(AgencyRole)).name
        } for office in new_offices]

        url = reverse('management:user-details', kwargs={'pk': response.data['id']})
        response = self.client.patch(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)
        self.assertEqual(len(response.data['office_memberships']), 2)

    def test_deactivate_user(self):
        url = reverse('management:user-add')
        payload = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@test.com',
            'office_memberships': [{
                'office_id': self.user.member.office.id,
            }]
        }

        response = self.client.post(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.data)

        # Test Update
        payload['is_active'] = False

        url = reverse('management:user-details', kwargs={'pk': response.data['id']})
        response = self.client.patch(url, data=payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)
        self.assertEqual(response.data['status'], 'Deactivated')

    def test_list_users(self):
        office = AgencyOfficeFactory.create_batch(1, agency=self.user.agency)[0]
        AgencyMemberFactory.create_batch(5, office=office)
        url = reverse('management:user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)

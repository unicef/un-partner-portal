import random

from django.urls import reverse

from agency.roles import AgencyRole
from common.consts import PARTNER_TYPES
from common.factories import AgencyFactory, UserFactory, PartnerFactory, AgencyOfficeFactory, AgencyMemberFactory, \
    PartnerMemberFactory
from common.headers import CustomHeader
from common.tests.base import BaseAPITestCase
from rest_framework import status

from partner.roles import PartnerRole


class TestAgencyUserManagement(BaseAPITestCase):

    quantity = 1
    initial_factories = [
        AgencyFactory,
        UserFactory,
    ]
    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.HQ_EDITOR

    def test_invite_agency_user(self):
        url = reverse('management:user-add')
        payload = {
            'fullname': 'John Doe',
            'email': 'john.doe@test.com',
        }

        response = self.client.post(url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('office_memberships', response.data)

        payload['office_memberships'] = [{
            'office_id': self.user.member.office.id,
        }]

        response = self.client.post(url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.data)
        self.assertEqual(len(response.data['office_memberships']), 1)
        self.assertEqual(response.data['office_memberships'][0]['role'], AgencyRole.READER.name)
        self.assertEqual(response.data['status'], 'Invited')

        # Test Update
        new_offices = AgencyOfficeFactory.create_batch(2, agency=self.user.agency)
        payload['office_memberships'] = [{
            'office_id': office.id,
            'role': random.choice(AgencyRole.get_choices(self.user.agency))[0]
        } for office in new_offices]

        url = reverse('management:user-details', kwargs={'pk': response.data['id']})
        response = self.client.patch(url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)
        self.assertEqual(len(response.data['office_memberships']), 2)

    def test_deactivate_user(self):
        url = reverse('management:user-add')
        payload = {
            'fullname': 'John Doe',
            'email': 'john.doe@test.com',
            'office_memberships': [{
                'office_id': self.user.member.office.id,
            }]
        }

        response = self.client.post(url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.data)

        # Test Update
        payload['is_active'] = False

        url = reverse('management:user-details', kwargs={'pk': response.data['id']})
        response = self.client.patch(url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)
        self.assertEqual(response.data['status'], 'Deactivated')

    def test_list_users(self):
        office = AgencyOfficeFactory(agency=self.user.agency)
        AgencyMemberFactory.create_batch(5, office=office)
        url = reverse('management:user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)


class TestPartnerUserManagement(BaseAPITestCase):

    quantity = 1
    user_type = BaseAPITestCase.USER_PARTNER
    partner_role = PartnerRole.ADMIN

    def test_invite_partner_user(self):
        active_partner = self.user.member.partner
        active_partner.display_type = PARTNER_TYPES.international
        active_partner.save()

        url = reverse('management:user-add')
        payload = {
            'fullname': 'John Doe',
            'email': 'john.doe@test.com',
        }

        response = self.client.post(url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('office_memberships', response.data)

        payload['office_memberships'] = [{
            'office_id': self.user.member.partner_id
        }]

        response = self.client.post(url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.data)
        self.assertEqual(len(response.data['office_memberships']), 1)
        self.assertEqual(response.data['office_memberships'][0]['role'], PartnerRole.READER.name)
        self.assertEqual(response.data['status'], 'Invited')

        # Test Update
        new_partners = PartnerFactory.create_batch(
            2, hq=self.user.member.partner, display_type=PARTNER_TYPES.international
        )
        payload['office_memberships'] = [{
            'office_id': partner.id,
            'role': random.choice(list(PartnerRole)).name
        } for partner in new_partners]

        url = reverse('management:user-details', kwargs={'pk': response.data['id']})
        response = self.client.patch(url, data=payload, HTTP_PARTNER_ID=active_partner.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)
        self.assertEqual(len(response.data['office_memberships']), 2)

    def test_deactivate_user(self):
        url = reverse('management:user-add')
        payload = {
            'fullname': 'John Doe',
            'email': 'john.doe@test.com',
            'office_memberships': [{
                'office_id': self.user.member.partner_id,
            }]
        }

        response = self.client.post(url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.data)
        url = reverse('management:user-list')
        list_response = self.client.get(url)
        self.assertEqual(list_response.status_code, status.HTTP_200_OK, msg=response.data)
        initial_count = list_response.data['count']

        url = reverse('management:user-details', kwargs={'pk': response.data['id']})
        response = self.client.patch(url, data={
            'is_active': False
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)
        self.assertEqual(response.data['status'], 'Deactivated')

        url = reverse('management:user-list')
        list_response = self.client.get(url)
        self.assertEqual(list_response.status_code, status.HTTP_200_OK, msg=response.data)
        # Check that inactive users are still listed
        self.assertEqual(list_response.data['count'], initial_count)

    def test_list_users(self):
        partner = PartnerFactory()
        PartnerMemberFactory.create_batch(5, partner=partner)
        url = reverse('management:user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)

    def test_user_with_permissions_in_one_office_only(self):
        partner1 = PartnerFactory()
        partner2 = PartnerFactory()

        user = UserFactory()
        member_admin = PartnerMemberFactory(
            partner=partner1,
            user=user,
            role=PartnerRole.ADMIN.name,
        )
        member_reader = PartnerMemberFactory(
            partner=partner2,
            user=user,
            role=PartnerRole.READER.name,
        )

        with self.login_as_user(user):
            # Disallow access to management endpoint when toggled under profile with reader permissions
            self.client.set_headers({
                CustomHeader.PARTNER_ID.value: member_reader.partner.id
            })

            url = reverse('management:user-list')
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, msg=response.data)

            # Allow access to management endpoint when toggled under profile with admin permissions
            self.client.set_headers({
                CustomHeader.PARTNER_ID.value: member_admin.partner.id
            })

            url = reverse('management:user-list')
            response = self.client.get(url)
            self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)
            # Check that only offices that user can manage are returned
            self.assertEqual(
                len(response.data['results'][0]['office_memberships']), 1
            )

            self.assertEqual(
                user.partner_members.all().count(), 2
            )
            url = reverse('management:user-details', kwargs={'pk': user.id})
            patch_payload = response.data['results'][0]['office_memberships']
            patch_payload[0]['role'] = PartnerRole.EDITOR.name
            patch_payload[0]['office_id'] = patch_payload[0]['office']['id']
            response = self.client.patch(url, data={
                'office_memberships': patch_payload
            })
            self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)
            self.assertEqual(
                user.partner_members.all().count(), 2
            )

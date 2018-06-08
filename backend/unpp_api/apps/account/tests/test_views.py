from __future__ import unicode_literals
from django.urls import reverse
from django.core import mail
from rest_framework import status
from rest_framework.test import APITestCase

from common.consts import PARTNER_TYPES, FUNCTIONAL_RESPONSIBILITY_CHOICES
from common.tests.base import BaseAPITestCase
from partner.models import Partner
from account.models import User


class TestRegisterPartnerAccountAPITestCase(APITestCase):

    def setUp(self):
        super(TestRegisterPartnerAccountAPITestCase, self).setUp()
        email = "test@myorg.org"
        User.objects.create(fullname=email, email=email)
        self.data = {
            "partner": {
                "legal_name": "My org legal name",
                "country_code": "PL",
                "display_type": PARTNER_TYPES.international,
            },
            "user": {
                "email": email,
                "password": "Test123!",
                "fullname": "Leszek Orzeszek",
            },
            "partner_profile": {
                "alias_name": "Name Inc.",
                "acronym": "N1",
                "legal_name_change": True,
                "former_legal_name": "Former Legal Name Inc.",
            },
            "partner_head_organization": {
                "fullname": "Jack Orzeszek",
                "email": "captain@blackpearl.org",
            },
            "partner_member": {
                "title": "Project Manager",
            },
        }

    def test_register_partner(self):
        """
        Register partner via registration process.
        """
        url = reverse('accounts:registration')
        response = self.client.post(url, data=self.data, format='json')

        self.assertTrue(status.is_client_error(response.status_code))
        self.assertEquals(
            response.data, {'user': {'email': [u'This field must be unique.']}}
        )

        self.data['user']['email'] = "new-user@myorg.org"
        response = self.client.post(url, data=self.data, format='json')
        self.assertTrue(status.is_success(response.status_code))
        self.assertEquals(response.data['partner']['legal_name'],
                          self.data['partner']['legal_name'])
        self.assertEquals(response.data['user']['email'],
                          self.data['user']['email'])
        self.assertEquals(response.data['partner_profile']['former_legal_name'],
                          self.data['partner_profile']['former_legal_name'])
        self.assertEquals(response.data['partner_profile']['acronym'],
                          self.data['partner_profile']['acronym'])
        self.assertEquals(response.data['partner_head_organization']['email'],
                          self.data['partner_head_organization']['email'])
        self.assertEquals(response.data['partner_member']['title'],
                          self.data['partner_member']['title'])

        self.assertEquals(response.data['user'].get("password"), None)

        # confirm that partner was created by logging in
        url = reverse('rest_login')
        response = self.client.post(url, data=self.data['user'], format='json')
        self.assertTrue(status.is_success(response.status_code))

        partner = Partner.objects.first()
        self.assertEqual(partner.legal_name, self.data['partner']['legal_name'])
        self.assertTrue(partner.mailing_address)
        self.assertTrue(partner.org_head)
        self.assertTrue(partner.audit)
        self.assertTrue(partner.report)
        self.assertTrue(partner.mandate_mission)
        self.assertTrue(partner.fund)
        self.assertTrue(partner.other_info)
        self.assertEquals(partner.internal_controls.count(),
                          len(list(FUNCTIONAL_RESPONSIBILITY_CHOICES._db_values)))

        # check if logout endpoint works correctly
        url = reverse('rest_logout')
        response = self.client.post(url, data={}, format='json')
        self.assertTrue(status.is_success(response.status_code))

        url = reverse('rest_login')
        user_data = self.data['user']
        user_data['password'] = 'fail'
        response = self.client.post(url, data=user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class PreventDuplicateRegistrationsAPITestCase(APITestCase):

    def setUp(self):
        super(PreventDuplicateRegistrationsAPITestCase, self).setUp()
        self.email = "test@myorg.org"
        self.password = 'Test123!'

        self.data = {
            "partner": {
                "legal_name": "Org Name",
                "country_code": "PL",
                "display_type": PARTNER_TYPES.international,
            },
            "user": {
                "email": self.email,
                "password": self.password,
                "fullname": "John Doe",
            },
            "partner_profile": {
                "alias_name": "Alias Org Name",
                "acronym": "O",
            },
            "partner_head_organization": {
                "fullname": "Jane Doe",
                "email": "test2@myorg.org",
            },
            "partner_member": {
                "title": "Project Manager",
            },
        }

    def test_fails_to_register_duplicate_partner_in_same_country(self):
        url = reverse('accounts:registration')

        response = self.client.post(url, data=self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.content)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEquals(response.data['partner']['legal_name'], self.data['partner']['legal_name'])
        self.assertEquals(response.data['user']['email'], self.data['user']['email'])

        duplicate_partner_data = self.data.copy()
        duplicate_partner_data['user'] = {
            "email": 'anotehr@mail.com',
            "password": 'Test123123!',
            "fullname": "John Doe Jr.",
        }

        response = self.client.post(url, data=duplicate_partner_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data['non_field_errors']), 1)

    def test_allows_to_register_duplicate_partner_in_different_country(self):
        url = reverse('accounts:registration')

        response = self.client.post(url, data=self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.content)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEquals(response.data['partner']['legal_name'], self.data['partner']['legal_name'])
        self.assertEquals(response.data['user']['email'], self.data['user']['email'])

        duplicate_partner_data = self.data.copy()
        duplicate_partner_data['user'] = {
            "email": 'anotehr@mail.com',
            "password": 'Test123123!',
            "fullname": "John Doe Jr.",
        }
        duplicate_partner_data['partner']['country_code'] = 'GB'

        response = self.client.post(url, data=duplicate_partner_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_fails_to_register_different_partner_for_existing_org_head(self):
        url = reverse('accounts:registration')

        response = self.client.post(url, data=self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.content)
        self.assertTrue(status.is_success(response.status_code))
        self.assertEquals(response.data['partner']['legal_name'], self.data['partner']['legal_name'])
        self.assertEquals(response.data['user']['email'], self.data['user']['email'])

        duplicate_partner_data = self.data.copy()
        duplicate_partner_data['user'] = {
            "email": 'anotehr@mail.com',
            "password": 'Test123123!',
            "fullname": "John Doe Jr.",
        }
        duplicate_partner_data['partner']['legal_name'] = 'Other Organization'

        response = self.client.post(url, data=duplicate_partner_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data['non_field_errors']), 1)


class TestUserProfileUpdateAPITestCase(BaseAPITestCase):

    def test_register_partner(self):
        profile_url = reverse('accounts:my-profile')
        response = self.client.get(profile_url)
        self.assertResponseStatusIs(response)
        self.assertEqual(response.data['notification_frequency_display'], 'Daily')

        options = self.client.get(reverse('common:general-config')).data['notification-frequency-choices']

        for option_code, option_name in options:
            request_data = {
                'notification_frequency': option_code
            }
            update_response = self.client.patch(profile_url, data=request_data)
            self.assertResponseStatusIs(update_response)
            self.assertEqual(update_response.data['notification_frequency_display'], option_name)


class TestPasswordResetTestCase(BaseAPITestCase):

    def test_pw_reset(self):
        reset_request_url = reverse('rest_password_reset')
        response = self.client.post(reset_request_url, data={
            'email': self.user.email
        })
        self.assertResponseStatusIs(response)
        self.assertTrue(len(mail.outbox) >= 1)
        pw_reset_email = mail.outbox[0]
        self.assertEqual(pw_reset_email.subject, 'UNPP Password Reset')
        self.assertIn(self.user.email, pw_reset_email.to)

        reset_url = next(filter(lambda l: 'token=' in l, pw_reset_email.body.split()))
        token = reset_url.split('token=')[-1]


        print(reset_url)

from __future__ import unicode_literals

import base64
import random
from datetime import date

from dateutil.relativedelta import relativedelta
from django.urls import reverse
from django.core import mail
from rest_framework import status
from rest_framework.test import APITestCase

from common.consts import PARTNER_TYPES, FUNCTIONAL_RESPONSIBILITY_CHOICES
from common.tests.base import BaseAPITestCase
from partner.models import Partner
from account.models import User


class TestRegisterPartnerAccountAPITestCase(BaseAPITestCase):

    with_session_login = False

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
                "year_establishment": 1900,
                "registered_to_operate_in_country": False,
                "missing_registration_document_comment": "comment",
                "have_governing_document": True,
            },
            "partner_head_organization": {
                "fullname": "Jack Orzeszek",
                "email": "captain@blackpearl.org",
            },
            "partner_member": {
                "title": "Project Manager",
            },
            "declaration": [{
                'question': f'question{n}',
                'answer': 'Yes',
            } for n in range(random.randint(5, 10))]
        }

    def test_register_partner(self):
        payload = self.data.copy()
        url = reverse('accounts:registration')
        response = self.client.post(url, data=payload)

        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)
        self.assertEquals(
            response.data, {'user': {'email': [u'This field must be unique.']}}
        )

        payload['user']['email'] = "new-user@myorg.org"
        response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)
        self.assertIn('document', response.data['non_field_errors'][0])

        file_content = base64.encodebytes(b'TEST_FILE_CONTENT')
        filename = 'testfile.doc'

        payload['governing_document'] = {
            'document':  {
                'content': file_content,
                'filename': filename,
            },
        }
        payload['registration_document'] = {
            'document':  {
                'content': file_content,
                'filename': filename,
            },
            'issue_date': date.today() - relativedelta(years=random.randint(1, 4)),
            'expiry_date': date.today() + relativedelta(years=random.randint(5, 20)),
            'registration_number': 'TEST_NUMBER',
        }
        payload['recommendation_document'] = {
            'evidence_file': {
                'content': file_content,
                'filename': filename,
            },
            'date_received': date.today() - relativedelta(years=random.randint(1, 4)),
            'organization_name': 'TEST_ORG',
        }

        response = self.client.post(url, data=payload, format='json')
        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
        self.assertEquals(
            response.data['partner']['legal_name'], payload['partner']['legal_name']
        )
        self.assertEquals(
            response.data['user']['email'], payload['user']['email']
        )
        self.assertEquals(
            response.data['partner_profile']['former_legal_name'], payload['partner_profile']['former_legal_name']
        )
        self.assertEquals(
            response.data['partner_profile']['acronym'], payload['partner_profile']['acronym']
        )
        self.assertEquals(
            response.data['partner_head_organization']['email'], payload['partner_head_organization']['email']
        )
        self.assertEquals(
            response.data['partner_member']['title'], payload['partner_member']['title']
        )
        partner_id = response.data['partner']['id']
        self.assertEquals(response.data['user'].get("password"), None)

        # confirm that partner was created by logging in
        url = reverse('rest_login')
        response = self.client.post(url, data=payload['user'], format='json')
        self.assertResponseStatusIs(response)

        partner = Partner.objects.get(id=partner_id)
        self.assertEqual(partner.legal_name, payload['partner']['legal_name'])
        self.assertTrue(partner.mailing_address)
        self.assertTrue(partner.org_head)
        self.assertTrue(partner.audit)
        self.assertTrue(partner.report)
        self.assertTrue(partner.mandate_mission)
        self.assertTrue(partner.fund)
        self.assertTrue(partner.other_info)
        self.assertEquals(
            partner.internal_controls.count(), len(list(FUNCTIONAL_RESPONSIBILITY_CHOICES._db_values))
        )

        # check if logout endpoint works correctly
        url = reverse('rest_logout')
        response = self.client.post(url, data={}, format='json')
        self.assertResponseStatusIs(response)

        url = reverse('rest_login')
        user_data = payload['user']
        user_data['password'] = 'fail'
        response = self.client.post(url, data=user_data, format='json')
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)


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
                "year_establishment": 1900,
                "registered_to_operate_in_country": False,
                "missing_registration_document_comment": "comment",
                "have_governing_document": True,
            },
            "partner_head_organization": {
                "fullname": "Jane Doe",
                "email": "test2@myorg.org",
            },
            "partner_member": {
                "title": "Project Manager",
            },
            "governing_document": {
                'document': {
                    'content': base64.encodebytes(b'TEST_FILE_CONTENT'),
                    'filename': 'testfile.doc',
                },
            },
            "declaration": [{
                'question': f'question{n}',
                'answer': 'Yes',
            } for n in range(random.randint(5, 10))]
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

    def test_profile_update(self):
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
        self.client.logout()

        reset_request_url = reverse('rest_password_reset')
        response = self.client.post(reset_request_url, data={
            'email': self.user.email
        })
        self.assertResponseStatusIs(response)
        self.assertTrue(len(mail.outbox) >= 1)
        pw_reset_email = mail.outbox[0]
        self.assertEqual(pw_reset_email.subject, 'UNPP Password Reset')
        self.assertIn(self.user.email, pw_reset_email.to)

        reset_url = next(filter(lambda l: 'password-reset' in l, pw_reset_email.body.split()))
        url_path_parts = reset_url.split('/')
        token = url_path_parts[-1]
        uid = url_path_parts[-2]

        new_password = '124jn534n234oi124'

        reset_payload = {
            'uid': uid,
            'token': token,
            'new_password1': new_password,
            'new_password2': new_password,
        }

        api_reset_url = reverse('rest_password_reset_confirm')
        reset_response = self.client.post(api_reset_url, data=reset_payload)
        self.assertResponseStatusIs(reset_response)

        self.assertTrue(self.client.login(
            email=self.user.email,
            password=reset_payload['new_password1']
        ))

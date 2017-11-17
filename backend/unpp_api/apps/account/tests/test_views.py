from __future__ import unicode_literals
from django.urls import reverse
from rest_framework import status as statuses
from rest_framework.test import APITestCase

from common.consts import PARTNER_TYPES, FUNCTIONAL_RESPONSIBILITY_CHOICES
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

        self.assertTrue(statuses.is_client_error(response.status_code))
        self.assertEquals(
            response.data, {'user': {'email': [u'This field must be unique.']}}
        )

        self.data['user']['email'] = "new-user@myorg.org"
        response = self.client.post(url, data=self.data, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['partner']['legal_name'],
                          self.data['partner']['legal_name'])
        self.assertEquals(response.data['user']['email'],
                          self.data['user']['email'])
        self.assertEquals(response.data['partner_profile']['former_legal_name'],
                          self.data['partner_profile']['former_legal_name'])
        self.assertEquals(response.data['partner_head_organization']['email'],
                          self.data['partner_head_organization']['email'])
        self.assertEquals(response.data['partner_member']['title'],
                          self.data['partner_member']['title'])

        self.assertEquals(response.data['user'].get("password"), None)

        # confirm that partner was created by logging in
        url = reverse('rest_login')
        response = self.client.post(url, data=self.data['user'], format='json')
        self.assertTrue(statuses.is_success(response.status_code))

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

        # check if logout endpoint work correct
        url = reverse('rest_logout')
        response = self.client.post(url, data={}, format='json')
        self.assertTrue(statuses.is_success(response.status_code))

        url = reverse('rest_login')
        user_data = self.data['user']
        user_data['password'] = 'fail'
        response = self.client.post(url, data=user_data, format='json')
        self.assertEqual(response.status_code, statuses.HTTP_400_BAD_REQUEST)

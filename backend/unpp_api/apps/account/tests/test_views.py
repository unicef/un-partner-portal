# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.urls import reverse
from rest_framework import status as statuses
from rest_framework.test import APITestCase

from common.consts import PARTNER_TYPES


class TestRegisterPartnerAccountAPITestCase(APITestCase):

    def setUp(self):
        super(TestRegisterPartnerAccountAPITestCase, self).setUp()
        self.data = {
            "partner": {
                "legal_name": "My org legal name",
                "country_code": "PL",
                "display_type": PARTNER_TYPES.international,
            },
            "user": {
                "email": "test@myorg.org",
                "password": "Test123!",
                "first_name": "Leszek",
                "last_name": "Orzeszek",
            },
            "partner_profile": {
                "alias_name": "Name Inc.",
                "legal_name_change": True,
                "former_legal_name": "Former Legal Name Inc.",
                "org_head_first_name": "Jack",
                "org_head_last_name": "Sparrow",
                "org_head_email": "captain@blackpearl.org",
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

        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['partner']['legal_name'],
                          self.data['partner']['legal_name'])
        self.assertEquals(response.data['user']['email'],
                          self.data['user']['email'])
        self.assertEquals(response.data['partner_profile']['former_legal_name'],
                          self.data['partner_profile']['former_legal_name'])
        self.assertEquals(response.data['partner_member']['title'],
                          self.data['partner_member']['title'])

        self.assertEquals(response.data['user'].get("password"), None)

        # confirm that partner was created by logging in
        url = reverse('accounts:login')
        response = self.client.post(url, data=self.data['user'], format='json')
        self.assertTrue(statuses.is_success(response.status_code))

        # check if logout endpoint work correct
        # TODO: Split it! Make external test class when base test class will ne implemented
        url = reverse('accounts:logout')
        response = self.client.post(url, data={}, format='json')
        self.assertTrue(statuses.is_success(response.status_code))

        url = reverse('accounts:login')
        user_data = self.data['user']
        user_data['password'] = 'fail'
        response = self.client.post(url, data=user_data, format='json')
        self.assertEqual(response.status_code, statuses.HTTP_401_UNAUTHORIZED)

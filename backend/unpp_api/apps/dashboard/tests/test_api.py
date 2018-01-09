# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.urls import reverse
from rest_framework import status as statuses

from common.tests.base import BaseAPITestCase
from common.factories import (
    EOIFactory,
    AgencyMemberFactory,
    PartnerSimpleFactory,
    AgencyOfficeFactory,
)


class TestAgencyDashboardAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    quantity = 10

    def setUp(self):
        super(TestAgencyDashboardAPIView, self).setUp()
        PartnerSimpleFactory.create_batch(self.quantity)
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        EOIFactory.create_batch(self.quantity)

    def test_get(self):
        url = reverse('dashboard:main')
        read_response = self.client.get(url, format='json')
        self.assertEqual(read_response.status_code, statuses.HTTP_200_OK)


class TestPartnerDashboardAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_PARTNER
    quantity = 10

    def setUp(self):
        super(TestPartnerDashboardAPIView, self).setUp()
        PartnerSimpleFactory.create_batch(self.quantity)
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        EOIFactory.create_batch(self.quantity)

    def test_get(self):
        url = reverse('dashboard:main')
        read_response = self.client.get(url, format='json')
        self.assertEqual(read_response.status_code, statuses.HTTP_200_OK)


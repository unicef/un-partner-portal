# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import random
from datetime import date, timedelta

from django.urls import reverse
from django.conf import settings
from rest_framework import status as statuses

from account.models import User
from agency.models import AgencyOffice
from project.models import Application, EOI, Pin
from partner.models import Partner
from common.tests.base import BaseAPITestCase
from common.countries import COUNTRIES_ALPHA2_CODE
from common.factories import EOIFactory, AgencyMemberFactory, PartnerFactory, OtherAgencyFactory, PartnerProfileFactory
from common.models import Specialization
from common.consts import (
    SELECTION_CRITERIA_CHOICES,
    SCALE_TYPES,
    JUSTIFICATION_FOR_DIRECT_SELECTION,
    MEMBER_ROLES,
    APPLICATION_STATUSES,
    COMPLETED_REASON,
)
from project.views import PinProjectAPIView

class TestPartnerIdentificationAPITestCase(BaseAPITestCase):

    quantity = 1

    def setUp(self):
        super(TestPartnerIdentificationAPITestCase, self).setUp()
        OtherAgencyFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        EOIFactory.create_batch(self.quantity)
        PartnerFactory.create_batch(self.quantity)
        PartnerProfileFactory.create_batch(self.quantity)

    def test_identification(self):
        partner = Partner.objects.first()
        year_establishment= 2015
        registration_date = '2016-01-01'
        url = reverse('partners:identification', kwargs={"pk": partner.profile.id})
        filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.csv')
        with open(filename) as gov_doc:
            with open(filename) as registration_doc:
                payload = {
                    'year_establishment': year_establishment,
                    'have_gov_doc': True,
                    'gov_doc': gov_doc,
                    'registration_to_operate_in_country': True,
                    'registration_doc': registration_doc,
                    'registration_date': registration_date,
                    'registration_comment': 'test comment',
                    'registration_number': '123/2016',
                }
                response = self.client.put(url, data=payload, format='multipart')

        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['year_establishment'], year_establishment)
        self.assertEquals(response.data['registration_date'], registration_date)
        self.assertEquals(response.data['registration_comment'], 'test comment')
        self.assertTrue(response.data['gov_doc'] is not None)
        self.assertTrue(response.data['registration_doc'] is not None)

        response = self.client.get(url, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['registration_date'], registration_date)
        self.assertTrue(response.data['registration_doc'] is not None)
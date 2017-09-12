# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import random
from datetime import date

from django.urls import reverse
from django.conf import settings
from rest_framework import status as statuses

from account.models import User
from agency.models import AgencyOffice
from project.models import EOI, Pin
from partner.models import Partner
from common.tests.base import BaseAPITestCase
from common.countries import COUNTRIES_ALPHA2_CODE
from common.factories import EOIFactory, AgencyMemberFactory
from common.models import Specialization
from common.consts import SELECTION_CRITERIA_CHOICES, SCALE_TYPES, JUSTIFICATION_FOR_DIRECT_SELECTION
from project.views import PinProjectAPIView


class TestPinUnpinWrongEOIAPITestCase(BaseAPITestCase):

    def test_pin_unpin_project_wrong_eois(self):
        """
        Register partner via registration process.
        """
        url = reverse('projects:pins')
        response = self.client.patch(url, data={"eoi_ids": [1, 2, 3], "pin": True}, format='json')

        self.assertFalse(statuses.is_success(response.status_code))
        self.assertEquals(response.data['error'], PinProjectAPIView.ERROR_MSG_WRONG_EOI_PKS)
        self.assertEquals(Pin.objects.count(), 0)


class TestPinUnpinEOIAPITestCase(BaseAPITestCase):

    quantity = 2
    url = reverse('projects:pins')

    def setUp(self):
        super(TestPinUnpinEOIAPITestCase, self).setUp()
        AgencyMemberFactory.create_batch(self.quantity)
        EOIFactory.create_batch(self.quantity)

    def test_pin_unpin_project_wrong_params(self):
        """
        Register partner via registration process.
        """
        eoi_ids = EOI.objects.all().values_list('id', flat=True)
        response = self.client.patch(self.url, data={"eoi_ids": eoi_ids, "pin": None}, format='json')

        self.assertFalse(statuses.is_success(response.status_code))
        self.assertEquals(response.data['error'], PinProjectAPIView.ERROR_MSG_WRONG_PARAMS)
        self.assertEquals(Pin.objects.count(), 0)

    def test_pin_unpin_project(self):
        """
        Register partner via registration process.
        """
        # add pins
        eoi_ids = EOI.objects.all().values_list('id', flat=True)
        response = self.client.patch(self.url, data={"eoi_ids": eoi_ids, "pin": True}, format='json')

        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(Pin.objects.count(), self.quantity)
        self.assertEquals(response.data["eoi_ids"], list(eoi_ids))

        # read pins
        response = self.client.get(self.url, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['count'], self.quantity)

        # delete pins
        response = self.client.patch(self.url, data={"eoi_ids": eoi_ids, "pin": False}, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(Pin.objects.count(), 0)


class TestOpenProjectsAPITestCase(BaseAPITestCase):

    quantity = 2
    url = reverse('projects:open')

    def setUp(self):
        super(TestOpenProjectsAPITestCase, self).setUp()
        AgencyMemberFactory.create_batch(self.quantity)
        EOIFactory.create_batch(self.quantity)

    def test_open_project(self):
        # read open projects
        response = self.client.get(self.url, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['count'], self.quantity)

    def test_create_project(self):
        filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.csv')
        cn_template = open(filename).read()
        ao = AgencyOffice.objects.first()
        payload = {
            'eoi': {
                'title': "EOI title",
                'country_code': COUNTRIES_ALPHA2_CODE[0][0],
                'agency': ao.agency.id,
                'focal_point': User.objects.first().id,
                'locations': [
                    {
                        "country_code": 'IQ',
                        "admin_level_1": {"name": "Baghdad"},
                        "lat": random.randint(-180, 180),
                        "lon": random.randint(-180, 180),
                    },
                    {
                        "country_code": "FR",
                        "admin_level_1": {"name": "Paris"},
                        "lat": random.randint(-180, 180),
                        "lon": random.randint(-180, 180),
                    },
                ],
                'agency_office': ao.id,
                'cn_template': cn_template,
                'specializations': Specialization.objects.all().values_list('id', flat=True)[:2],
                'description': 'Brief background of the project',
                'other_information': 'Other information',
                'start_date': date.today(),
                'end_date': date.today(),
                'deadline_date': date.today(),
                'notif_results_date': date.today(),
                'has_weighting': True,
            },
            'assessment_criterias': [
                {
                    "display_type": SELECTION_CRITERIA_CHOICES.project_management,
                    "scale": SCALE_TYPES.standard,
                    "weight": random.randint(0, 100),
                    "description": "test",
                }
            ]
        }

        response = self.client.post(self.url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['eoi']['title'], payload['eoi']['title'])
        self.assertEquals(response.data['eoi']['created_by'], self.user.id)
        self.assertEquals(response.data['eoi']['id'], EOI.objects.last().id)

        # invite partners
        eoi_id = response.data['eoi']['id']
        payload = {
            "id": eoi_id,
            "invited_partners": [
                Partner.objects.first().id,
            ]
        }
        response = self.client.patch(self.url, data=payload, format='json')

        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['id'], eoi_id)
        self.assertTrue(Partner.objects.first().id in response.data['invited_partners'])


class TestDirectProjectsAPITestCase(BaseAPITestCase):

    quantity = 2
    url = reverse('projects:direct')

    def setUp(self):
        super(TestDirectProjectsAPITestCase, self).setUp()
        AgencyMemberFactory.create_batch(self.quantity)
        EOIFactory.create_batch(self.quantity)

    def test_create_direct_project(self):
        ao = AgencyOffice.objects.first()
        payload = {
            'eoi': {
                'title': "EOI title",
                'country_code': COUNTRIES_ALPHA2_CODE[0][0],
                'agency': ao.agency.id,
                'focal_point': User.objects.first().id,
                'locations': [
                    {
                        "country_code": 'IQ',
                        "admin_level_1": {"name": "Baghdad"},
                        "lat": random.randint(-180, 180),
                        "lon": random.randint(-180, 180),
                    },
                    {
                        "country_code": "FR",
                        "admin_level_1": {"name": "Paris"},
                        "lat": random.randint(-180, 180),
                        "lon": random.randint(-180, 180),
                    },
                ],
                'agency_office': ao.id,
                'specializations': Specialization.objects.all().values_list('id', flat=True)[:2],
                'description': 'Brief background of the project',
                'other_information': 'Other information',
                'start_date': date.today(),
                'end_date': date.today(),
                'notif_results_date': date.today(),
                'has_weighting': True,
            },
            'applications': [
                {
                    "partner": Partner.objects.first().id,
                    "ds_justification_select": JUSTIFICATION_FOR_DIRECT_SELECTION.known,
                    "ds_justification_reason": "To save those we love."
                },
                {
                    "partner": Partner.objects.last().id,
                    "ds_justification_select": JUSTIFICATION_FOR_DIRECT_SELECTION.local,
                    "ds_justification_reason": "To save those we love."
                }
            ]
        }

        response = self.client.post(self.url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['eoi']['title'], payload['eoi']['title'])
        self.assertEquals(response.data['eoi']['created_by'], self.user.id)
        self.assertEquals(response.data['eoi']['id'], EOI.objects.last().id)

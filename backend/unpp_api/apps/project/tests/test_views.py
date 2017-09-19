# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import random
from datetime import date

from django.urls import reverse
from django.conf import settings
from rest_framework import status as statuses

from account.models import User
from agency.models import AgencyOffice, AgencyMember
from project.models import Application, EOI, Pin
from partner.models import Partner, PartnerMember
from common.tests.base import BaseAPITestCase
from common.countries import COUNTRIES_ALPHA2_CODE
from common.factories import EOIFactory, AgencyMemberFactory, PartnerSimpleFactory
from common.models import Specialization
from common.consts import (
    SELECTION_CRITERIA_CHOICES,
    SCALE_TYPES,
    JUSTIFICATION_FOR_DIRECT_SELECTION,
    MEMBER_ROLES,
    APPLICATION_STATUSES,
)
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

    def test_create_patch_project(self):
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
        url = reverse('projects:eoi-detail', kwargs={"pk": eoi_id})
        payload = {
            "invited_partners": [
                Partner.objects.first().id,
            ]
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['id'], eoi_id)
        self.assertTrue(Partner.objects.first().id in response.data['invited_partners'])


class TestDirectProjectsAPITestCase(BaseAPITestCase):

    quantity = 2
    url = reverse('projects:direct')

    def setUp(self):
        super(TestDirectProjectsAPITestCase, self).setUp()
        PartnerSimpleFactory.create_batch(1)
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
                    "justification_reason": "To save those we love."
                },
                {
                    "partner": Partner.objects.last().id,
                    "ds_justification_select": JUSTIFICATION_FOR_DIRECT_SELECTION.local,
                    "justification_reason": "To save those we love."
                }
            ]
        }

        response = self.client.post(self.url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['eoi']['title'], payload['eoi']['title'])
        self.assertEquals(response.data['eoi']['created_by'], self.user.id)
        self.assertEquals(response.data['eoi']['id'], EOI.objects.last().id)
        app = Application.objects.get(pk=response.data['applications'][0]['id'])
        self.assertEquals(app.submitter, self.user)
        app = Application.objects.get(pk=response.data['applications'][1]['id'])
        self.assertEquals(app.submitter, self.user)


class TestPartnerApplicationsAPITestCase(BaseAPITestCase):

    quantity = 1

    def setUp(self):
        super(TestPartnerApplicationsAPITestCase, self).setUp()
        AgencyMemberFactory.create_batch(self.quantity)
        EOIFactory.create_batch(self.quantity)
        PartnerSimpleFactory.create_batch(1)

    def test_create(self):
        eoi_id = EOI.objects.first().id
        url = reverse('projects:partner-applications', kwargs={"pk": eoi_id})
        filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.csv')
        with open(filename) as cn_template:
            payload = {
                "partner": Partner.objects.last().id,
                "cn": cn_template,
            }
            response = self.client.post(url, data=payload, format='multipart')

        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['id'], Application.objects.last().id)
        self.assertEquals(response.data['eoi'], eoi_id)
        self.assertEquals(response.data['submitter'], self.user.id)

        with open(filename) as cn_template:
            payload = {
                "partner": Partner.objects.last().id,
                "cn": cn_template,
            }
            response = self.client.post(url, data=payload, format='multipart')

        self.assertFalse(statuses.is_success(response.status_code))
        expected_msgs = ['The fields eoi, partner must make a unique set.']
        self.assertEquals(response.data['non_field_errors'], expected_msgs)

        url = reverse('projects:agency-applications', kwargs={"pk": eoi_id})
        payload = {
            "partner": Partner.objects.last().id,
            "ds_justification_select": JUSTIFICATION_FOR_DIRECT_SELECTION.known,
            "justification_reason": "a good reason",
        }
        response = self.client.post(url, data=payload, format='json')

        expected_msgs = 'You do not have permission to perform this action.'
        self.assertEquals(response.data['detail'], expected_msgs)


class TestAgencyApplicationsAPITestCase(BaseAPITestCase):

    quantity = 1
    user_type = 'agency'
    user_role = MEMBER_ROLES.editor

    def setUp(self):
        super(TestAgencyApplicationsAPITestCase, self).setUp()
        EOIFactory.create_batch(self.quantity)
        PartnerSimpleFactory.create_batch(1)

    def test_create(self):
        eoi_id = EOI.objects.first().id
        url = reverse('projects:agency-applications', kwargs={"pk": eoi_id})

        payload = {
            "partner": Partner.objects.last().id,
            "ds_justification_select": JUSTIFICATION_FOR_DIRECT_SELECTION.known,
            "justification_reason": "a good reason",
        }
        response = self.client.post(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['id'], Application.objects.last().id)


class TestApplicationsAPITestCase(BaseAPITestCase):

    quantity = 1

    def setUp(self):
        super(TestApplicationsAPITestCase, self).setUp()
        AgencyMemberFactory.create_batch(self.quantity)
        EOIFactory.create_batch(self.quantity)

    def test_read_update(self):
        url = reverse('projects:applications', kwargs={"pk": Application.objects.first().id})
        response = self.client.get(url, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['id'], Application.objects.first().id)
        self.assertFalse(response.data['did_win'])
        self.assertEquals(response.data['ds_justification_select'], None)

        payload = {
            "status": APPLICATION_STATUSES.preselected,
            "ds_justification_select": JUSTIFICATION_FOR_DIRECT_SELECTION.local,
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['status'], APPLICATION_STATUSES.preselected)
        self.assertEquals(response.data['ds_justification_select'], JUSTIFICATION_FOR_DIRECT_SELECTION.local)

        payload = {
            "did_win": True,
            "status": APPLICATION_STATUSES.rejected,
            "justification_reason": "good reason",
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertTrue(response.data['did_win'])
        self.assertEquals(response.data['status'], APPLICATION_STATUSES.rejected)

        # accept offer
        payload = {
            "did_accept": True,
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertTrue(response.data['did_accept'])

        # withdraw
        reason = "They are better then You."
        payload = {
            "did_win": False,
            "justification_reason": reason,
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertFalse(response.data['did_win'])
        self.assertEquals(response.data["justification_reason"], reason)

# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import random
from datetime import date, timedelta
import mock
from dateutil.relativedelta import relativedelta
from django.test import override_settings

from django.urls import reverse
from django.conf import settings
from django.core import mail
from rest_framework import status as statuses

from account.models import User
from agency.models import AgencyOffice, Agency
from notification.consts import NotificationType, NOTIFICATION_DATA
from partner.serializers import PartnerShortSerializer
from project.models import Assessment, Application, EOI, Pin
from partner.models import Partner
from common.tests.base import BaseAPITestCase
from common.factories import (
    EOIFactory,
    AgencyMemberFactory,
    PartnerSimpleFactory,
    PartnerMemberFactory,
    AgencyOfficeFactory,
    AgencyFactory,
    PartnerVerificationFactory,
)
from common.models import Specialization, CommonFile
from common.consts import (
    SELECTION_CRITERIA_CHOICES,
    JUSTIFICATION_FOR_DIRECT_SELECTION,
    MEMBER_ROLES,
    APPLICATION_STATUSES,
    COMPLETED_REASON,
    EOI_TYPES,
    EOI_STATUSES,
)
from project.views import PinProjectAPIView
from project.serializers import ConvertUnsolicitedSerializer

filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.csv')


def partner_has_finished(*args, **kwargs):
    return True


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
        AgencyOfficeFactory.create_batch(self.quantity)
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
    user_type = 'agency'

    def setUp(self):
        super(TestOpenProjectsAPITestCase, self).setUp()
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        PartnerMemberFactory.create_batch(self.quantity)
        EOIFactory.create_batch(self.quantity)

    def test_open_project(self):
        # read open projects
        response = self.client.get(self.url, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['count'], self.quantity)

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_create_patch_project(self):
        ao = AgencyOffice.objects.first()
        payload = {
            'title': "EOI title",
            'agency': ao.agency.id,
            'focal_points': [User.objects.first().id],
            'locations': [
                {
                    "admin_level_1": {"name": "Baghdad", "country_code": 'IQ'},
                    "lat": random.randint(-180, 180),
                    "lon": random.randint(-180, 180),
                },
                {
                    "admin_level_1": {"name": "Paris", "country_code": "FR"},
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
            'assessments_criteria': [
                {'selection_criteria': SELECTION_CRITERIA_CHOICES.sector, 'weight': 10},
                {'selection_criteria': SELECTION_CRITERIA_CHOICES.local, 'weight': 40},
            ],
        }

        response = self.client.post(self.url, data=payload, format='json')
        self.assertTrue(statuses.is_client_error(response.status_code))
        self.assertEquals(response.data['assessments_criteria'],
                          ['The sum of all weight criteria must be equal to 100.'])

        payload['assessments_criteria'].extend([
            {'selection_criteria': SELECTION_CRITERIA_CHOICES.cost, 'weight': 20},
            {'selection_criteria': SELECTION_CRITERIA_CHOICES.innovative, 'weight': 30},
        ])
        response = self.client.post(self.url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        eoi = EOI.objects.last()
        self.assertEquals(response.data['title'], payload['title'])
        self.assertEquals(eoi.created_by.id, self.user.id)
        self.assertEquals(response.data['id'], eoi.id)
        self.assertTrue(eoi.is_weight_adjustments_ok, 'The sum of all weight criteria must be equal to 100.')

        # invite partners
        url = reverse('projects:eoi-detail', kwargs={"pk": eoi.id})
        payload = {
            "invited_partners": PartnerShortSerializer([
                Partner.objects.first(), Partner.objects.last()
            ], many=True).data
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code), msg=response.content)
        self.assertEquals(response.data['id'], eoi.id)
        self.assertTrue(Partner.objects.first().id in [p['id'] for p in response.data['invited_partners']])
        self.assertTrue(Partner.objects.count(), len(response.data['invited_partners']))

        self.assertTrue(len(mail.outbox) >= 1)
        self.assertIn(NOTIFICATION_DATA[NotificationType.CFEI_INVITE]['subject'], [m.subject for m in mail.outbox])
        self.assertTrue(any([eoi.get_absolute_url() in m.body for m in mail.outbox]))
        payload = {
            "invited_partners": PartnerShortSerializer([Partner.objects.last()], many=True).data
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['id'], eoi.id)
        self.assertTrue(Partner.objects.last().id in [p['id'] for p in response.data['invited_partners']])
        self.assertTrue(Partner.objects.count(), 1)
        self.assertTrue(len(response.data['invited_partners']), 1)
        self.assertTrue(len(mail.outbox) > 0)  # mail.outbox is in shared resource, can have also other mails
        mail.outbox = []

        # edit EOI - dates & focal point(s)
        payload = {
            "start_date": date.today() - timedelta(days=10),
            "end_date": date.today() + timedelta(days=20),
            "deadline_date": date.today() + timedelta(days=10),
            "notif_results_date": date.today() + timedelta(days=15),
            "focal_points": [
                User.objects.filter(is_superuser=False, agency_members__isnull=False).first().id,
            ]
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['notif_results_date'], str(date.today() + timedelta(days=15)))

        # complete this CFEI
        justification = "mission completed"
        payload = {
            "justification": justification,
            "completed_reason": COMPLETED_REASON.canceled,
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['completed_reason'], COMPLETED_REASON.canceled)
        self.assertTrue(response.data['completed_date'])
        self.assertTrue(response.data['is_completed'])
        self.assertEquals(response.data['justification'], justification)


class TestDirectProjectsAPITestCase(BaseAPITestCase):

    quantity = 2
    url = reverse('projects:direct')
    user_type = 'agency'

    def setUp(self):
        super(TestDirectProjectsAPITestCase, self).setUp()
        PartnerSimpleFactory.create_batch(1)
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        EOIFactory.create_batch(self.quantity)

    def test_create_direct_project(self):
        ao = AgencyOffice.objects.first()
        payload = {
            'eoi': {
                'title': "EOI title",
                'agency': ao.agency.id,
                'focal_points': [User.objects.first().id],
                'locations': [
                    {
                        "admin_level_1": {"name": "Baghdad", "country_code": 'IQ'},
                        "lat": random.randint(-180, 180),
                        "lon": random.randint(-180, 180),
                    },
                    {
                        "admin_level_1": {"name": "Paris", "country_code": "FR"},
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
                    "ds_justification_select": [
                        JUSTIFICATION_FOR_DIRECT_SELECTION.known,
                        JUSTIFICATION_FOR_DIRECT_SELECTION.local,
                    ],
                    "justification_reason": "To save those we love."
                },
                {
                    "partner": Partner.objects.last().id,
                    "ds_justification_select": [
                        JUSTIFICATION_FOR_DIRECT_SELECTION.known,
                        JUSTIFICATION_FOR_DIRECT_SELECTION.local,
                    ],
                    "justification_reason": "To save those we love."
                }
            ]
        }

        response = self.client.post(self.url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['eoi']['title'], payload['eoi']['title'])
        self.assertEquals(response.data['eoi']['created_by'], self.user.id)
        self.assertEquals(response.data['eoi']['display_type'], EOI_TYPES.direct)
        self.assertEquals(response.data['eoi']['id'], EOI.objects.last().id)
        app = Application.objects.get(pk=response.data['applications'][0]['id'])
        self.assertEquals(app.submitter, self.user)
        self.assertEquals(app.ds_justification_select,
                          [JUSTIFICATION_FOR_DIRECT_SELECTION.known, JUSTIFICATION_FOR_DIRECT_SELECTION.local])
        app = Application.objects.get(pk=response.data['applications'][1]['id'])
        self.assertEquals(app.submitter, self.user)
        self.assertEquals(app.ds_justification_select,
                          [JUSTIFICATION_FOR_DIRECT_SELECTION.known, JUSTIFICATION_FOR_DIRECT_SELECTION.local])


class TestPartnerApplicationsAPITestCase(BaseAPITestCase):

    quantity = 1

    def setUp(self):
        super(TestPartnerApplicationsAPITestCase, self).setUp()
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        EOIFactory.create_batch(self.quantity, display_type='NoN')
        PartnerSimpleFactory.create_batch(self.quantity)

    @mock.patch('partner.models.Partner.has_finished', partner_has_finished)
    def test_create(self):
        eoi_id = EOI.objects.first().id
        cfile = CommonFile.objects.create()
        cfile.file_field.save('test.csv', open(filename))
        url = reverse('projects:partner-applications', kwargs={"pk": eoi_id})
        payload = {
            "cn": cfile.id,
        }
        response = self.client.post(url, data=payload, headers={'Partner-ID': Partner.objects.last()}, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        app_id = Application.objects.last().id
        self.assertEquals(response.data['id'], app_id)
        self.assertEquals(response.data['eoi'], eoi_id)
        self.assertEquals(response.data['submitter']['id'], self.user.id)
        cfile = CommonFile.objects.create()
        cfile.file_field.save('test.csv', open(filename))

        payload = {
            "cn": cfile.id,
        }
        response = self.client.post(url, data=payload, format='json')
        self.assertFalse(statuses.is_success(response.status_code))
        expected_msgs = ['The fields eoi, partner must make a unique set.']
        self.assertEquals(response.data['non_field_errors'], expected_msgs)

        url = reverse('projects:agency-applications', kwargs={"pk": eoi_id})
        payload = {
            "partner": Partner.objects.last().id,
            "ds_justification_select": [JUSTIFICATION_FOR_DIRECT_SELECTION.known],
            "justification_reason": "a good reason",
        }
        response = self.client.post(url, data=payload, format='json')

        expected_msgs = 'You do not have permission to perform this action.'
        self.assertEquals(response.data['detail'], expected_msgs)

        url = reverse('projects:partner-application-delete', kwargs={"pk": app_id})
        response = self.client.delete(url, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        Application.objects.filter(pk=app_id)


class TestAgencyApplicationsAPITestCase(BaseAPITestCase):

    quantity = 1
    user_type = 'agency'
    user_role = MEMBER_ROLES.editor

    def setUp(self):
        super(TestAgencyApplicationsAPITestCase, self).setUp()
        AgencyOfficeFactory.create_batch(self.quantity)
        PartnerSimpleFactory.create_batch(self.quantity)
        # status='NoN' - will not create applications
        EOIFactory.create_batch(self.quantity, display_type='NoN')

    @mock.patch('partner.models.Partner.has_finished', partner_has_finished)
    def test_create(self):
        eoi = EOI.objects.first()
        eoi.focal_points.add(self.user)
        url = reverse('projects:agency-applications', kwargs={"pk": eoi.id})

        payload = {
            "partner": Partner.objects.last().id,
            "ds_justification_select": [JUSTIFICATION_FOR_DIRECT_SELECTION.known],
            "justification_reason": "a good reason",
        }
        response = self.client.post(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        app_id = Application.objects.last().id
        self.assertEquals(response.data['id'], app_id)

        # agent member should delete only direct application
        eoi.display_type = EOI_TYPES.direct
        eoi.save()
        url = reverse('projects:agency-applications-delete', kwargs={"pk": app_id, "eoi_id": eoi.id})
        response = self.client.delete(url, format='json')
        self.assertTrue(statuses.is_success(response.status_code), "Application should be destroyed.")


class TestApplicationsAPITestCase(BaseAPITestCase):

    def setUp(self):
        super(TestApplicationsAPITestCase, self).setUp()
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        EOIFactory.create_batch(self.quantity)

    def test_read_update(self):
        app = Application.objects.first()
        url = reverse('projects:application', kwargs={"pk": app.id})
        response = self.client.get(url, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['id'], Application.objects.first().id)
        self.assertFalse(response.data['did_win'])
        self.assertEquals(response.data['ds_justification_select'], [])

        payload = {
            "status": APPLICATION_STATUSES.preselected,
            "ds_justification_select": [JUSTIFICATION_FOR_DIRECT_SELECTION.local],
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_client_error(response.status_code))
        self.assertEquals(response.data['non_field_errors'],
                          ['Only Focal Point/Creator is allowed to pre-select/reject an application.'])

        self.client.logout()
        self.client.login(email=app.eoi.created_by.email, password='test')

        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['status'], APPLICATION_STATUSES.preselected)
        self.assertEquals(response.data['ds_justification_select'], [JUSTIFICATION_FOR_DIRECT_SELECTION.local])

        payload = {
            "did_win": True,
            "status": APPLICATION_STATUSES.preselected,
            "justification_reason": "good reason",
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertEquals(response.data['non_field_errors'],
                          ['You can not award an application if the profile has not been verified yet.'])

        PartnerVerificationFactory(partner=app.partner, submitter=app.eoi.created_by)

        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertTrue(response.data['did_win'])
        self.assertEquals(response.data['status'], APPLICATION_STATUSES.preselected)
        self.assertTrue(len(mail.outbox) > 0)
        mail.outbox = []

        # accept offer
        payload = {
            "did_accept": True,
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertTrue(response.data['did_accept'])
        self.assertEquals(response.data['decision_date'], str(date.today()))

        # decline offer
        payload = {
            "did_accept": False,
            "did_decline": True,
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertFalse(response.data['did_accept'])
        self.assertTrue(response.data['did_decline'])

        # withdraw
        reason = "They are better then You."
        payload = {
            "did_withdraw": True,
            "withdraw_reason": reason,
            "status": APPLICATION_STATUSES.rejected,
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_client_error(response.status_code))
        self.assertEquals(response.data["non_field_errors"],
                          ["Since assessment has begun, application can't be reject."])

        app.assessments.all().delete()
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertTrue(response.data['did_win'])
        self.assertTrue(response.data['did_withdraw'])
        self.assertEquals(response.data["withdraw_reason"], reason)


class TestReviewerAssessmentsAPIView(BaseAPITestCase):

    user_type = 'agency'
    user_role = MEMBER_ROLES.editor

    initial_factories = [
        PartnerSimpleFactory,
        PartnerMemberFactory,
        AgencyFactory,
        AgencyOfficeFactory,
        AgencyMemberFactory,
        EOIFactory,
    ]

    def test_add_review(self):
        app = Application.objects.first()
        url = reverse(
            'projects:reviewer-assessments',
            kwargs={
                "application_id": app.id,
                "reviewer_id": self.user.id,
            }
        )
        note = 'I like this application, has strong sides...'
        payload = {
            'scores': [
                {'selection_criteria': SELECTION_CRITERIA_CHOICES.sector, 'score': 50},
                {'selection_criteria': SELECTION_CRITERIA_CHOICES.local, 'score': 75},
                {'selection_criteria': SELECTION_CRITERIA_CHOICES.cost, 'score': 60},
                {'selection_criteria': SELECTION_CRITERIA_CHOICES.innovative, 'score': 90},
            ],
            'note': note,
        }
        response = self.client.post(url, data=payload, format='json')
        self.assertFalse(statuses.is_success(response.status_code))
        self.assertEquals(response.status_code, statuses.HTTP_403_FORBIDDEN)

        # add logged agency member to eoi/application reviewers
        app.eoi.reviewers.add(self.user)

        response = self.client.post(url, data=payload, format='json')
        self.assertTrue(statuses.is_client_error(response.status_code))
        self.assertEquals(response.data['non_field_errors'], ['Assessment allowed once deadline is passed.'])
        app.eoi.deadline_date = date.today() - timedelta(days=1)
        app.eoi.save()

        response = self.client.post(url, data=payload, format='json')
        self.assertTrue(statuses.is_client_error(response.status_code),
                        'You can score only selection criteria defined in CFEI.')
        self.assertEquals(response.data['non_field_errors'],
                          ["You can score only selection criteria defined in CFEI."])

        scores = []
        for criterion in app.eoi.assessments_criteria:
            scores.append({
                'selection_criteria': criterion.get('selection_criteria'), 'score': 100
            })
        payload['scores'] = scores
        response = self.client.post(url, data=payload, format='json')
        self.assertTrue(statuses.is_client_error(response.status_code))
        self.assertEquals(response.data['non_field_errors'],
                          ["The maximum score is equal to the value entered for the weight."])

        scores = []
        for criterion in app.eoi.assessments_criteria:
            scores.append({
                'selection_criteria': criterion.get('selection_criteria'), 'score': criterion.get('weight') - 1
            })
        payload['scores'] = scores
        response = self.client.post(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['date_reviewed'], str(date.today()))
        self.assertEquals(response.data['reviewer'], self.user.id)
        self.assertEquals(len(response.data['scores']), len(payload['scores']))
        assessment_id = Assessment.objects.last().id
        self.assertEquals(response.data['id'], assessment_id)

        url = reverse(
            'projects:reviewer-assessments',
            kwargs={
                "application_id": Application.objects.first().id,
                "reviewer_id": self.user.id,
            }
        )
        payload = {
            'note': 'patch note test',
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertEquals(response.data['note'], payload['note'])
        self.assertEquals(response.data['id'], assessment_id)
        self.assertEquals(Assessment.objects.last().note, payload['note'])

        scores = []
        for criterion in app.eoi.assessments_criteria:
            scores.append({
                'selection_criteria': criterion.get('selection_criteria'), 'score': criterion.get('weight') - 3
            })
        payload = {
            'scores': scores,
            'note': note,
        }
        response = self.client.put(url, data=payload, format='json')
        self.assertEquals(response.data['note'], payload['note'])
        self.assertEquals(response.data['scores'], payload['scores'])


class TestCreateUnsolicitedProjectAPITestCase(BaseAPITestCase):

    def test_create_convert(self):
        url = reverse('projects:applications-unsolicited')
        filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.csv')
        partner_id = Partner.objects.first().id

        cfile = CommonFile.objects.create()
        cfile.file_field.save('test.csv', open(filename))

        payload = {
            "locations": [
                {
                    "admin_level_1": {"country_code": 'IQ', "name": "Baghdad"},
                    "lat": random.randint(-180, 180),
                    "lon": random.randint(-180, 180),
                },
                {
                    "admin_level_1": {"country_code": "FR", "name": "Paris"},
                    "lat": random.randint(-180, 180),
                    "lon": random.randint(-180, 180),
                },
            ],
            "title": "Unsolicited Project",
            "agency": Agency.objects.first().id,
            "specializations": Specialization.objects.all()[:3].values_list("id", flat=True),
            "cn": cfile.id,
        }
        response = self.client.post(url, data=payload, format='json', header={'Partner-ID': partner_id})
        self.assertTrue(statuses.is_success(response.status_code))
        app = Application.objects.last()
        self.assertEquals(response.data['id'], str(app.id))
        self.assertEquals(app.cn.id, cfile.id)
        self.assertEquals(app.proposal_of_eoi_details['title'], payload['title'])

        for idx, item in enumerate(app.proposal_of_eoi_details['specializations']):
            self.assertEquals(
                str(app.proposal_of_eoi_details['specializations'][idx]),
                str(payload['specializations'][idx])
            )
        self.client.logout()

        # create agency members for focal_points and agency member to convert
        AgencyMemberFactory.create_batch(4)

        user = User.objects.filter(agency_members__isnull=False).first()
        self.client.login(email=user.email, password='test')

        url = reverse('projects:convert-unsolicited', kwargs={'pk': response.data['id']})
        start_date = date.today()
        end_date = date.today() + timedelta(days=30)
        focal_points = [x for x in User.objects.filter(agency_members__isnull=False).values("id")[1:]]
        payload = {
            'ds_justification_select': [JUSTIFICATION_FOR_DIRECT_SELECTION.other],
            'justification': 'Explain justification for creating direct selection',
            'focal_points': focal_points,
            'description': 'Provide brief background of the project',
            'other_information': '',
            'start_date': str(start_date),
            'end_date': str(end_date),
        }
        response = self.client.post(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        eoi = EOI.objects.last()
        self.assertEquals(EOI.objects.count(), 1)
        self.assertEquals(eoi.other_information, payload['other_information'])
        self.assertEquals(eoi.description, payload['description'])
        self.assertEquals(eoi.start_date, start_date)
        self.assertEquals(eoi.end_date, end_date)
        self.assertEquals(eoi.display_type, EOI_TYPES.direct)
        self.assertEquals(eoi.status, EOI_STATUSES.open)
        self.assertEquals(eoi.focal_points.all().count(), len(focal_points))
        self.assertEquals(eoi.created_by, user)
        self.assertEquals(Application.objects.count(), 2)

        # try to convert again
        response = self.client.post(url, data=payload, format='json')
        self.assertFalse(statuses.is_success(response.status_code))
        self.assertEquals(response.data['non_field_errors'], [ConvertUnsolicitedSerializer.RESTRICTION_MSG])


class TestReviewSummaryAPIViewAPITestCase(BaseAPITestCase):

    user_type = 'agency'

    def test_add_review(self):
        url = reverse('common:file')
        filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.csv')
        with open(filename) as doc:
            payload = {
                "file_field": doc
            }
            response = self.client.post(url, data=payload, format='multipart')

        self.assertTrue(statuses.is_success(response.status_code))
        self.assertTrue(response.data['id'] is not None)
        file_id = response.data['id']

        PartnerMemberFactory()  # eoi is creating applications that need partner member
        EOIFactory(created_by=self.user)
        eoi = EOI.objects.first()
        url = reverse('projects:review-summary', kwargs={"pk": eoi.id})
        payload = {
            'review_summary_comment': "comment",
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['review_summary_comment'], payload['review_summary_comment'])

        payload = {
            'review_summary_comment': "comment",
            'review_summary_attachment': file_id
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['review_summary_comment'], payload['review_summary_comment'])
        self.assertTrue(
            response.data['review_summary_attachment'].find(CommonFile.objects.get(pk=file_id).file_field.url) > 0
        )


class TestInvitedPartnersListAPIView(BaseAPITestCase):

    user_type = 'agency'
    quantity = 1

    def setUp(self):
        super(TestInvitedPartnersListAPIView, self).setUp()
        PartnerSimpleFactory.create_batch(1)
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        EOIFactory.create_batch(self.quantity)

    def test_serializes_same_fields_on_get_and_patch(self):
        eoi = EOI.objects.first()
        self.client.force_login(eoi.created_by)
        url = reverse('projects:eoi-detail', kwargs={"pk": eoi.id})
        read_response = self.client.get(url, format='json')
        self.assertEqual(read_response.status_code, statuses.HTTP_200_OK)

        update_response = self.client.patch(url, {
            'title': 'Another title'
        })
        self.assertEqual(update_response.status_code, statuses.HTTP_200_OK)
        self.assertEqual(set(read_response.data.keys()), set(update_response.data.keys()))


class TestEOIReviewersAssessmentsNotifyAPIView(BaseAPITestCase):

    user_type = 'agency'
    quantity = 1

    def setUp(self):
        super(TestEOIReviewersAssessmentsNotifyAPIView, self).setUp()
        PartnerSimpleFactory.create_batch(1)
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        EOIFactory.create_batch(self.quantity)

    def test_send_notification(self):
        eoi = EOI.objects.first()

        url = reverse('projects:eoi-reviewers-assessments-notify', kwargs={
            "eoi_id": eoi.id, "reviewer_id": self.user.id
        })
        create_notification_response = self.client.post(url, format='json')
        self.assertEqual(
            create_notification_response.status_code, statuses.HTTP_201_CREATED,
            msg=create_notification_response.content
        )

        notifications_response = self.client.get('/api/notifications/', format='json')
        self.assertEqual(notifications_response.status_code, statuses.HTTP_200_OK)
        self.assertEqual(notifications_response.data['count'], 1)
        self.assertEqual(
            notifications_response.data['results'][0]['notification']['source'], NotificationType.CFEI_REVIEW_REQUIRED
        )

        create_notification_response = self.client.post(url, format='json')
        self.assertEqual(create_notification_response.status_code, statuses.HTTP_200_OK)
        self.assertIn('wait', create_notification_response.content)

        with mock.patch('notification.helpers.timezone.now') as mock_now:
            mock_now.return_value = eoi.created + relativedelta(hours=25)
            create_notification_response = self.client.post(url, format='json')
            self.assertEqual(create_notification_response.status_code, statuses.HTTP_201_CREATED)

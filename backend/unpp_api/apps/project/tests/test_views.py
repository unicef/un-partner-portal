# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import random
from datetime import date, timedelta
import mock
from dateutil.relativedelta import relativedelta
from django.core.management import call_command
from django.test import override_settings

from django.urls import reverse
from django.conf import settings
from django.core import mail
from rest_framework import status

from account.models import User
from agency.models import Agency
from agency.roles import VALID_FOCAL_POINT_ROLE_NAMES, AgencyRole
from common.headers import CustomHeader
from notification.consts import NotificationType, NOTIFICATION_DATA
from partner.roles import PartnerRole
from partner.serializers import PartnerShortSerializer
from project.models import Assessment, Application, EOI, Pin
from partner.models import Partner
from common.tests.base import BaseAPITestCase
from common.factories import (
    OpenEOIFactory,
    AgencyMemberFactory,
    PartnerSimpleFactory,
    PartnerMemberFactory,
    AgencyOfficeFactory,
    AgencyFactory,
    PartnerVerificationFactory,
    UserFactory,
    PartnerFactory,
    get_new_common_file,
    DirectEOIFactory)
from common.models import Specialization, CommonFile
from common.consts import (
    SELECTION_CRITERIA_CHOICES,
    JUSTIFICATION_FOR_DIRECT_SELECTION,
    APPLICATION_STATUSES,
    COMPLETED_REASON,
    CFEI_TYPES,
    CFEI_STATUSES,
    EXTENDED_APPLICATION_STATUSES,
)
from project.views import PinProjectAPIView
from project.serializers import ConvertUnsolicitedSerializer

filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.doc')


def partner_has_finished(*args, **kwargs):
    return True


class TestPinUnpinWrongEOIAPITestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_PARTNER

    def test_pin_unpin_project_wrong_eois(self):
        url = reverse('projects:pins')
        response = self.client.patch(url, data={"eoi_ids": [1, 2, 3], "pin": True})

        self.assertResponseStatusIs(response, status_code=status.HTTP_400_BAD_REQUEST)
        self.assertEquals(response.data['non_field_errors'], PinProjectAPIView.ERROR_MSG_WRONG_EOI_PKS)
        self.assertEquals(Pin.objects.count(), 0)


class TestPinUnpinEOIAPITestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_PARTNER
    quantity = 2
    url = reverse('projects:pins')

    def setUp(self):
        super(TestPinUnpinEOIAPITestCase, self).setUp()
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        OpenEOIFactory.create_batch(self.quantity, is_published=True)

    def test_pin_unpin_project_wrong_params(self):
        eoi_ids = EOI.objects.all().values_list('id', flat=True)
        response = self.client.patch(self.url, data={"eoi_ids": eoi_ids, "pin": None})

        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)
        self.assertEquals(response.data['non_field_errors'], PinProjectAPIView.ERROR_MSG_WRONG_PARAMS)
        self.assertEquals(Pin.objects.count(), 0)

    def test_pin_unpin_project(self):
        # add pins
        eoi_ids = EOI.objects.all().values_list('id', flat=True)
        response = self.client.patch(self.url, data={"eoi_ids": eoi_ids, "pin": True})

        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
        self.assertEquals(Pin.objects.count(), self.quantity)
        self.assertEquals(response.data["eoi_ids"], list(eoi_ids))

        # read pins
        response = self.client.get(self.url)
        self.assertResponseStatusIs(response)
        self.assertEquals(response.data['count'], self.quantity)

        # delete pins
        response = self.client.patch(self.url, data={"eoi_ids": eoi_ids, "pin": False})
        self.assertResponseStatusIs(response, status_code=status.HTTP_204_NO_CONTENT)
        self.assertEquals(Pin.objects.count(), 0)


class TestOpenProjectsAPITestCase(BaseAPITestCase):

    quantity = 2
    url = reverse('projects:open')
    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    def setUp(self):
        super(TestOpenProjectsAPITestCase, self).setUp()
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        PartnerMemberFactory.create_batch(self.quantity)
        OpenEOIFactory.create_batch(self.quantity, agency=self.user.agency)

    def test_open_project(self):
        # read open projects
        response = self.client.get(self.url)
        self.assertResponseStatusIs(response)
        self.assertEquals(response.data['count'], self.quantity)

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_create_patch_project(self):
        ao = self.user.agency_members.first().office
        payload = {
            'title': "EOI title",
            'agency': ao.agency.id,
            'focal_points': [
                AgencyMemberFactory(role=list(VALID_FOCAL_POINT_ROLE_NAMES)[0], office=ao).user.id
            ],
            'locations': [
                {
                    "admin_level_1": {"name": "Baghdad", "country_code": 'IQ'},
                    "lat": random.randint(-90, 90),
                    "lon": random.randint(-180, 180),
                },
                {
                    "admin_level_1": {"name": "Paris", "country_code": "FR"},
                    "lat": random.randint(-90, 90),
                    "lon": random.randint(-180, 180),
                },
            ],
            'agency_office': ao.id,
            'specializations': Specialization.objects.all().values_list('id', flat=True)[:2],
            'description': 'Brief background of the project',
            'other_information': 'Other information',
            "clarification_request_deadline_date": date.today(),
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

        response = self.client.post(self.url, data=payload)
        self.assertResponseStatusIs(response, status_code=status.HTTP_400_BAD_REQUEST)
        self.assertEquals(
            response.data['assessments_criteria'],
            ['The sum of all weight criteria must be equal to 100.']
        )

        payload['assessments_criteria'].extend([
            {'selection_criteria': SELECTION_CRITERIA_CHOICES.cost, 'weight': 20},
            {'selection_criteria': SELECTION_CRITERIA_CHOICES.innovative, 'weight': 30},
        ])
        response = self.client.post(self.url, data=payload)
        self.assertResponseStatusIs(response, status_code=status.HTTP_201_CREATED)
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
        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response)
        self.assertEquals(response.data['id'], eoi.id)
        self.assertTrue(Partner.objects.first().id in [p['id'] for p in response.data['invited_partners']])
        self.assertTrue(Partner.objects.count(), len(response.data['invited_partners']))

        call_command('send_daily_notifications')
        notification_emails = list(filter(
            lambda msg: eoi.get_absolute_url() in msg.body,
            mail.outbox
        ))

        self.assertTrue(len(notification_emails) >= 1)

        payload = {
            "invited_partners": PartnerShortSerializer([Partner.objects.last()], many=True).data
        }
        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response)
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
                AgencyMemberFactory(role=list(VALID_FOCAL_POINT_ROLE_NAMES)[0], office=ao).user.id,
            ]
        }
        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response)
        self.assertEquals(response.data['notif_results_date'], str(date.today() + timedelta(days=15)))

        # complete this CFEI
        justification = "mission completed"
        payload = {
            "justification": justification,
            "completed_reason": COMPLETED_REASON.cancelled,
        }
        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response)
        self.assertEquals(response.data['completed_reason'], COMPLETED_REASON.cancelled)
        self.assertTrue(response.data['completed_date'])
        self.assertTrue(response.data['is_completed'])
        self.assertEquals(response.data['justification'], justification)

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_patch_locations_for_project(self):
        cfei = OpenEOIFactory(created_by=self.user)
        details_url = reverse('projects:eoi-detail', kwargs={'pk': cfei.id})
        details_response = self.client.get(details_url)
        self.assertResponseStatusIs(details_response)
        initial_locations = details_response.data['locations']
        new_locations_payload = {
            'locations': [
                {
                    "admin_level_1": {"name": "Baghdad", "country_code": 'IQ'},
                    "lat": random.randint(-90, 90),
                    "lon": random.randint(-180, 180),
                },
                {
                    "admin_level_1": {"name": "Paris", "country_code": "FR"},
                    "lat": random.randint(-90, 90),
                    "lon": random.randint(-180, 180),
                },
            ],
        }
        update_response = self.client.patch(details_url, data=new_locations_payload)
        self.assertResponseStatusIs(update_response)
        self.assertEqual(
            len(new_locations_payload['locations']),
            len(update_response.data['locations'])
        )

        second_update_payload = {
            'locations': [
                {
                    "admin_level_1": {"name": "Poland", "country_code": 'PL'},
                    "lat": random.randint(-90, 90),
                    "lon": random.randint(-180, 180),
                },
            ] + initial_locations,
        }

        second_update_response = self.client.patch(details_url, data=second_update_payload)
        self.assertResponseStatusIs(second_update_response)

        self.assertEqual(
            len(second_update_payload['locations']),
            len(second_update_response.data['locations'])
        )

        self.assertTrue(
            {l['id'] for l in initial_locations}.issubset(
                {l['id'] for l in second_update_response.data['locations']}
            )
        )

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_patch_specializations_for_project(self):
        cfei = OpenEOIFactory(created_by=self.user)
        details_url = reverse('projects:eoi-detail', kwargs={'pk': cfei.id})
        details_response = self.client.get(details_url)
        self.assertResponseStatusIs(details_response)

        for _ in range(10):
            spec_count = random.randint(2, 7)
            update_payload = {
                'specializations': Specialization.objects.order_by('?').values_list('id', flat=True)[:spec_count],
            }
            update_response = self.client.patch(details_url, data=update_payload)
            self.assertResponseStatusIs(update_response)
            self.assertEqual(len(update_response.data['specializations']), spec_count)


class TestDirectProjectsAPITestCase(BaseAPITestCase):

    quantity = 2
    url = reverse('projects:direct')
    user_type = 'agency'
    agency_role = AgencyRole.EDITOR_ADVANCED

    def setUp(self):
        super(TestDirectProjectsAPITestCase, self).setUp()
        PartnerSimpleFactory()
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        OpenEOIFactory.create_batch(self.quantity)

    # TODO: This test is not deterministic - randomly fails
    def test_create_direct_project(self):
        ao = self.user.agency_members.first().office
        payload = {
            'eoi': {
                'title': "EOI title",
                'agency': ao.agency.id,
                'focal_points': [self.user.id],
                'locations': [
                    {
                        "admin_level_1": {"name": "Baghdad", "country_code": 'IQ'},
                        "lat": random.randint(-90, 90),
                        "lon": random.randint(-180, 180),
                    },
                    {
                        "admin_level_1": {"name": "Paris", "country_code": "FR"},
                        "lat": random.randint(-90, 90),
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
                    "partner": Partner.objects.last().id,
                    "ds_justification_select": [
                        JUSTIFICATION_FOR_DIRECT_SELECTION.known,
                        JUSTIFICATION_FOR_DIRECT_SELECTION.local,
                    ],
                    "ds_attachment": get_new_common_file().id,
                    "justification_reason": "To save those we love."
                },
            ]
        }

        response = self.client.post(self.url, data=payload)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.data)

        self.assertEquals(response.data['eoi']['title'], payload['eoi']['title'])
        self.assertEquals(response.data['eoi']['created_by'], self.user.id)
        self.assertEquals(response.data['eoi']['display_type'], CFEI_TYPES.direct)
        self.assertEquals(response.data['eoi']['id'], EOI.objects.last().id)
        app = Application.objects.get(pk=response.data['applications'][0]['id'])
        self.assertEquals(app.submitter, self.user)
        self.assertEquals(
            app.ds_justification_select,
            [JUSTIFICATION_FOR_DIRECT_SELECTION.known, JUSTIFICATION_FOR_DIRECT_SELECTION.local]
        )
        app = Application.objects.get(pk=response.data['applications'][0]['id'])
        self.assertEquals(app.submitter, self.user)
        self.assertEquals(
            app.ds_justification_select,
            [JUSTIFICATION_FOR_DIRECT_SELECTION.known, JUSTIFICATION_FOR_DIRECT_SELECTION.local]
        )
        self.assertIsNotNone(response.data['applications'][-1]['ds_attachment'])


class TestPartnerApplicationsAPITestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_PARTNER

    def setUp(self):
        super(TestPartnerApplicationsAPITestCase, self).setUp()
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        OpenEOIFactory.create_batch(self.quantity, display_type='NoN')
        PartnerSimpleFactory.create_batch(self.quantity)

    @mock.patch('partner.models.Partner.has_finished', partner_has_finished)
    def test_create(self):
        self.client.set_headers({
            CustomHeader.PARTNER_ID.value: self.user.partner_members.first().partner.id
        })

        eoi_id = EOI.objects.first().id
        url = reverse('projects:partner-applications', kwargs={"pk": eoi_id})
        payload = {
            "cn": get_new_common_file().id,
        }

        response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
        app = Application.objects.last()
        self.assertEquals(response.data['id'], app.id)
        self.assertEquals(app.submitter.id, self.user.id)
        common_file = CommonFile.objects.create()
        common_file.file_field.save('test.csv', open(filename))

        payload = {
            "cn": common_file.id,
        }
        response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)
        self.assertEquals(response.data[0], 'You already applied for this project.')

        url = reverse('projects:agency-applications', kwargs={"pk": eoi_id})
        payload = {
            "partner": Partner.objects.exclude(applications__eoi_id=eoi_id).order_by('?').last().id,
            "ds_justification_select": [JUSTIFICATION_FOR_DIRECT_SELECTION.known],
            "justification_reason": "a good reason",
        }
        response = self.client.post(url, data=payload)

        expected_msgs = 'You do not have permission to perform this action.'
        self.assertEquals(response.data['detail'], expected_msgs)


class TestAgencyApplicationsAPITestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    def setUp(self):
        super(TestAgencyApplicationsAPITestCase, self).setUp()
        AgencyMemberFactory.create_batch(self.quantity)
        PartnerSimpleFactory.create_batch(self.quantity)

    @mock.patch('partner.models.Partner.has_finished', partner_has_finished)
    def test_create(self):
        eoi = OpenEOIFactory(display_type='NoN', agency=self.user.agency)
        eoi.focal_points.add(self.user)
        url = reverse('projects:agency-applications', kwargs={"pk": eoi.id})

        partner = Partner.objects.last()
        PartnerVerificationFactory(partner=partner)
        payload = {
            "partner": partner.id,
            "ds_justification_select": [JUSTIFICATION_FOR_DIRECT_SELECTION.known],
            "justification_reason": "a good reason",
        }
        response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
        app_id = eoi.applications.last().id
        self.assertEqual(response.data['id'], app_id)

        eoi.display_type = CFEI_TYPES.direct
        eoi.save()
        url = reverse('projects:agency-applications-delete', kwargs={"pk": app_id, "eoi_id": eoi.id})
        response = self.client.delete(url)
        self.assertResponseStatusIs(response, status.HTTP_204_NO_CONTENT)


class TestApplicationsAPITestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    def setUp(self):
        super(TestApplicationsAPITestCase, self).setUp()
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)

        # make sure that creating user is not the current one
        creator = UserFactory()
        AgencyMemberFactory(user=creator, office=self.user.agency_members.first().office)
        self.eoi = OpenEOIFactory(is_published=True, created_by=creator, agency=self.user.agency)
        self.eoi.focal_points.clear()

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_read_update_application(self):
        application = self.eoi.applications.first()
        PartnerMemberFactory.create_batch(5, partner=application.partner)
        url = reverse('projects:application', kwargs={"pk": application.id})
        response = self.client.get(url)
        self.assertResponseStatusIs(response)
        self.assertFalse(response.data['did_win'])
        self.assertEquals(response.data['ds_justification_select'], [])

        payload = {
            "status": APPLICATION_STATUSES.preselected,
            "ds_justification_select": [JUSTIFICATION_FOR_DIRECT_SELECTION.local],
        }
        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)
        self.assertEquals(
            response.data['non_field_errors'],
            ['Only Focal Point/Creator is allowed to pre-select/reject an application.']
        )

        self.client.logout()
        creator = application.eoi.created_by
        self.client.force_login(creator)

        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_403_FORBIDDEN)
        creator.agency_members.update(role=AgencyRole.EDITOR_ADVANCED.name)
        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_200_OK)
        self.assertEquals(response.data['status'], APPLICATION_STATUSES.preselected)
        self.assertEquals(response.data['ds_justification_select'], [JUSTIFICATION_FOR_DIRECT_SELECTION.local])

        payload = {
            "did_win": True,
            "status": APPLICATION_STATUSES.preselected,
            "justification_reason": "good reason",
        }

        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)
        self.assertIn('review_summary_comment', response.data)
        application.eoi.review_summary_comment = 'Test comment'
        application.eoi.save()

        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)
        self.assertEquals(
            response.data['non_field_errors'],
            ['You cannot award an application if the profile has not been verified yet.']
        )

        PartnerVerificationFactory(partner=application.partner, submitter=application.eoi.created_by)

        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response)
        self.assertIn('application_status', response.data)
        self.assertTrue(response.data['did_win'])
        self.assertEquals(response.data['status'], APPLICATION_STATUSES.preselected)
        call_command('send_daily_notifications')
        self.assertTrue(len(mail.outbox) > 0)
        mail.outbox = []

        partner_user = UserFactory()
        PartnerMemberFactory(user=partner_user, partner=application.partner, role=PartnerRole.ADMIN.name)
        self.client.force_login(partner_user)
        # accept offer
        payload = {
            "did_accept": True,
        }
        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response)
        self.assertTrue(response.data['did_accept'])
        self.assertEquals(response.data['decision_date'], str(date.today()))
        self.client.force_login(application.eoi.created_by)

        awarded_partners_response = self.client.get(
            reverse('projects:applications-awarded-partners', kwargs={"eoi_id": application.id})
        )
        self.assertEqual(
            awarded_partners_response.status_code, status.HTTP_200_OK, msg=awarded_partners_response.content
        )

        if awarded_partners_response.data:
            self.assertEqual(awarded_partners_response.data[0]['partner_decision_date'], str(date.today()))
            self.assertEqual(awarded_partners_response.data[0]['partner_notified'].date(), date.today())

        self.client.force_login(partner_user)
        payload = {
            "did_accept": False,
            "did_decline": True,
        }
        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response)
        self.assertFalse(response.data['did_accept'])
        self.assertTrue(response.data['did_decline'])

        self.client.force_login(application.eoi.created_by)
        reason = "They are better then You."
        payload = {
            "did_withdraw": True,
            "withdraw_reason": reason,
            "status": APPLICATION_STATUSES.rejected,
        }
        response = self.client.patch(url, data=payload)
        self.assertTrue(status.is_client_error(response.status_code))
        self.assertEquals(
            response.data["non_field_errors"], ["Since assessment has begun, application can't be rejected."]
        )

        application.assessments.all().delete()
        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response)
        self.assertTrue(response.data['did_win'])
        self.assertTrue(response.data['did_withdraw'])
        self.assertEquals(response.data["withdraw_reason"], reason)


class TestReviewerAssessmentsAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    initial_factories = [
        PartnerSimpleFactory,
        PartnerMemberFactory,
        AgencyFactory,
        AgencyOfficeFactory,
        AgencyMemberFactory,
        OpenEOIFactory,
    ]

    def test_add_review(self):
        app = Application.objects.first()
        app.status = APPLICATION_STATUSES.preselected
        app.save()

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
        response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_403_FORBIDDEN)

        # add logged agency member to eoi/application reviewers
        app.eoi.reviewers.add(self.user)
        response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data['non_field_errors'],
            ['Assessment allowed once deadline is passed.']
        )
        app.eoi.deadline_date = date.today() - timedelta(days=1)
        app.eoi.is_published = True
        app.eoi.save()

        response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data['non_field_errors'], ["You can score only selection criteria defined in CFEI."]
        )

        scores = []
        for criterion in app.eoi.assessments_criteria:
            scores.append({
                'selection_criteria': criterion.get('selection_criteria'), 'score': 100
            })

        payload['scores'] = scores
        response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)
        self.assertEquals(
            response.data['non_field_errors'],
            ["The maximum score is equal to the value entered for the weight."]
        )

        scores = []
        for criterion in app.eoi.assessments_criteria:
            scores.append({
                'selection_criteria': criterion.get('selection_criteria'), 'score': criterion.get('weight') - 1
            })
        payload['scores'] = scores
        response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(response, status_code=status.HTTP_201_CREATED)
        self.assertEquals(response.data['date_reviewed'], str(date.today()))
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
        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response)
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
        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_200_OK)
        self.assertEquals(response.data['note'], payload['note'])
        self.assertEquals(response.data['scores'], payload['scores'])

        complete_assessments_url = reverse('projects:eoi-reviewers-complete-assessments', kwargs={"eoi_id": app.eoi.id})
        complete_response = self.client.post(complete_assessments_url)
        self.assertResponseStatusIs(complete_response)
        self.assertTrue(len(complete_response.data) > 0)
        self.assertTrue(all([a['completed'] for a in complete_response.data]))

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
        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)


class TestCreateUnsolicitedProjectAPITestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_PARTNER
    partner_role = PartnerRole.ADMIN

    def test_create_convert(self):
        url = reverse('projects:applications-unsolicited')
        filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.doc')

        cfile = CommonFile.objects.create()
        cfile.file_field.save('test.csv', open(filename))

        payload = {
            "locations": [
                {
                    "admin_level_1": {"country_code": 'IQ', "name": "Baghdad"},
                    "lat": random.randint(-90, 90),
                    "lon": random.randint(-180, 180),
                },
                {
                    "admin_level_1": {"country_code": "FR", "name": "Paris"},
                    "lat": random.randint(-90, 90),
                    "lon": random.randint(-180, 180),
                },
            ],
            "title": "Unsolicited Project",
            "agency": Agency.objects.first().id,
            "specializations": Specialization.objects.all()[:3].values_list("id", flat=True),
            "cn": cfile.id,
        }
        response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
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
        AgencyMemberFactory()

        self.user = User.objects.filter(agency_members__isnull=False).first()
        self.client.force_login(self.user)
        self.user_type = BaseAPITestCase.USER_AGENCY
        self.set_current_user_role(AgencyRole.EDITOR_ADVANCED.name)
        self.client.set_headers({
            CustomHeader.AGENCY_OFFICE_ID.value: self.user.agency_members.first().office_id
        })

        url = reverse('projects:convert-unsolicited', kwargs={'pk': response.data['id']})
        start_date = date.today()
        end_date = date.today() + timedelta(days=30)
        office = AgencyOfficeFactory(agency=app.agency)
        focal_points = [
            am.user.id for am in AgencyMemberFactory.create_batch(
                3, role=list(VALID_FOCAL_POINT_ROLE_NAMES)[0], office=office
            )
        ]

        payload = {
            'ds_justification_select': [JUSTIFICATION_FOR_DIRECT_SELECTION.other],
            'justification': 'Explain justification for creating direct selection',
            'focal_points': focal_points,
            'description': 'Provide brief background of the project',
            'other_information': '',
            'start_date': str(start_date),
            'end_date': str(end_date),
        }
        response = self.client.post(url, data=payload)

        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
        eoi = EOI.objects.last()
        self.assertEquals(EOI.objects.count(), 1)
        self.assertEquals(eoi.other_information, payload['other_information'])
        self.assertEquals(eoi.description, payload['description'])
        self.assertEquals(eoi.start_date, start_date)
        self.assertEquals(eoi.end_date, end_date)
        self.assertEquals(eoi.display_type, CFEI_TYPES.direct)
        self.assertEquals(eoi.status, CFEI_STATUSES.open)
        self.assertEquals(eoi.focal_points.all().count(), len(focal_points))
        self.assertEquals(eoi.created_by, self.user)
        self.assertEquals(Application.objects.count(), 2)

        # try to convert again
        response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(response, status_code=status.HTTP_400_BAD_REQUEST)
        self.assertEquals(response.data['non_field_errors'], [ConvertUnsolicitedSerializer.RESTRICTION_MSG])


class TestReviewSummaryAPIViewAPITestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    def test_add_review(self):
        url = reverse('common:file')
        filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.doc')
        with open(filename) as doc:
            payload = {
                "file_field": doc
            }
            response = self.client.post(url, data=payload, format='multipart')

        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data['id'])
        file_id = response.data['id']

        PartnerMemberFactory()  # eoi is creating applications that need partner member
        eoi = OpenEOIFactory(created_by=self.user)
        url = reverse('projects:review-summary', kwargs={"pk": eoi.id})
        payload = {
            'review_summary_comment': "comment",
        }
        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_200_OK)
        self.assertEquals(response.data['review_summary_comment'], payload['review_summary_comment'])

        payload = {
            'review_summary_comment': "comment",
            'review_summary_attachment': file_id
        }
        response = self.client.patch(url, data=payload)
        self.assertResponseStatusIs(response)
        self.assertEquals(response.data['review_summary_comment'], payload['review_summary_comment'])
        self.assertTrue(
            response.data['review_summary_attachment'].find(CommonFile.objects.get(pk=file_id).file_field.url) > 0
        )


class TestInvitedPartnersListAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY

    def test_serializes_same_fields_on_get_and_patch(self):
        eoi = OpenEOIFactory(created_by=self.user)
        url = reverse('projects:eoi-detail', kwargs={"pk": eoi.id})
        read_response = self.client.get(url)
        self.assertResponseStatusIs(read_response)

        update_response = self.client.patch(url, {
            'title': 'Another title'
        })
        self.assertResponseStatusIs(update_response)
        self.assertEqual(set(read_response.data.keys()), set(update_response.data.keys()))


class TestEOIReviewersAssessmentsNotifyAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED
    quantity = 1

    def setUp(self):
        super(TestEOIReviewersAssessmentsNotifyAPIView, self).setUp()
        PartnerSimpleFactory()
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        OpenEOIFactory.create_batch(self.quantity)

    def test_send_notification(self):
        eoi = EOI.objects.first()
        eoi.reviewers.add(self.user)

        url = reverse('projects:eoi-reviewers-assessments-notify', kwargs={
            "eoi_id": eoi.id, "reviewer_id": self.user.id
        })
        create_notification_response = self.client.post(url)
        self.assertEqual(
            create_notification_response.status_code, status.HTTP_201_CREATED,
            msg=create_notification_response.content
        )

        notifications_response = self.client.get('/api/notifications/')
        self.assertEqual(notifications_response.status_code, status.HTTP_200_OK)
        self.assertEqual(notifications_response.data['count'], 1)
        self.assertEqual(
            notifications_response.data['results'][0]['notification']['source'], NotificationType.CFEI_REVIEW_REQUIRED
        )

        create_notification_response = self.client.post(url)
        self.assertEqual(create_notification_response.status_code, status.HTTP_200_OK)
        self.assertIn('success', create_notification_response.json())

        with mock.patch('notification.helpers.timezone.now') as mock_now:
            mock_now.return_value = eoi.created + relativedelta(hours=25)
            create_notification_response = self.client.post(url)
            self.assertEqual(create_notification_response.status_code, status.HTTP_201_CREATED)


class TestLocationRequiredOnCFEICreate(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    def setUp(self):
        super(TestLocationRequiredOnCFEICreate, self).setUp()
        office = self.user.agency_members.first().office
        self.base_payload = {
            "specializations": [
                24
            ],
            "assessments_criteria": [
                {
                    "selection_criteria": "LEP",
                    "description": "asdasdasdasd"
                }
            ],
            "title": "asdasdasd",
            "focal_points": [
                self.user.id
            ],
            "description": "asdasdas",
            "goal": "asdasdsa",
            "clarification_request_deadline_date": date.today(),
            "deadline_date": date.today() + relativedelta(days=1),
            "notif_results_date": date.today() + relativedelta(days=2),
            "start_date": date.today() + relativedelta(days=10),
            "end_date": date.today() + relativedelta(days=20),
            "has_weighting": False,
            "locations": [
                {
                    "admin_level_1": {
                        "country_code": "CV"
                    },
                }
            ],
            "agency": office.agency.id,
            "agency_office": office.id,

        }

    def test_create_required(self):
        payload = self.base_payload.copy()
        url = reverse('projects:open')
        create_response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(create_response, status.HTTP_400_BAD_REQUEST)
        self.assertIn('locations', create_response.data)

        payload["locations"][0]['admin_level_1']['name'] = 'asd'
        create_response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(create_response, status.HTTP_400_BAD_REQUEST)
        self.assertIn('locations', create_response.data)

        payload["locations"][0]['lat'] = "14.95639"
        payload["locations"][0]['lon'] = "-23.62782"
        create_response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(create_response, status.HTTP_201_CREATED)

    def test_create_with_optional_location(self):
        payload = self.base_payload.copy()
        url = reverse('projects:open')

        payload["locations"] = [
            {
                "admin_level_1": {
                    "country_code": "PS"
                },
            }
        ]
        create_response = self.client.post(url, data=payload)
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)

    def test_multiple_locations(self):
        payload = self.base_payload.copy()
        url = reverse('projects:open')
        payload["locations"] = [
            {
                "admin_level_1": {
                    "country_code": "CV",
                    "name": "ASD",
                },
                'lat': "14.95639",
                'lon': "-23.62782"
            },
            {
                "admin_level_1": {
                    "country_code": "PS"
                },
            }
        ]
        create_response = self.client.post(url, data=payload)
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)

    def test_create_application(self):
        eoi = OpenEOIFactory(agency=self.user.agency)
        apply_url = reverse('projects:partner-applications', kwargs={'pk': eoi.pk})

        partner = PartnerFactory()
        user = PartnerMemberFactory(partner=partner).user
        self.client.force_login(user)
        apply_response = self.client.post(apply_url, data={
            'cn': get_new_common_file().id
        })
        self.assertResponseStatusIs(apply_response, status.HTTP_201_CREATED)


class TestDirectSelectionTestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED
    quantity = 2
    initial_factories = [
        AgencyFactory,
        AgencyOfficeFactory,
        UserFactory,
        PartnerFactory,
    ]

    def setUp(self):
        super(TestDirectSelectionTestCase, self).setUp()
        for partner in Partner.objects.all():
            PartnerMemberFactory.create_batch(5, partner=partner)

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_create_direct(self):
        office = self.user.agency_members.first().office
        partners = Partner.objects.all()[:2]
        partner1, partner2 = partners
        focal_point = AgencyMemberFactory(role=list(VALID_FOCAL_POINT_ROLE_NAMES)[0], office=office).user
        direct_selection_payload = {
            "applications": [
                {
                    "partner": partner1.id,
                    "ds_justification_select": ["Loc"],
                    "justification_reason": "123123"
                }, {
                    "partner": partner2.id,
                    "ds_justification_select": ["Loc"],
                    "justification_reason": "1231231241245125"
                }],
            "eoi": {
                "countries": [
                    {
                        "country": "FR",
                        "locations": [{
                            "admin_level_1": {
                                "name": "Île-de-France",
                                "country_code": "FR"
                            },
                            "lat": "48.45289",
                            "lon": "2.65182"
                        }]
                    }
                ],
                "specializations": [28, 27],
                "title": "1213123",
                "focal_points": [focal_point.id],
                "description": "123123123",
                "goal": "123123123",
                "start_date": date.today() + relativedelta(days=1),
                "end_date": date.today() + relativedelta(days=15),
                "country_code": ["FR"],
                "locations": [
                    {
                        "admin_level_1": {
                            "name": "Île-de-France",
                            "country_code": "FR"
                        },
                        "lat": "48.45289",
                        "lon": "2.65182"
                    }
                ],
                "agency": office.agency.id,
                "agency_office": office.id
            }}
        url = reverse('projects:direct')
        response = self.client.post(url, data=direct_selection_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        for partner in partners:
            PartnerVerificationFactory(partner=partner, submitter=self.user)

        response = self.client.post(url, data=direct_selection_payload)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('applications', response.data)

        direct_selection_payload['applications'].pop()
        response = self.client.post(url, data=direct_selection_payload)
        self.assertResponseStatusIs(response, status_code=status.HTTP_201_CREATED)
        self.assertFalse(response.data['eoi']['sent_for_publishing'])
        self.assertFalse(response.data['eoi']['is_published'])

        call_command('send_daily_notifications')
        selection_emails = list(filter(
            lambda msg: NOTIFICATION_DATA[NotificationType.DIRECT_SELECTION_INITIATED]['subject'] in msg.body,
            mail.outbox
        ))
        self.assertEqual(len(selection_emails), 0)
        mail.outbox = []

        partner1_application = partner1.applications.first()
        publish_url = reverse('projects:eoi-publish', kwargs={'pk': partner1_application.eoi_id})
        self.assertResponseStatusIs(self.client.post(publish_url))

        call_command('send_daily_notifications')
        selection_emails = list(filter(
            lambda msg: NOTIFICATION_DATA[NotificationType.DIRECT_SELECTION_INITIATED]['subject'] in msg.body,
            mail.outbox
        ))
        self.assertEqual(len(selection_emails), User.objects.filter(partner_members__partner=partner1).count())

        application_url = reverse('projects:application', kwargs={'pk': partner1_application.pk})
        accept_payload = {
            "did_accept": True,
            "did_decline": False
        }

        update_response = self.client.patch(application_url, data=accept_payload)
        self.assertResponseStatusIs(update_response)

        call_command('send_daily_notifications')
        notification_emails = list(filter(
            lambda msg: NOTIFICATION_DATA[NotificationType.CFEI_APPLICATION_WIN]['subject'] in msg.body,
            mail.outbox
        ))
        self.assertTrue(len(notification_emails) > 0)

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_patch_direct(self):
        office = self.user.agency_members.first().office
        partner = Partner.objects.first()
        direct_selection_payload = {
            "applications": [
                {
                    "partner": partner.id,
                    "ds_justification_select": ["Loc"],
                    "justification_reason": "123123"
                }
            ],
            "eoi": {
                "countries": [
                    {
                        "country": "FR",
                        "locations": [{
                            "admin_level_1": {
                                "name": "Île-de-France",
                                "country_code": "FR"
                            },
                            "lat": "48.45289",
                            "lon": "2.65182"
                        }]
                    }
                ],
                "specializations": [28, 27],
                "title": "1213123",
                "focal_points": [
                    AgencyMemberFactory(role=list(VALID_FOCAL_POINT_ROLE_NAMES)[0], office=office).user.id,
                    AgencyMemberFactory(role=list(VALID_FOCAL_POINT_ROLE_NAMES)[0], office=office).user.id,
                    AgencyMemberFactory(role=list(VALID_FOCAL_POINT_ROLE_NAMES)[0], office=office).user.id,
                    AgencyMemberFactory(role=list(VALID_FOCAL_POINT_ROLE_NAMES)[0], office=office).user.id,
                    AgencyMemberFactory(role=list(VALID_FOCAL_POINT_ROLE_NAMES)[0], office=office).user.id,
                ],
                "description": "123123123",
                "goal": "123123123",
                "start_date": date.today() + relativedelta(days=10),
                "end_date": date.today() + relativedelta(days=20),
                "country_code": ["FR"],
                "locations": [
                    {
                        "admin_level_1": {
                            "name": "Île-de-France",
                            "country_code": "FR"
                        },
                        "lat": "48.45289",
                        "lon": "2.65182"
                    }
                ],
                "agency": office.agency.id,
                "agency_office": office.id
            }
        }
        url = reverse('projects:direct')
        PartnerVerificationFactory(partner=partner, submitter=self.user)
        response = self.client.post(url, data=direct_selection_payload)
        self.assertResponseStatusIs(response, status_code=status.HTTP_201_CREATED)
        project_id = partner.applications.first().eoi_id

        publish_url = reverse('projects:eoi-publish', kwargs={'pk': project_id})
        self.assertResponseStatusIs(self.client.post(publish_url))

        project_url = reverse('projects:eoi-detail', kwargs={'pk': project_id})
        patch_payload = {
            'title': 'new title ASD'
        }
        patch_response = self.client.patch(project_url, patch_payload)
        self.assertResponseStatusIs(patch_response)
        self.assertEqual(patch_payload['title'], patch_response.data['title'])

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_patch_locations_issue_direct(self):
        project = DirectEOIFactory(created_by=self.user)
        project_url = reverse('projects:eoi-detail', kwargs={'pk': project.pk})

        patch_payload = {
            "locations": [
                {
                    "admin_level_1": {
                        "name": "Elbasan County",
                        "country_code": "AL"
                    },
                    "lat": "41.18271",
                    "lon": "20.29838"
                },
                {
                    "admin_level_1": {
                        "name": "Gjirokastër County",
                        "country_code": "AL"
                    },
                    "lat": "40.38413",
                    "lon": "20.38627"
                },
                {
                    "admin_level_1": {
                        "name": "Fier County",
                        "country_code": "AL"
                    },
                    "lat": "40.58468",
                    "lon": "19.77104"
                }
            ],
        }
        patch_response = self.client.patch(project_url, patch_payload)
        self.assertResponseStatusIs(patch_response)

        patch_response = self.client.patch(project_url, data={
            'locations': patch_response.data['locations']
        })
        self.assertResponseStatusIs(patch_response)


class TestEOIPublish(BaseAPITestCase):

    quantity = 1
    user_type = BaseAPITestCase.USER_AGENCY
    partner_role = AgencyRole.READER
    initial_factories = [
        AgencyFactory,
        AgencyOfficeFactory,
        UserFactory,
        AgencyMemberFactory,
        PartnerFactory,
        OpenEOIFactory,
    ]

    def test_publish_permission(self):
        eoi = EOI.objects.first()
        url = reverse('projects:eoi-publish', kwargs={'pk': eoi.pk})
        response = self.client.post(url)
        self.assertResponseStatusIs(response, status.HTTP_403_FORBIDDEN)

        self.set_current_user_role(AgencyRole.EDITOR_ADVANCED.name)
        response = self.client.post(url)
        self.assertResponseStatusIs(response, status.HTTP_403_FORBIDDEN)

        eoi.created_by = self.user
        eoi.deadline_date = date.today() + relativedelta(days=7)
        eoi.save()
        response = self.client.post(url)
        self.assertResponseStatusIs(response, status.HTTP_200_OK)
        eoi.refresh_from_db()
        self.assertTrue(eoi.is_published)
        self.assertEqual(eoi.status, CFEI_STATUSES.open)


class TestUCNCreateAndPublish(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_PARTNER
    agency_role = PartnerRole.EDITOR
    initial_factories = [
        AgencyFactory,
        AgencyOfficeFactory,
        UserFactory,
        AgencyMemberFactory,
        PartnerFactory,
        PartnerMemberFactory,
    ]

    def setUp(self):
        super(TestUCNCreateAndPublish, self).setUp()
        self.base_payload = {
            "locations": [
                {
                    "admin_level_1": {
                        "name": "Île-de-France",
                        "country_code": "FR"
                    },
                    "lat": "48.45289",
                    "lon": "2.65182"
                }
            ],
            'title': 'Save stuff',
            'agency': Agency.objects.order_by('?').first().id,
            "specializations": [
                s.id for s in Specialization.objects.order_by('?')[:2]
            ],
            'cn': get_new_common_file().id
        }

    def test_ucn_create_and_publish(self):
        payload = self.base_payload.copy()

        url = reverse('projects:applications-unsolicited')
        response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
        ucn = Application.objects.get(id=response.data['id'])
        self.assertEqual(ucn.application_status, EXTENDED_APPLICATION_STATUSES.draft)

        publish_url = reverse('projects:ucn-manage', kwargs={'pk': ucn.pk})

        self.set_current_user_role(PartnerRole.READER.name)
        publish_response = self.client.post(publish_url)
        self.assertResponseStatusIs(publish_response, status.HTTP_403_FORBIDDEN)

        self.set_current_user_role(PartnerRole.EDITOR.name)
        publish_response = self.client.post(publish_url)
        self.assertResponseStatusIs(publish_response, status.HTTP_200_OK)
        ucn.refresh_from_db()
        self.assertEqual(ucn.application_status, EXTENDED_APPLICATION_STATUSES.review)

    def test_ucn_create_and_update(self):
        payload = self.base_payload.copy()

        url = reverse('projects:applications-unsolicited')
        response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
        ucn = Application.objects.get(id=response.data['id'])
        self.assertEqual(ucn.application_status, EXTENDED_APPLICATION_STATUSES.draft)

        manage_url = reverse('projects:ucn-manage', kwargs={'pk': ucn.pk})

        new_cn = get_new_common_file()
        update_response = self.client.patch(manage_url, data={
            'cn': new_cn.id
        })
        self.assertResponseStatusIs(update_response)

        new_locations_payload = {
            'locations': [
                {
                    "admin_level_1": {"name": "Baghdad", "country_code": 'IQ'},
                    "lat": random.randint(-90, 90),
                    "lon": random.randint(-180, 180),
                },
                {
                    "admin_level_1": {"name": "Paris", "country_code": "FR"},
                    "lat": random.randint(-90, 90),
                    "lon": random.randint(-180, 180),
                },
            ],
        }

        update_response = self.client.patch(manage_url, data=new_locations_payload)
        self.assertResponseStatusIs(update_response)
        self.assertEqual(len(update_response.data['locations']), 2)

        partial_update_payload = {
            'locations': update_response.data['locations'] + [{
                "admin_level_1": {"name": "Paris", "country_code": "FR"},
                "lat": random.randint(-90, 90),
                "lon": random.randint(-180, 180),
            }]
        }
        update_response = self.client.patch(manage_url, data=partial_update_payload)
        self.assertResponseStatusIs(update_response)
        self.assertEqual(len(update_response.data['locations']), 3)

    def test_locations_issue(self):
        payload = {
            "specializations": [
                35
            ],
            "agency": Agency.objects.order_by('?').first().id,
            "title": "testucn",
            "cn": get_new_common_file().id,
            "country_code": [
                "AF"
            ],
            "locations": [
                {
                    "admin_level_1": {
                        "name": "Samangan",
                        "country_code": "AF"
                    },
                    "lat": "35.88378",
                    "lon": "68.12125"
                },
                {
                    "admin_level_1": {
                        "name": "Ghor",
                        "country_code": "AF"
                    },
                    "lat": "33.46268",
                    "lon": "65.00114"
                }
            ]
        }

        url = reverse('projects:applications-unsolicited')
        response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
        ucn = Application.objects.get(id=response.data['id'])

        manage_url = reverse('projects:ucn-manage', kwargs={'pk': ucn.pk})

        update_payload = {
            "title": "testucnsdsd",
            "agency": Agency.objects.order_by('?').first().id,
            "specializations": [
                35
            ],
            "country_code": [
                "AF"
            ],
            "locations": response.data['locations']
        }

        update_response = self.client.patch(manage_url, data=update_payload)
        self.assertResponseStatusIs(update_response)


class TestEOIPDFExport(BaseAPITestCase):

    quantity = 1
    user_type = BaseAPITestCase.USER_AGENCY
    partner_role = AgencyRole.READER
    initial_factories = [
        OpenEOIFactory,
    ]

    def test_download_pdf(self):
        eoi = EOI.objects.first()
        url = reverse('projects:eoi-detail', kwargs={'pk': eoi.pk}) + '?export=pdf'
        response = self.client.get(url)
        self.assertResponseStatusIs(response, status.HTTP_200_OK)
        self.assertEqual(response.content_type, 'application/pdf')

from datetime import date

from dateutil.relativedelta import relativedelta
from django.urls import reverse
from rest_framework import status

from account.models import User
from agency.agencies import UNHCR, UNICEF
from agency.permissions import AgencyPermission
from agency.roles import VALID_FOCAL_POINT_ROLE_NAMES, AgencyRole
from common.consts import ALL_COMPLETED_REASONS, DSR_FINALIZE_RETENTION_CHOICES, CFEI_STATUSES
from common.factories import AgencyMemberFactory, PartnerFactory, PartnerVerificationFactory, OpenEOIFactory, \
    DirectEOIFactory, PartnerMemberFactory
from common.tests.base import BaseAPITestCase
from partner.models import PartnerMember, Partner
from project.models import EOI, Application


class TestOpenCFEI(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY

    def setUp(self):
        super(TestOpenCFEI, self).setUp()
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
            "deadline_date": date.today() + relativedelta(days=1),
            "notif_results_date": date.today() + relativedelta(days=2),
            "start_date": date.today() + relativedelta(days=10),
            "end_date": date.today() + relativedelta(days=20),
            "has_weighting": False,
            "locations": [
                {
                    "admin_level_1": {
                        "country_code": "CV",
                        "name": "Location",
                    },
                    'lat': "14.95639",
                    'lon': "-23.62782",
                }
            ],
            "agency": office.agency.id,
            "agency_office": office.id,

        }

    def test_create_open(self):
        payload = self.base_payload.copy()
        url = reverse('projects:open')

        roles_allowed, roles_disallowed = self.get_agency_with_and_without_permissions(
            AgencyPermission.CFEI_DRAFT_CREATE
        )

        for role in roles_allowed:
            self.set_current_user_role(role.name)
            create_response = self.client.post(url, data=payload)
            self.assertResponseStatusIs(create_response, status.HTTP_201_CREATED)

        for role in roles_disallowed:
            self.set_current_user_role(role.name)
            create_response = self.client.post(url, data=payload)
            self.assertResponseStatusIs(create_response, status.HTTP_403_FORBIDDEN)

    def test_create_dates_out_of_order(self):
        payload = self.base_payload.copy()
        payload['end_date'], payload['start_date'] = payload['start_date'], payload['end_date']

        self.set_current_user_role(AgencyRole.EDITOR_ADVANCED.name)
        url = reverse('projects:open')

        create_response = self.client.post(url, data=payload)
        self.assertResponseStatusIs(create_response, status.HTTP_400_BAD_REQUEST)

    def test_finalize(self):
        status_expected_response = {
           ALL_COMPLETED_REASONS.cancelled: status.HTTP_200_OK,
           ALL_COMPLETED_REASONS.no_candidate: status.HTTP_200_OK,
           ALL_COMPLETED_REASONS.partners: status.HTTP_400_BAD_REQUEST,
           ALL_COMPLETED_REASONS.accepted_retention: status.HTTP_400_BAD_REQUEST,
        }

        for completed_reason, expected_response_code in status_expected_response.items():
            eoi = OpenEOIFactory(created_by=self.user)
            eoi.applications.update(did_win=False, did_accept=False)
            update_response = self.client.patch(
                reverse('projects:eoi-detail', kwargs={'pk': eoi.id}),
                {
                    'completed_reason': completed_reason,
                    'justification': '!@#!@#!@#!%#%GDF',
                }
            )
            self.assertResponseStatusIs(update_response, expected_response_code)

        status_expected_response = {
           ALL_COMPLETED_REASONS.cancelled: status.HTTP_200_OK,
           ALL_COMPLETED_REASONS.no_candidate: status.HTTP_200_OK,
           ALL_COMPLETED_REASONS.partners: status.HTTP_200_OK,
           ALL_COMPLETED_REASONS.accepted_retention: status.HTTP_400_BAD_REQUEST,
        }

        for completed_reason, expected_response_code in status_expected_response.items():
            eoi = OpenEOIFactory(created_by=self.user)
            eoi.applications.update(did_win=True, did_accept=True)

            update_response = self.client.patch(
                reverse('projects:eoi-detail', kwargs={'pk': eoi.id}),
                {
                    'completed_reason': completed_reason,
                    'justification': '!@#!@#!@#!%#%GDF',
                }
            )
            self.assertResponseStatusIs(update_response, expected_response_code)


class TestDSRCFEI(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    def setUp(self):
        super(TestDSRCFEI, self).setUp()
        office = self.user.agency_members.first().office
        office.agency = UNICEF.model_instance
        office.save()
        self.partner: Partner = PartnerFactory()
        PartnerVerificationFactory(partner=self.partner, submitter=self.user)
        focal_point = AgencyMemberFactory(role=list(VALID_FOCAL_POINT_ROLE_NAMES)[0]).user
        self.payload = {
            "applications": [
                {
                    "partner": self.partner.id,
                    "ds_justification_select": ["Loc"],
                    "justification_reason": "123123"
                },
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
            }
        }

    def test_create_direct(self):
        payload = self.payload.copy()
        url = reverse('projects:direct')

        roles_allowed, roles_disallowed = self.get_agency_with_and_without_permissions(
            AgencyPermission.CFEI_DIRECT_CREATE_DRAFT_MANAGE_FOCAL_POINTS
        )

        for role in roles_allowed:
            self.set_current_user_role(role.name)
            create_response = self.client.post(url, data=payload, format='json')
            self.assertResponseStatusIs(create_response, status.HTTP_201_CREATED)

        for role in roles_disallowed:
            self.set_current_user_role(role.name)
            create_response = self.client.post(url, data=payload, format='json')
            self.assertResponseStatusIs(create_response, status.HTTP_403_FORBIDDEN)

    def test_create_with_locked_partner(self):
        payload = self.payload.copy()
        url = reverse('projects:direct')

        self.partner.is_locked = True
        self.partner.save()

        create_response = self.client.post(url, data=payload, format='json')
        self.assertResponseStatusIs(create_response, status.HTTP_400_BAD_REQUEST)

    def test_finalize(self):
        status_expected_response = {
           ALL_COMPLETED_REASONS.cancelled: status.HTTP_200_OK,
           ALL_COMPLETED_REASONS.no_candidate: status.HTTP_400_BAD_REQUEST,
           ALL_COMPLETED_REASONS.partners: status.HTTP_400_BAD_REQUEST,
           ALL_COMPLETED_REASONS.accepted: status.HTTP_400_BAD_REQUEST,
           ALL_COMPLETED_REASONS.accepted_retention: status.HTTP_400_BAD_REQUEST,
        }

        for completed_reason, expected_response_code in status_expected_response.items():
            eoi = DirectEOIFactory(created_by=self.user, agency=UNICEF.model_instance)
            eoi.applications.update(did_win=False, did_accept=False)
            update_response = self.client.patch(
                reverse('projects:eoi-detail', kwargs={'pk': eoi.id}),
                {
                    'completed_reason': completed_reason,
                    'justification': '!@#!@#!@#!%#%GDF',
                }
            )
            self.assertResponseStatusIs(update_response, expected_response_code)

        status_expected_response = {
           ALL_COMPLETED_REASONS.cancelled: status.HTTP_200_OK,
           ALL_COMPLETED_REASONS.no_candidate: status.HTTP_400_BAD_REQUEST,
           ALL_COMPLETED_REASONS.accepted: status.HTTP_200_OK,
           ALL_COMPLETED_REASONS.accepted_retention: status.HTTP_400_BAD_REQUEST,
        }

        for completed_reason, expected_response_code in status_expected_response.items():
            eoi = DirectEOIFactory(created_by=self.user, agency=UNICEF.model_instance)
            eoi.applications.update(did_win=True, did_accept=True)

            update_response = self.client.patch(
                reverse('projects:eoi-detail', kwargs={'pk': eoi.id}),
                {
                    'completed_reason': completed_reason,
                    'justification': '!@#!@#!@#!%#%GDF',
                }
            )
            self.assertResponseStatusIs(update_response, expected_response_code)

        retention_expected_response = {
            DSR_FINALIZE_RETENTION_CHOICES.R_1YR: status.HTTP_200_OK,
            DSR_FINALIZE_RETENTION_CHOICES.R_2YR: status.HTTP_200_OK,
            DSR_FINALIZE_RETENTION_CHOICES.R_3YR: status.HTTP_200_OK,
            DSR_FINALIZE_RETENTION_CHOICES.R_4YR: status.HTTP_200_OK,
            'ASD': status.HTTP_400_BAD_REQUEST,
        }

        for retention, expected_response_code in retention_expected_response.items():
            eoi = DirectEOIFactory(created_by=self.user, agency=UNHCR.model_instance)
            eoi.applications.update(did_win=True, did_accept=True)

            update_response = self.client.patch(
                reverse('projects:eoi-detail', kwargs={'pk': eoi.id}),
                {
                    'completed_reason': ALL_COMPLETED_REASONS.accepted_retention,
                    'justification': '!@#!@#!@#!%#%GDF',
                    'completed_retention': retention,
                }
            )
            self.assertResponseStatusIs(update_response, expected_response_code)

    def test_dsr_flow(self):
        self.set_current_user_role(AgencyRole.EDITOR_ADVANCED.name)
        partner_member: PartnerMember = PartnerMemberFactory(partner=self.partner)
        partner_user: User = partner_member.user

        payload = self.payload.copy()
        url = reverse('projects:direct')

        create_response = self.client.post(url, data=payload, format='json')
        self.assertResponseStatusIs(create_response, status.HTTP_201_CREATED)
        cfei: EOI = EOI.objects.get(id=create_response.data['eoi']['id'])
        application: Application = cfei.applications.first()
        application_url = reverse('projects:application', kwargs={"pk": application.pk})

        self.assertEqual(cfei.status, CFEI_STATUSES.draft)
        self.assertTrue(cfei.is_direct)

        with self.login_as_user(partner_user):
            list_response = self.client.get(reverse('projects:direct'))
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], 0)

        publish_url = reverse('projects:eoi-publish', kwargs={'pk': cfei.id})
        self.assertResponseStatusIs(self.client.post(publish_url))
        cfei.refresh_from_db()
        self.assertEqual(cfei.status, CFEI_STATUSES.open)

        with self.login_as_user(partner_user):
            list_response = self.client.get(reverse('projects:direct'))
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], 1)

            accept_payload = {
                "did_accept": True,
            }
            response = self.client.patch(application_url, data=accept_payload, format='json')
            self.assertResponseStatusIs(response)
            self.assertTrue(response.data['did_accept'])
            self.assertTrue(response.data['did_win'])
            self.assertEquals(response.data['decision_date'], str(date.today()))

        update_response = self.client.patch(
            reverse('projects:eoi-detail', kwargs={'pk': cfei.pk}),
            {
                'completed_reason': ALL_COMPLETED_REASONS.accepted,
                'justification': '!@#!@#!@#!%#%GDF',
            }
        )
        self.assertResponseStatusIs(update_response)

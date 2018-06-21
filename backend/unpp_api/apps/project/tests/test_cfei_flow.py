from django.urls import reverse
from rest_framework import status

from agency.permissions import AgencyPermission
from agency.roles import VALID_FOCAL_POINT_ROLE_NAMES
from common.consts import ALL_COMPLETED_REASONS, DSR_FINALIZE_RETENTION_CHOICES
from common.factories import AgencyMemberFactory, PartnerFactory, PartnerVerificationFactory, OpenEOIFactory, \
    DirectEOIFactory
from common.tests.base import BaseAPITestCase


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
            "deadline_date": "2018-01-24",
            "notif_results_date": "2018-01-25",
            "start_date": "2018-01-25",
            "end_date": "2018-01-28",
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
            create_response = self.client.post(url, data=payload, format='json')
            self.assertResponseStatusIs(create_response, status.HTTP_201_CREATED)

        for role in roles_disallowed:
            self.set_current_user_role(role.name)
            create_response = self.client.post(url, data=payload, format='json')
            self.assertResponseStatusIs(create_response, status.HTTP_403_FORBIDDEN)

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

    def setUp(self):
        super(TestDSRCFEI, self).setUp()
        office = self.user.agency_members.first().office
        partner1, partner2 = PartnerFactory.create_batch(2)
        PartnerVerificationFactory(partner=partner1, submitter=self.user)
        PartnerVerificationFactory(partner=partner2, submitter=self.user)
        focal_point = AgencyMemberFactory(role=list(VALID_FOCAL_POINT_ROLE_NAMES)[0]).user
        self.payload = {
            "applications": [
                {
                    "partner": partner1.id,
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
                "start_date": "2018-01-20",
                "end_date": "2018-01-27",
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

    def test_finalize(self):
        status_expected_response = {
           ALL_COMPLETED_REASONS.cancelled: status.HTTP_200_OK,
           ALL_COMPLETED_REASONS.no_candidate: status.HTTP_400_BAD_REQUEST,
           ALL_COMPLETED_REASONS.partners: status.HTTP_400_BAD_REQUEST,
           ALL_COMPLETED_REASONS.accepted: status.HTTP_400_BAD_REQUEST,
           ALL_COMPLETED_REASONS.accepted_retention: status.HTTP_400_BAD_REQUEST,
        }

        for completed_reason, expected_response_code in status_expected_response.items():
            eoi = DirectEOIFactory(created_by=self.user)
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
            eoi = DirectEOIFactory(created_by=self.user)
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
            eoi = DirectEOIFactory(created_by=self.user)
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

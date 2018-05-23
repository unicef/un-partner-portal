from django.urls import reverse
from rest_framework import status

from agency.permissions import AgencyPermission
from common.tests.base import BaseAPITestCase


class TestCreateCFEIDraft(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY

    def setUp(self):
        super(TestCreateCFEIDraft, self).setUp()
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

    def test_create(self):
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

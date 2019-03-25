import random
from datetime import date

from dateutil.relativedelta import relativedelta
from django.urls import reverse
from rest_framework import status

from agency.roles import AgencyRole
from common.factories import AgencyMemberFactory, get_new_common_file
from common.tests.base import BaseAPITestCase
from project.models import EOI


class TestM2MWipeIssue(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_BASIC

    def setUp(self):
        super(TestM2MWipeIssue, self).setUp()
        office = self.user.agency_members.first().office
        self.base_payload = {
            "assessments_criteria": [
                {
                    "selection_criteria": "LEP",
                    "description": "asdasdasdasd"
                }
            ],
            "title": "asdasdasd",
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
                        "country_code": "CV",
                        "name": "Location",
                    },
                    'lat': "14.95639",
                    'lon': "-23.62782",
                }
            ],
            "agency": office.agency.id,
            "agency_office": office.id,
            'attachments': [{
                'file': get_new_common_file().pk,
                'description': 'Test File',
            } for _ in range(random.randint(0, 4))]
        }

    def test_create(self):
        url = reverse('projects:open')

        # CFEI 1
        payload_cfei_1 = self.base_payload.copy()
        payload_cfei_1['focal_points'] = [
            AgencyMemberFactory(role=AgencyRole.EDITOR_ADVANCED.name).user.id,
        ]
        payload_cfei_1['specializations'] = [
            1,
        ]

        cfei_1_create_response = self.client.post(url, data=payload_cfei_1)
        self.assertResponseStatusIs(cfei_1_create_response, status.HTTP_201_CREATED)

        # CFEI 2
        payload_cfei_2 = self.base_payload.copy()
        payload_cfei_2['focal_points'] = [
            AgencyMemberFactory(role=AgencyRole.EDITOR_ADVANCED.name).user.id,
        ]
        payload_cfei_2['specializations'] = [
            2,
        ]
        cfei_2_create_response = self.client.post(url, data=payload_cfei_2)
        self.assertResponseStatusIs(cfei_2_create_response, status.HTTP_201_CREATED)

        cfei_1_url = reverse('projects:eoi-detail', kwargs={'pk': cfei_1_create_response.data['id']})
        patch_payload = {
            'focal_points': payload_cfei_1['focal_points'],
            'specializations': payload_cfei_1['specializations'],
        }
        patch_response = self.client.patch(cfei_1_url, data=patch_payload)
        self.assertResponseStatusIs(patch_response)

        cfei_2 = EOI.objects.get(id=cfei_2_create_response.data['id'])
        self.assertEqual(len(cfei_2.specializations.all()), 1)
        self.assertEqual(len(cfei_2.focal_points.all()), 1)

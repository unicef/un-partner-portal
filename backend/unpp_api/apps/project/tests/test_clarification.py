from datetime import date

from dateutil.relativedelta import relativedelta
from django.urls import reverse
from rest_framework import status

from agency.roles import AgencyRole
from common.factories import PartnerFactory, PartnerVerificationFactory, OpenEOIFactory, PartnerMemberFactory
from common.tests.base import BaseAPITestCase


class TestClarificationRequest(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    def test_add_questions(self):
        eoi = OpenEOIFactory()
        eoi.clarification_request_deadline_date = date.today() - relativedelta(days=7)
        eoi.save()

        partner = PartnerFactory()
        PartnerVerificationFactory(partner=partner)
        partner_member = PartnerMemberFactory(partner=partner)

        question_payload = {
            'question': 'Question1',
        }

        questions_url = reverse('projects:questions', kwargs={'eoi_id': eoi.pk})
        with self.login_as_user(partner_member.user):
            submit_response = self.client.post(questions_url, data=question_payload)
            self.assertResponseStatusIs(submit_response, status.HTTP_403_FORBIDDEN)

            eoi.clarification_request_deadline_date = date.today() + relativedelta(days=7)
            eoi.save()

            for i in range(10):
                submit_response = self.client.post(questions_url, data={
                    'question': f'Question{i}'
                })
                self.assertResponseStatusIs(submit_response, status.HTTP_201_CREATED)

        list_response = self.client.get(questions_url)
        self.assertResponseStatusIs(list_response)
        self.assertEqual(list_response.data['count'], 10)

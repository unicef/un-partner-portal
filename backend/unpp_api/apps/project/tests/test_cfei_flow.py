import random
from datetime import date

from dateutil.relativedelta import relativedelta
from django.core.management import call_command
from django.test import override_settings
from django.urls import reverse
from django.core import mail
from rest_framework import status

from account.models import User
from agency.agencies import UNHCR, UNICEF
from agency.permissions import AgencyPermission
from agency.roles import VALID_FOCAL_POINT_ROLE_NAMES, AgencyRole
from common.consts import ALL_COMPLETED_REASONS, DSR_FINALIZE_RETENTION_CHOICES, CFEI_STATUSES, APPLICATION_STATUSES
from common.factories import AgencyMemberFactory, PartnerFactory, PartnerVerificationFactory, OpenEOIFactory, \
    DirectEOIFactory, PartnerMemberFactory, get_new_common_file, AgencyOfficeFactory
from common.tests.base import BaseAPITestCase
from partner.models import PartnerMember, Partner
from project.models import EOI, Application


class TestOpenCFEI(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

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

    def test_send_for_decision(self):
        eoi = OpenEOIFactory(created_by=self.user, is_published=True)
        eoi.review_summary_comment = 'COMMENT'
        eoi.save()

        send_for_decision_url = reverse('projects:eoi-send-for-decision', kwargs={'pk': eoi.id})
        response = self.client.post(send_for_decision_url)
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)
        Application.objects.create(
            partner=PartnerFactory(),
            eoi=eoi,
            agency=eoi.agency,
            submitter=eoi.focal_points.first(),
            did_win=True,
            did_accept=True,
            status=APPLICATION_STATUSES.recommended
        )
        response = self.client.post(send_for_decision_url)
        self.assertResponseStatusIs(response)

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_recommendation_simple_flow(self):
        office = AgencyOfficeFactory(agency=UNICEF.model_instance)
        agency_member_basic = AgencyMemberFactory(office=office, role=AgencyRole.EDITOR_BASIC.name)
        reviewer_member_basic = AgencyMemberFactory(office=office, role=AgencyRole.EDITOR_BASIC.name)
        agency_member_advanced = AgencyMemberFactory(office=office, role=AgencyRole.EDITOR_ADVANCED.name)

        partner = PartnerFactory()
        PartnerVerificationFactory(partner=partner)
        partner_member = PartnerMemberFactory(partner=partner)

        # Create Open CFEI
        with self.login_as_user(agency_member_basic.user):
            payload = self.base_payload.copy()
            payload['focal_points'] = [agency_member_advanced.user.id]
            payload['agency'] = office.agency.id
            payload['agency_office'] = office.id
            create_response = self.client.post(reverse('projects:open'), data=payload)
            self.assertResponseStatusIs(create_response, status.HTTP_201_CREATED)

        # TODO: Send to publish

        # Publish
        with self.login_as_user(agency_member_advanced.user):
            url = reverse('projects:eoi-publish', kwargs={'pk': create_response.data['id']})
            publish_response = self.client.post(url)
            self.assertResponseStatusIs(publish_response)

        # Add reviewers
        with self.login_as_user(agency_member_basic.user):
            update_url = reverse('projects:eoi-detail', kwargs={'pk': create_response.data['id']})
            update_response = self.client.patch(update_url, data={
                'reviewers': [reviewer_member_basic.user.id]
            })
            self.assertResponseStatusIs(update_response)

        # Partner Applies
        with self.login_as_user(partner_member.user):
            apply_url = reverse('projects:partner-applications', kwargs={'pk': create_response.data['id']})
            apply_response = self.client.post(apply_url, data={
                'cn': get_new_common_file().pk,
            })
            self.assertResponseStatusIs(apply_response, status.HTTP_201_CREATED)

        # Review application
        # Have to patch deadline before we're allowed to review
        eoi = EOI.objects.get(id=create_response.data['id'])
        eoi.deadline_date = date.today() - relativedelta(days=1)
        eoi.save()
        with self.login_as_user(reviewer_member_basic.user):
            review_url = reverse('projects:reviewer-assessments', kwargs={'application_id': apply_response.data['id']})

            review_payload = {
                'scores': [
                    {
                        'selection_criteria': payload['assessments_criteria'][0]['selection_criteria'],
                        'score': 50
                    },
                ],
                'note': 'MY TEST NOTE',
            }
            review_response = self.client.post(review_url, data=review_payload)
            self.assertResponseStatusIs(review_response, status.HTTP_201_CREATED)

            # Complete reviews
            complete_url = reverse('projects:eoi-reviewers-complete-assessments', kwargs={'eoi_id': eoi.id})
            complete_reviews_response = self.client.post(complete_url)
            self.assertResponseStatusIs(complete_reviews_response)

        with self.login_as_user(agency_member_basic.user):
            # Preselect application
            recommend_url = reverse('projects:application', kwargs={'pk': apply_response.data['id']})
            recommend_response = self.client.patch(recommend_url, data={
                'status': APPLICATION_STATUSES.preselected
            })
            self.assertResponseStatusIs(recommend_response)

            # Recommend application
            recommend_url = reverse('projects:application', kwargs={'pk': apply_response.data['id']})
            recommend_response = self.client.patch(recommend_url, data={
                'status': APPLICATION_STATUSES.recommended
            })
            self.assertResponseStatusIs(recommend_response)

            # Fill review summary
            review_summary_url = reverse('projects:review-summary', kwargs={'pk': create_response.data['id']})
            review_summary_response = self.client.patch(review_summary_url, data={
                'review_summary_comment': 'TEST COMMENT'
            })
            self.assertResponseStatusIs(review_summary_response)

            # Send for decision
            send_for_decision_url = reverse('projects:eoi-send-for-decision', kwargs={'pk': eoi.id})
            send_for_decision_response = self.client.post(send_for_decision_url)
            self.assertResponseStatusIs(send_for_decision_response)
            eoi.refresh_from_db()
            self.assertTrue(eoi.sent_for_decision)
            call_command('send_daily_notifications')
            pick_a_winner_email = next(filter(
                lambda m: agency_member_advanced.user.email in m.to,
                mail.outbox
            ))
            self.assertIn('ready to have a winner picked', pick_a_winner_email.body)

        with self.login_as_user(agency_member_basic.user):
            # Check basic user cant pick winner
            application_url = reverse('projects:application', kwargs={'pk': apply_response.data['id']})
            win_response = self.client.patch(application_url, data={
                'did_win': True
            })
            self.assertResponseStatusIs(win_response, status.HTTP_403_FORBIDDEN)

        with self.login_as_user(agency_member_advanced.user):
            # Pick winner
            application_url = reverse('projects:application', kwargs={'pk': apply_response.data['id']})
            win_response = self.client.patch(application_url, data={
                'did_win': True
            })
            self.assertResponseStatusIs(win_response)

        with self.login_as_user(partner_member.user):
            # Accept
            application_url = reverse('projects:application', kwargs={'pk': apply_response.data['id']})
            accept_response = self.client.patch(application_url, data={
                'did_accept': True
            })
            self.assertResponseStatusIs(accept_response)

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_recommendation_pick_2nd_application(self):
        office = AgencyOfficeFactory(agency=UNICEF.model_instance)
        agency_member_basic = AgencyMemberFactory(office=office, role=AgencyRole.EDITOR_BASIC.name)
        reviewer_member_basic = AgencyMemberFactory(office=office, role=AgencyRole.EDITOR_BASIC.name)
        agency_member_advanced = AgencyMemberFactory(office=office, role=AgencyRole.EDITOR_ADVANCED.name)

        partner = PartnerFactory()
        PartnerVerificationFactory(partner=partner)
        partner_member = PartnerMemberFactory(partner=partner)

        partner2 = PartnerFactory()
        PartnerVerificationFactory(partner=partner2)
        partner2_member = PartnerMemberFactory(partner=partner2)

        # Create Open CFEI
        with self.login_as_user(agency_member_basic.user):
            payload = self.base_payload.copy()
            payload['focal_points'] = [agency_member_advanced.user.id]
            payload['agency'] = office.agency.id
            payload['agency_office'] = office.id
            create_response = self.client.post(reverse('projects:open'), data=payload)
            self.assertResponseStatusIs(create_response, status.HTTP_201_CREATED)

        # TODO: Send to publish

        # Publish
        with self.login_as_user(agency_member_advanced.user):
            url = reverse('projects:eoi-publish', kwargs={'pk': create_response.data['id']})
            publish_response = self.client.post(url)
            self.assertResponseStatusIs(publish_response)

        # Add reviewers
        with self.login_as_user(agency_member_basic.user):
            update_url = reverse('projects:eoi-detail', kwargs={'pk': create_response.data['id']})
            update_response = self.client.patch(update_url, data={
                'reviewers': [reviewer_member_basic.user.id]
            })
            self.assertResponseStatusIs(update_response)

        # Partner 1 Applies
        with self.login_as_user(partner_member.user):
            apply_url = reverse('projects:partner-applications', kwargs={'pk': create_response.data['id']})
            apply_response = self.client.post(apply_url, data={
                'cn': get_new_common_file().pk,
            })
            self.assertResponseStatusIs(apply_response, status.HTTP_201_CREATED)

        # Partner 2 Applies
        with self.login_as_user(partner2_member.user):
            apply_url = reverse('projects:partner-applications', kwargs={'pk': create_response.data['id']})
            apply2_response = self.client.post(apply_url, data={
                'cn': get_new_common_file().pk,
            })
            self.assertResponseStatusIs(apply2_response, status.HTTP_201_CREATED)

        # Review application
        # Have to patch deadline before we're allowed to review
        eoi = EOI.objects.get(id=create_response.data['id'])
        eoi.deadline_date = date.today() - relativedelta(days=1)
        eoi.save()
        with self.login_as_user(reviewer_member_basic.user):
            review_url = reverse('projects:reviewer-assessments', kwargs={'application_id': apply_response.data['id']})

            review_payload = {
                'scores': [
                    {
                        'selection_criteria': payload['assessments_criteria'][0]['selection_criteria'],
                        'score': 50
                    },
                ],
                'note': 'MY TEST NOTE',
            }
            review_response = self.client.post(review_url, data=review_payload)
            self.assertResponseStatusIs(review_response, status.HTTP_201_CREATED)

            # Fail to complete reviews - theres still applications to review
            complete_url = reverse('projects:eoi-reviewers-complete-assessments', kwargs={'eoi_id': eoi.id})
            complete_reviews_response = self.client.post(complete_url)
            self.assertResponseStatusIs(complete_reviews_response, status.HTTP_400_BAD_REQUEST)

            review2_url = reverse(
                'projects:reviewer-assessments', kwargs={'application_id': apply2_response.data['id']}
            )

            review_payload = {
                'scores': [
                    {
                        'selection_criteria': payload['assessments_criteria'][0]['selection_criteria'],
                        'score': 50
                    },
                ],
                'note': 'MY TEST NOTE',
            }
            review2_response = self.client.post(review2_url, data=review_payload)
            self.assertResponseStatusIs(review2_response, status.HTTP_201_CREATED)

            # Complete reviews
            complete_url = reverse('projects:eoi-reviewers-complete-assessments', kwargs={'eoi_id': eoi.id})
            complete_reviews_response = self.client.post(complete_url)
            self.assertResponseStatusIs(complete_reviews_response)

        with self.login_as_user(agency_member_basic.user):
            # Preselect application
            preselect_url = reverse('projects:application', kwargs={'pk': apply_response.data['id']})
            preselect_response = self.client.patch(preselect_url, data={
                'status': APPLICATION_STATUSES.preselected
            })
            self.assertResponseStatusIs(preselect_response)

            # Preselect application
            preselect2_url = reverse('projects:application', kwargs={'pk': apply2_response.data['id']})
            preselect2_response = self.client.patch(preselect2_url, data={
                'status': APPLICATION_STATUSES.preselected
            })
            self.assertResponseStatusIs(preselect2_response)

            # Recommend application
            recommend_url = reverse('projects:application', kwargs={'pk': apply_response.data['id']})
            recommend_response = self.client.patch(recommend_url, data={
                'status': APPLICATION_STATUSES.recommended
            })
            self.assertResponseStatusIs(recommend_response)

            # Fill review summary
            review_summary_url = reverse('projects:review-summary', kwargs={'pk': create_response.data['id']})
            review_summary_response = self.client.patch(review_summary_url, data={
                'review_summary_comment': 'TEST COMMENT'
            })
            self.assertResponseStatusIs(review_summary_response)

            # Send for decision
            send_for_decision_url = reverse('projects:eoi-send-for-decision', kwargs={'pk': eoi.id})
            send_for_decision_response = self.client.post(send_for_decision_url)
            self.assertResponseStatusIs(send_for_decision_response)
            eoi.refresh_from_db()
            self.assertTrue(eoi.sent_for_decision)
            call_command('send_daily_notifications')
            pick_a_winner_email = next(filter(
                lambda m: agency_member_advanced.user.email in m.to,
                mail.outbox
            ))
            self.assertIn('ready to have a winner picked', pick_a_winner_email.body)

        with self.login_as_user(agency_member_advanced.user):
            application_url = reverse('projects:application', kwargs={'pk': apply2_response.data['id']})
            recommend_response = self.client.patch(application_url, data={
                'status': APPLICATION_STATUSES.recommended
            })
            self.assertResponseStatusIs(recommend_response)

            win_response = self.client.patch(application_url, data={
                'did_win': True
            })
            self.assertResponseStatusIs(win_response)

        with self.login_as_user(partner2_member.user):
            # Accept
            application_url = reverse('projects:application', kwargs={'pk': apply2_response.data['id']})
            accept_response = self.client.patch(application_url, data={
                'did_accept': True
            })
            self.assertResponseStatusIs(accept_response)

    @override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
    def test_recommendation_pick_partner_declined(self):
        office = AgencyOfficeFactory(agency=UNICEF.model_instance)
        agency_member_basic = AgencyMemberFactory(office=office, role=AgencyRole.EDITOR_BASIC.name)
        reviewer_member_basic = AgencyMemberFactory(office=office, role=AgencyRole.EDITOR_BASIC.name)
        agency_member_advanced = AgencyMemberFactory(office=office, role=AgencyRole.EDITOR_ADVANCED.name)

        partner = PartnerFactory()
        PartnerVerificationFactory(partner=partner)
        partner_member = PartnerMemberFactory(partner=partner)

        partner2 = PartnerFactory()
        PartnerVerificationFactory(partner=partner2)
        partner2_member = PartnerMemberFactory(partner=partner2)

        # Create Open CFEI
        with self.login_as_user(agency_member_basic.user):
            payload = self.base_payload.copy()
            payload['focal_points'] = [agency_member_advanced.user.id]
            payload['agency'] = office.agency.id
            payload['agency_office'] = office.id
            create_response = self.client.post(reverse('projects:open'), data=payload)
            self.assertResponseStatusIs(create_response, status.HTTP_201_CREATED)

        # TODO: Send to publish

        # Publish
        with self.login_as_user(agency_member_advanced.user):
            url = reverse('projects:eoi-publish', kwargs={'pk': create_response.data['id']})
            publish_response = self.client.post(url)
            self.assertResponseStatusIs(publish_response)

        # Add reviewers
        with self.login_as_user(agency_member_basic.user):
            update_url = reverse('projects:eoi-detail', kwargs={'pk': create_response.data['id']})
            update_response = self.client.patch(update_url, data={
                'reviewers': [reviewer_member_basic.user.id]
            })
            self.assertResponseStatusIs(update_response)

        # Partner 1 Applies
        with self.login_as_user(partner_member.user):
            apply_url = reverse('projects:partner-applications', kwargs={'pk': create_response.data['id']})
            apply_response = self.client.post(apply_url, data={
                'cn': get_new_common_file().pk,
            })
            self.assertResponseStatusIs(apply_response, status.HTTP_201_CREATED)

        # Partner 2 Applies
        with self.login_as_user(partner2_member.user):
            apply_url = reverse('projects:partner-applications', kwargs={'pk': create_response.data['id']})
            apply2_response = self.client.post(apply_url, data={
                'cn': get_new_common_file().pk,
            })
            self.assertResponseStatusIs(apply2_response, status.HTTP_201_CREATED)

        # Review application
        # Have to patch deadline before we're allowed to review
        eoi = EOI.objects.get(id=create_response.data['id'])
        eoi.deadline_date = date.today() - relativedelta(days=1)
        eoi.save()
        with self.login_as_user(reviewer_member_basic.user):
            review_url = reverse('projects:reviewer-assessments', kwargs={'application_id': apply_response.data['id']})

            review_payload = {
                'scores': [
                    {
                        'selection_criteria': payload['assessments_criteria'][0]['selection_criteria'],
                        'score': 50
                    },
                ],
                'note': 'MY TEST NOTE',
            }
            review_response = self.client.post(review_url, data=review_payload)
            self.assertResponseStatusIs(review_response, status.HTTP_201_CREATED)

            # Fail to complete reviews - theres still applications to review
            complete_url = reverse('projects:eoi-reviewers-complete-assessments', kwargs={'eoi_id': eoi.id})
            complete_reviews_response = self.client.post(complete_url)
            self.assertResponseStatusIs(complete_reviews_response, status.HTTP_400_BAD_REQUEST)

            review2_url = reverse(
                'projects:reviewer-assessments', kwargs={'application_id': apply2_response.data['id']}
            )

            review_payload = {
                'scores': [
                    {
                        'selection_criteria': payload['assessments_criteria'][0]['selection_criteria'],
                        'score': 50
                    },
                ],
                'note': 'MY TEST NOTE',
            }
            review2_response = self.client.post(review2_url, data=review_payload)
            self.assertResponseStatusIs(review2_response, status.HTTP_201_CREATED)

            # Complete reviews
            complete_url = reverse('projects:eoi-reviewers-complete-assessments', kwargs={'eoi_id': eoi.id})
            complete_reviews_response = self.client.post(complete_url)
            self.assertResponseStatusIs(complete_reviews_response)

        with self.login_as_user(agency_member_basic.user):
            # Preselect application
            preselect_url = reverse('projects:application', kwargs={'pk': apply_response.data['id']})
            preselect_response = self.client.patch(preselect_url, data={
                'status': APPLICATION_STATUSES.preselected
            })
            self.assertResponseStatusIs(preselect_response)

            # Preselect application
            preselect2_url = reverse('projects:application', kwargs={'pk': apply2_response.data['id']})
            preselect2_response = self.client.patch(preselect2_url, data={
                'status': APPLICATION_STATUSES.preselected
            })
            self.assertResponseStatusIs(preselect2_response)

            # Recommend application
            recommend_url = reverse('projects:application', kwargs={'pk': apply_response.data['id']})
            recommend_response = self.client.patch(recommend_url, data={
                'status': APPLICATION_STATUSES.recommended
            })
            self.assertResponseStatusIs(recommend_response)

            # Fill review summary
            review_summary_url = reverse('projects:review-summary', kwargs={'pk': create_response.data['id']})
            review_summary_response = self.client.patch(review_summary_url, data={
                'review_summary_comment': 'TEST COMMENT'
            })
            self.assertResponseStatusIs(review_summary_response)

            # Send for decision
            send_for_decision_url = reverse('projects:eoi-send-for-decision', kwargs={'pk': eoi.id})
            send_for_decision_response = self.client.post(send_for_decision_url)
            self.assertResponseStatusIs(send_for_decision_response)
            eoi.refresh_from_db()
            self.assertTrue(eoi.sent_for_decision)
            call_command('send_daily_notifications')
            pick_a_winner_email = next(filter(
                lambda m: agency_member_advanced.user.email in m.to,
                mail.outbox
            ))
            self.assertIn('ready to have a winner picked', pick_a_winner_email.body)

        with self.login_as_user(agency_member_advanced.user):
            application_url = reverse('projects:application', kwargs={'pk': apply_response.data['id']})
            win_response = self.client.patch(application_url, data={
                'did_win': True
            })
            self.assertResponseStatusIs(win_response)

        with self.login_as_user(partner_member.user):
            # Accept
            application_url = reverse('projects:application', kwargs={'pk': apply_response.data['id']})
            accept_response = self.client.patch(application_url, data={
                'did_accept': False,
                'did_decline': True,
            })
            self.assertResponseStatusIs(accept_response)
        mail.outbox = []
        call_command('send_daily_notifications')

        partner_declined_email = next(filter(
            lambda m: agency_member_advanced.user.email in m.to,
            mail.outbox
        ))
        self.assertIn('Prospective Partner Decision Made', partner_declined_email.body)

        with self.login_as_user(agency_member_advanced.user):
            application_url = reverse('projects:application', kwargs={'pk': apply2_response.data['id']})
            recommend_response = self.client.patch(application_url, data={
                'status': APPLICATION_STATUSES.recommended
            })
            self.assertResponseStatusIs(recommend_response)

            win_response = self.client.patch(application_url, data={
                'did_win': True
            })
            self.assertResponseStatusIs(win_response)

        with self.login_as_user(partner2_member.user):
            # Accept
            application_url = reverse('projects:application', kwargs={'pk': apply2_response.data['id']})
            accept_response = self.client.patch(application_url, data={
                'did_accept': True
            })
            self.assertResponseStatusIs(accept_response)


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
                "agency_office": office.id,
                'attachments': [{
                    'file': get_new_common_file().pk,
                    'description': 'Test File',
                } for _ in range(random.randint(0, 4))]
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

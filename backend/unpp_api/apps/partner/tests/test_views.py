# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
import random

import mock
from datetime import date

from dateutil.relativedelta import relativedelta
from django.urls import reverse
from django.conf import settings
from rest_framework import status

from agency.models import Agency
from common.headers import CustomHeader
from partner.models import (
    Partner,
    PartnerProfile,
    PartnerMailingAddress,
    PartnerHeadOrganization,
    PartnerAuditAssessment,
    PartnerReporting,
    PartnerMandateMission,
    PartnerFunding,
    PartnerOtherInfo,
    PartnerInternalControl,
    PartnerExperience,
    PartnerPolicyArea,
)
from common.models import Point, CommonFile
from common.tests.base import BaseAPITestCase
from common.factories import (
    AgencyFactory,
    UserFactory,
    PartnerFactory,
    OtherAgencyFactory,
    PointFactory,
    PartnerMemberFactory,
)
from common.consts import (
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    YEARS_OF_EXP_CHOICES,
    PARTNER_TYPES,
    ORG_AUDIT_CHOICES,
    AUDIT_ASSESSMENT_CHOICES,
)


class TestPartnerCountryProfileAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_PARTNER

    def test_create_country_profile(self):
        partner = PartnerFactory(
            legal_name='Test International Partner HQ',
            display_type=PARTNER_TYPES.international
        )
        PartnerMemberFactory(partner=partner, user=self.user)
        self.client.set_headers({
            CustomHeader.PARTNER_ID.value: partner.id
        })

        PartnerPolicyArea.objects.filter(partner=partner).update(document_policies=None)
        url = reverse('partners:country-profile', kwargs={"pk": partner.id})
        response = self.client.get(url, format='json')
        self.assertResponseStatusIs(response)
        chosen_country_to_create = list(map(
            lambda x: x['country_code'],
            filter(lambda x: x['exist'] is False, response.data['countries_profile'])
        ))
        payload = {
            'chosen_country_to_create': chosen_country_to_create,
        }
        response = self.client.post(url, data=payload, format='json')
        self.assertTrue(status.is_client_error(response.status_code))
        self.assertEquals(
            response.data['non_field_errors'],
            ["You don't have the ability to create country profile if Your profile is not completed."]
        )

        with mock.patch('partner.models.Partner.has_finished', lambda: True):
            response = self.client.post(url, data=payload, format='json')

        self.assertResponseStatusIs(response, status_code=status.HTTP_201_CREATED)
        expected_count = len(chosen_country_to_create)
        self.assertEquals(
            Partner.objects.filter(hq_id=partner.id, display_type=PARTNER_TYPES.international).count(),
            expected_count
        )
        self.assertEquals(PartnerProfile.objects.filter(partner__hq=partner).count(), expected_count)
        self.assertEquals(PartnerMailingAddress.objects.filter(partner__hq=partner).count(), expected_count)
        self.assertEquals(PartnerHeadOrganization.objects.filter(partner__hq=partner).count(), 0)
        self.assertEquals(PartnerAuditAssessment.objects.filter(partner__hq=partner).count(), expected_count)
        self.assertEquals(PartnerReporting.objects.filter(partner__hq=partner).count(), expected_count)
        self.assertEquals(PartnerMandateMission.objects.filter(partner__hq=partner).count(), expected_count)
        self.assertEquals(PartnerFunding.objects.filter(partner__hq=partner).count(), expected_count)
        self.assertEquals(PartnerOtherInfo.objects.filter(partner__hq=partner).count(), expected_count)
        self.assertEquals(
            PartnerInternalControl.objects.filter(partner__hq=partner).count(),
            expected_count*len(list(FUNCTIONAL_RESPONSIBILITY_CHOICES._db_values))
        )


class TestPartnerDetailAPITestCase(BaseAPITestCase):

    quantity = 1
    initial_factories = [
        OtherAgencyFactory,
        AgencyFactory,
        UserFactory,
        PartnerFactory,
        PointFactory,
    ]
    user_type = BaseAPITestCase.USER_PARTNER

    def test_identification(self):
        profile = PartnerProfile.objects.first()
        year_establishment = 2015

        identification_url = reverse('partners:identification', kwargs={"pk": profile.id})
        payload = {
            'year_establishment': year_establishment,
            'have_governing_document': True,
            'registered_to_operate_in_country': True,
        }
        response = self.client.patch(identification_url, data=payload)
        self.assertResponseStatusIs(response)
        self.assertEquals(response.data['year_establishment'], year_establishment)

        response = self.client.get(identification_url)
        self.assertResponseStatusIs(response)
        identification_payload = response.data

        file_endpoint_url = reverse('common:file')
        filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.doc')
        with open(filename) as doc:
            payload = {
                "file_field": doc
            }
            response = self.client.post(file_endpoint_url, data=payload, format='multipart')

        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
        self.assertIsNotNone(response.data['id'])

        identification_payload['governing_documents'].append({
            'document': response.data['id']
        })

        with open(filename) as doc:
            payload = {
                "file_field": doc
            }
            response = self.client.post(file_endpoint_url, data=payload, format='multipart')

        self.assertTrue(status.is_success(response.status_code))
        self.assertTrue(response.data['id'] is not None)

        identification_payload['registration_documents'].append({
            'document': response.data['id'],
            'issue_date': date.today() - relativedelta(years=random.randint(1, 4)),
            'expiry_date': date.today() + relativedelta(years=random.randint(5, 20)),
            'registration_number': 'TEST_NUMBER',
            'issuing_authority': 'TEST_AUTHORITY',
        })

        response = self.client.patch(identification_url, data=identification_payload)
        self.assertResponseStatusIs(response)

        if len(response.data['registration_documents']) > 1:
            self.assertFalse(response.data['registration_documents'][0]['editable'])
        self.assertTrue(response.data['registration_documents'][-1]['editable'])

        if len(response.data['governing_documents']) > 1:
            self.assertFalse(response.data['governing_documents'][0]['editable'])
        self.assertTrue(response.data['governing_documents'][-1]['editable'])

        self.assertTrue(response.data['have_governing_document'])
        self.assertTrue(response.data['registered_to_operate_in_country'])
        self.assertEqual(response.data['registration_documents'][-1]['registration_number'], 'TEST_NUMBER')

    def test_contact_information(self):
        partner = Partner.objects.first()
        url = reverse('partners:contact-information', kwargs={"pk": partner.id})

        response = self.client.get(url, format='json')
        self.assertTrue(status.is_success(response.status_code))
        directors = response.data['directors']
        authorised_officers = response.data['authorised_officers']
        working_languages_other = 'PL'
        connectivity_excuse = "test excuse"
        fullname = "Leszek Test"
        email = "leszek@unicef.org"
        website = 'http://test.pl'
        for director in directors:
            director['fullname'] = fullname
            director['authorized'] = True

        for authorised_officer in authorised_officers:
            authorised_officer['fullname'] = fullname
            authorised_officer['email'] = email

        directors.append({
            'fullname': fullname,
            'job_title': 'PM Assistant',
            'authorized': True
        })
        authorised_officers.append({
            'fullname': fullname,
            'job_title': 'PM Assistant',
            'telephone': '(123) 234 569',
            'fax': u'(123) 234 566',
            'email': email
        })
        payload = {
            'org_head': {"fullname": fullname, "email": email},
            'mailing_address': {'website': website},
            'connectivity_excuse': connectivity_excuse,
            'working_languages_other': working_languages_other,
            'directors': directors,
            'authorised_officers': authorised_officers,
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertResponseStatusIs(response)
        self.assertEquals(response.data['working_languages_other'], working_languages_other)
        self.assertEquals(response.data['connectivity_excuse'], connectivity_excuse)
        # org head can't be changed
        self.assertTrue(response.data['org_head']['fullname'] != fullname)
        self.assertTrue(response.data['org_head']['email'] != email)
        self.assertEquals(response.data['mailing_address']['website'], website)
        self.assertEquals(len(response.data['directors']), len(directors))

        for director in response.data['directors']:
            self.assertEquals(director['fullname'], fullname)
            self.assertEquals(director['authorized'], True)

        authorised_officers = response.data['authorised_officers']
        for authorised_officer in authorised_officers:
            self.assertEquals(authorised_officer['fullname'], fullname)
            self.assertEquals(authorised_officer['email'], email)

        payload = {
            'connectivity_excuse': 'one field to patch'
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(status.is_success(response.status_code))
        self.assertEquals(response.data['connectivity_excuse'], payload['connectivity_excuse'])
        self.assertEquals(partner.authorised_officers.count(), len(authorised_officers))
        for authorised_officer in partner.authorised_officers.all():
            self.assertEquals(authorised_officer.fullname, fullname)
            self.assertEquals(authorised_officer.email, email)

    def test_mandate_mission(self):
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

        partner = Partner.objects.first()
        url = reverse('partners:mandate-mission', kwargs={"pk": partner.id})

        response = self.client.get(url, format='json')
        self.assertTrue(status.is_success(response.status_code))

        comment = "unit test desc"
        experience = PartnerExperience.objects.filter(partner=partner).first()
        payload = {
            'security_desc': comment,
            'ethic_fraud': True,
            'ethic_fraud_comment': comment,
            'ethic_fraud_policy': file_id,
            'security_high_risk_locations': True,
            'security_high_risk_policy': True,
            'population_of_concern': True,
            'ethic_safeguard': True,
            'ethic_safeguard_comment': comment,
            'ethic_safeguard_policy': file_id,
            'location_of_office': {
                'lat': 1,
                'lon': 1,
                'admin_level_1': {
                    'name': 'location_of_office',
                    'country_code': 'PL',
                }
            },
            'location_field_offices': [
                {
                    'lat': 1,
                    'lon': 1,
                    'admin_level_1': {
                        'name': 'location_of_office',
                        'country_code': 'PL',
                    },
                },
                {
                    'lat': 2,
                    'lon': 2,
                    'admin_level_1': {
                        'name': 'location_of_office',
                        'country_code': 'PL',
                    },
                },
            ],
            'governance_organigram': file_id,
            'experiences': [
                {
                    'id': experience.id,
                    'years': YEARS_OF_EXP_CHOICES.more_10
                },
                {
                    'specialization_id': 1,
                    'years': YEARS_OF_EXP_CHOICES.years15
                }
            ]
        }

        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(status.is_success(response.status_code))
        self.assertEquals(response.data['ethic_safeguard_comment'], comment)
        self.assertEquals(response.data['security_desc'], comment)
        self.assertEquals(response.data['ethic_fraud_comment'], comment)
        self.assertTrue(response.data['security_high_risk_locations'])
        self.assertTrue(response.data['security_high_risk_policy'])
        self.assertTrue(response.data['population_of_concern'])
        self.assertEquals(len(response.data['experiences']), 2)
        self.assertEquals(response.data['experiences'][0]['years'], YEARS_OF_EXP_CHOICES.more_10)
        self.assertIsNotNone(response.data['experiences'][0]['specialization'])
        self.assertEquals(response.data['experiences'][1]['years'], YEARS_OF_EXP_CHOICES.years15)
        self.assertEquals(len(response.data['location_field_offices']), 2)
        self.assertTrue(Point.objects.last().id in [office['id'] for office in response.data['location_field_offices']])

    def test_funding(self):
        partner = Partner.objects.first()
        url = reverse('partners:funding', kwargs={"pk": partner.id})

        response = self.client.get(url, format='json')
        self.assertTrue(status.is_success(response.status_code))

        text = 'test text'
        payload = response.data
        budgets = response.data['budgets']
        for budget in budgets:
            budget['year'] -= 4

        payload['budgets'] = budgets
        payload['main_donors_list'] = text
        payload['source_core_funding'] = text

        update_response = self.client.put(url, data=payload, format='json')
        self.assertTrue(status.is_success(update_response.status_code))
        self.assertEquals(update_response.data['main_donors_list'], text)
        self.assertEquals(update_response.data['source_core_funding'], text)
        self.assertEquals(len(update_response.data['budgets']), len(budgets))

    def test_collaboration(self):
        partner = Partner.objects.first()
        url = reverse('partners:collaboration', kwargs={"pk": partner.id})

        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        text = 'updated to test'

        collaborations_partnership = response.data['collaborations_partnership']
        for collaboration_partnership in collaborations_partnership:
            collaboration_partnership['description'] = text
            collaboration_partnership['partner_number'] = text

        payload = {
            'collaboration_evidences': [
                {
                    "evidence_file_id": CommonFile.objects.first().id,
                }
            ],
            'collaborations_partnership': collaborations_partnership,
            'partnership_collaborate_institution_desc': text,
            'partnership_collaborate_institution': True
        }

        update_response = self.client.patch(url, data=payload, format='json')
        self.assertEqual(update_response.status_code, status.HTTP_200_OK, msg=update_response.data)

        self.assertTrue(payload['partnership_collaborate_institution'])
        self.assertEquals(update_response.data['partnership_collaborate_institution_desc'], text)
        for cp in update_response.data['collaborations_partnership']:
            self.assertEquals(cp['description'], text)
            self.assertEquals(cp['partner_number'], text)

        collaborations_partnership = dict(update_response.data['collaborations_partnership'][0])

        collaborations_partnership.pop('id')
        collaborations_partnership['agency_id'] = Agency.objects.first().id

        payload = {
            'collaborations_partnership': [
                collaborations_partnership,
                collaborations_partnership
            ]
        }

        update_response = self.client.patch(url, data=payload, format='json')
        self.assertEqual(update_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('collaborations_partnership', update_response.data['full_non_field_errors'])

    def test_project_implementation(self):
        partner = Partner.objects.first()
        url = reverse('partners:project-implementation', kwargs={"pk": partner.id})

        response = self.client.get(url, format='json')
        self.assertResponseStatusIs(response)

        payload = response.data
        del payload['publish_annual_reports']
        del payload['link_report']
        del payload['capacity_assessments']
        del payload['report']
        del payload['key_result']
        del payload['last_report']
        del payload['audit_reports'][0]['most_recent_audit_report']
        del payload['audit_reports'][1]['most_recent_audit_report']

        text = 'test'
        payload['financial_control_system_desc'] = text
        payload['management_approach_desc'] = text
        payload['comment'] = text
        payload['regular_audited'] = False
        payload['experienced_staff'] = True
        payload['have_separate_bank_account'] = True
        payload['have_bank_account'] = True
        payload['capacity_assessment'] = True

        for internal_control in payload['internal_controls']:
            internal_control['comment'] = text

        response = self.client.patch(url, data=payload, format='json')

        self.assertResponseStatusIs(response)
        self.assertEquals(response.data['financial_control_system_desc'], text)
        self.assertEquals(response.data['management_approach_desc'], text)
        self.assertEquals(response.data['comment'], text)
        for ic in response.data['internal_controls']:
            self.assertEquals(ic['comment'], text)

    def test_other_info(self):
        url = reverse('common:file')
        filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'logo.png')
        with open(filename, 'rb') as doc:
            payload = {
                "file_field": doc
            }
            response = self.client.post(url, data=payload, format='multipart')

        self.assertTrue(status.is_success(response.status_code))
        self.assertTrue(response.data['id'] is not None)
        file_id = response.data['id']

        partner = Partner.objects.first()
        url = reverse('partners:other-info', kwargs={"pk": partner.id})

        response = self.client.get(url, format='json')
        self.assertTrue(status.is_success(response.status_code))

        text = 'test'
        payload = {
            'info_to_share': text,
            'org_logo': file_id,
            'confirm_data_updated': True,
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(status.is_success(response.status_code))
        self.assertEquals(response.data['info_to_share'], text)
        self.assertTrue(response.data['org_logo'] is not None)

        response = self.client.patch(url, data={"other_doc_1": file_id}, format='json')
        self.assertFalse(status.is_success(response.status_code))
        self.assertEquals(response.data[0],
                          'This given common file id {} can be used only once.'.format(file_id))

        response = self.client.patch(url, data={"other_doc_1": file_id, "other_doc_3": file_id}, format='json')
        self.assertFalse(status.is_success(response.status_code))
        self.assertEquals(response.data[0], 'Given related field common file id have to be unique.')

    def test_add_audit_reports(self):
        partner = Partner.objects.first()
        url = reverse('partners:project-implementation', kwargs={"pk": partner.id})

        files = []
        filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'logo.png')
        for _ in range(2):
            with open(filename, 'rb') as doc:
                response = self.client.post(reverse('common:file'), data={
                    "file_field": doc
                }, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.content)
            files.append(dict(response.data))

        update_payload = {
            'audit_reports': [{
                'most_recent_audit_report': f['id'],
                'org_audit': random.choice(list(ORG_AUDIT_CHOICES))[0],
            } for f in files]
        }

        update_response = self.client.patch(url, data=update_payload, format='json')
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)

        updated_audit_reports = update_response.data['audit_reports']
        self.assertEqual(len(updated_audit_reports), len(files))

        for f in files:
            self.assertTrue(
                partner.audit_reports.filter(most_recent_audit_report_id=f['id']).exists()
            )

    def test_add_assessment_reports(self):
        partner = Partner.objects.first()
        url = reverse('partners:project-implementation', kwargs={"pk": partner.id})

        files = []
        filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'logo.png')
        for _ in range(2):
            with open(filename, 'rb') as doc:
                response = self.client.post(reverse('common:file'), data={
                    "file_field": doc
                }, format='multipart')
            self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.content)
            files.append(dict(response.data))

        update_payload = {
            'capacity_assessments': [{
                'report_file': f['id'],
                'assessment_type': random.choice(list(AUDIT_ASSESSMENT_CHOICES))[0],
            } for f in files]
        }

        update_response = self.client.patch(url, data=update_payload, format='json')
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)

        updated_capacity_assessments = update_response.data['capacity_assessments']
        self.assertEqual(len(updated_capacity_assessments), len(files))

        for f in files:
            self.assertTrue(
                partner.capacity_assessments.filter(report_file_id=f['id']).exists()
            )


class TestPartnerPDFExport(BaseAPITestCase):

    quantity = 1
    user_type = BaseAPITestCase.USER_AGENCY
    initial_factories = [
        PartnerFactory,
    ]

    def test_download_partner_profile_pdf(self):
        partner = Partner.objects.first()
        url = reverse('partners:partner-profile', kwargs={'pk': partner.pk}) + '?export=pdf'
        response = self.client.get(url)
        self.assertResponseStatusIs(response, status.HTTP_200_OK)
        self.assertEqual(response.content_type, 'application/pdf')

    def test_layout_error(self):
        partner: Partner = Partner.objects.first()
        partner.mandate_mission.security_desc = 5000 * 'A '
        partner.mandate_mission.ethic_safeguard_comment = 5000 * 'A '
        partner.mandate_mission.ethic_fraud_comment = 5000 * 'A '
        partner.mandate_mission.save()

        url = reverse('partners:partner-profile', kwargs={'pk': partner.pk}) + '?export=pdf'
        response = self.client.get(url)
        self.assertResponseStatusIs(response, status.HTTP_200_OK)
        self.assertEqual(response.content_type, 'application/pdf')

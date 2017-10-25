# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
from datetime import date

from django.urls import reverse
from django.conf import settings
from rest_framework import status as statuses

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
)
from common.models import Point, CommonFile
from common.tests.base import BaseAPITestCase
from common.factories import (
    AgencyFactory,
    UserFactory,
    PartnerFactory,
    OtherAgencyFactory,
    PointFactory,
)
from common.consts import (
    BUDGET_CHOICES,
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    YEARS_OF_EXP_CHOICES,
)


class TestPartnerCountryProfileAPIView(BaseAPITestCase):

    quantity = 1
    initial_factories = [
        OtherAgencyFactory,
        AgencyFactory,
        UserFactory,
        PartnerFactory,
    ]

    def test_create_country_profile(self):
        partner = Partner.objects.first()
        url = reverse('partners:country-profile', kwargs={"pk": partner.id})
        response = self.client.get(url, format='json')
        chosen_country_to_create = map(lambda x: x['country_code'],
                                       filter(lambda x: x['exist'] is False, response.data['countries_profile']))
        payload = {
            'chosen_country_to_create': chosen_country_to_create,
        }
        response = self.client.post(url, data=payload, format='json')
        expected_count = len(chosen_country_to_create)
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(Partner.objects.filter(hq_id=partner.id).count(), expected_count)
        self.assertEquals(PartnerProfile.objects.filter(partner__hq=partner).count(), expected_count)
        self.assertEquals(PartnerMailingAddress.objects.filter(partner__hq=partner).count(), expected_count)
        self.assertEquals(PartnerHeadOrganization.objects.filter(partner__hq=partner).count(), 0)
        self.assertEquals(PartnerAuditAssessment.objects.filter(partner__hq=partner).count(), expected_count)
        self.assertEquals(PartnerReporting.objects.filter(partner__hq=partner).count(), expected_count)
        self.assertEquals(PartnerMandateMission.objects.filter(partner__hq=partner).count(), expected_count)
        self.assertEquals(PartnerFunding.objects.filter(partner__hq=partner).count(), expected_count)
        self.assertEquals(PartnerOtherInfo.objects.filter(partner__hq=partner).count(), expected_count)
        self.assertEquals(PartnerInternalControl.objects.filter(partner__hq=partner).count(),
                          expected_count*len(list(FUNCTIONAL_RESPONSIBILITY_CHOICES._db_values)))


class TestPartnerDetailAPITestCase(BaseAPITestCase):

    quantity = 1
    initial_factories = [
        OtherAgencyFactory,
        AgencyFactory,
        UserFactory,
        PartnerFactory,
        PointFactory,
    ]

    def test_identification(self):
        profile = PartnerProfile.objects.first()
        year_establishment = 2015
        registration_date = '2016-01-01'
        url = reverse('common:file')
        filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.csv')
        with open(filename) as doc:
            payload = {
                "file_field": doc
            }
            response = self.client.post(url, data=payload, format='multipart')

        self.assertTrue(statuses.is_success(response.status_code))
        self.assertTrue(response.data['id'] is not None)
        gov_doc_id = response.data['id']

        with open(filename) as doc:
            payload = {
                "file_field": doc
            }
            response = self.client.post(url, data=payload, format='multipart')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertTrue(response.data['id'] is not None)
        registration_doc_id = response.data['id']

        url = reverse('partners:identification', kwargs={"pk": profile.id})
        payload = {
            'year_establishment': year_establishment,
            'have_gov_doc': True,
            'gov_doc': gov_doc_id,
            'registration_to_operate_in_country': True,
            'registration_doc': registration_doc_id,
            'registration_date': registration_date,
            'registration_comment': 'test comment',
            'registration_number': '123/2016',
        }
        response = self.client.put(url, data=payload, format='json')

        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['year_establishment'], year_establishment)
        self.assertEquals(response.data['registration_date'], registration_date)
        self.assertEquals(response.data['registration_comment'], 'test comment')
        self.assertTrue(response.data['gov_doc'] is not None)
        self.assertTrue(response.data['registration_doc'] is not None)

        response = self.client.get(url, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['registration_date'], registration_date)
        self.assertTrue(response.data['registration_doc'] is not None)

    def test_contact_information(self):
        partner = Partner.objects.first()
        url = reverse('partners:contact-information', kwargs={"pk": partner.id})

        response = self.client.get(url, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        directors = response.data['directors']
        authorised_officers = response.data['authorised_officers']
        working_languages_other = 'PL'
        connectivity_excuse = "test excuse"
        first_name = "Leszek"
        email = "leszek@unicef.org"
        website = 'http://test.pl'
        for director in directors:
            director['first_name'] = first_name
            director['authorized'] = True

        for authorised_officer in authorised_officers:
            authorised_officer['first_name'] = first_name
            authorised_officer['email'] = email

        directors.append({
            'first_name': first_name,
            'last_name': 'Sparow',
            'job_title': 'PM Assistant',
            'authorized': True
        })
        authorised_officers.append({
            'first_name': first_name,
            'last_name': 'Sparow',
            'job_title': 'PM Assistant',
            'telephone': '(123) 234 569',
            'fax': u'(123) 234 566',
            'email': email
        })
        payload = {
            'org_head': {"first_name": first_name, "email": email},
            'mailing_address': {'website': website},
            'connectivity_excuse': connectivity_excuse,
            'working_languages_other': working_languages_other,
            'directors': directors,
            'authorised_officers': authorised_officers,
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['working_languages_other'], working_languages_other)
        self.assertEquals(response.data['connectivity_excuse'], connectivity_excuse)
        # org head can't be changed
        self.assertTrue(response.data['org_head']['first_name'] != first_name)
        self.assertTrue(response.data['org_head']['email'] != email)
        self.assertEquals(response.data['mailing_address']['website'], website)
        self.assertEquals(len(response.data['directors']), len(directors))

        for director in response.data['directors']:
            self.assertEquals(director['first_name'], first_name)
            self.assertEquals(director['authorized'], True)

        authorised_officers = response.data['authorised_officers']
        for authorised_officer in authorised_officers:
            self.assertEquals(authorised_officer['first_name'], first_name)
            self.assertEquals(authorised_officer['email'], email)

        payload = {
            'connectivity_excuse': 'one field to patch'
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['connectivity_excuse'], payload['connectivity_excuse'])
        self.assertEquals(partner.authorised_officers.count(), len(authorised_officers))
        for authorised_officer in partner.authorised_officers.all():
            self.assertEquals(authorised_officer.first_name, first_name)
            self.assertEquals(authorised_officer.email, email)

    def test_mandate_mission(self):
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

        partner = Partner.objects.first()
        url = reverse('partners:mandate-mission', kwargs={"pk": partner.id})

        response = self.client.get(url, format='json')
        self.assertTrue(statuses.is_success(response.status_code))

        comment = "unit test desc"
        experience = PartnerExperience.objects.filter(partner=partner).first()
        point = Point.objects.first()
        location_of_office_old_name = point.admin_level_1.name
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
                'lat': point.lat,
                'lon': point.lon,
                'admin_level_1': {
                    'name': 'location_of_office',
                    'country_code': point.admin_level_1.country_code,
                }
            },
            'location_field_offices': [
                {
                    'id': point.id,
                    'lat': point.lat,
                    'lon': point.lon,
                    'admin_level_1': {
                        'id': point.admin_level_1.id,
                        'name': 'location_of_office',
                        'country_code': point.admin_level_1.country_code,
                    },
                },
            ],
            'governance_organigram': file_id,
            'experiences': [
                {'id': experience.id, 'years': YEARS_OF_EXP_CHOICES.more_10}
            ]
        }

        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['ethic_safeguard_comment'], comment)
        self.assertEquals(response.data['security_desc'], comment)
        self.assertEquals(response.data['ethic_fraud_comment'], comment)
        self.assertTrue(response.data['security_high_risk_locations'])
        self.assertTrue(response.data['security_high_risk_policy'])
        self.assertTrue(response.data['population_of_concern'])
        self.assertEquals(len(response.data['experiences']), 1)
        self.assertEquals(response.data['experiences'][0]['years'], YEARS_OF_EXP_CHOICES.more_10)
        self.assertEquals(len(response.data['location_field_offices']), 1)
        self.assertEquals(response.data['location_field_offices'][0]['id'], point.id)
        self.assertEquals(response.data['location_of_office']['id'], point.id+1)


    def test_funding(self):
        partner = Partner.objects.first()
        url = reverse('partners:funding', kwargs={"pk": partner.id})

        response = self.client.get(url, format='json')
        self.assertTrue(statuses.is_success(response.status_code))

        text = 'test text'
        payload = response.data
        budgets = response.data['budgets']
        for budget in budgets:
            budget['year'] -= 1
        budgets.append({
            'partner': partner.id,
            'year': date.today().year,
            'budget': BUDGET_CHOICES.more,
        })
        payload['budgets'] = budgets
        payload['main_donors_list'] = text
        payload['source_core_funding'] = text

        response = self.client.put(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['main_donors_list'], text)
        self.assertEquals(response.data['source_core_funding'], text)
        self.assertEquals(len(response.data['budgets']), len(budgets))

    def test_collaboration(self):
        partner = Partner.objects.first()
        url = reverse('partners:collaboration', kwargs={"pk": partner.id})

        response = self.client.get(url, format='json')
        self.assertTrue(statuses.is_success(response.status_code))

        text = 'test'
        payload = response.data
        payload['collaboration_evidences'] = [
            {
                "evidence_file_id": CommonFile.objects.first().id,
            }
        ]
        collaborations_partnership = response.data['collaborations_partnership']
        for collaboration_partnership in collaborations_partnership:
            collaboration_partnership['description'] = text
            collaboration_partnership['partner_number'] = text
        payload['partnership_collaborate_institution_desc'] = text
        payload['partnership_collaborate_institution'] = True

        response = self.client.patch(url, data=payload, format='json')

        self.assertTrue(statuses.is_success(response.status_code))
        self.assertTrue(payload['partnership_collaborate_institution'])
        self.assertEquals(response.data['partnership_collaborate_institution_desc'], text)
        for cp in response.data['collaborations_partnership']:
            self.assertEquals(cp['description'], text)
            self.assertEquals(cp['partner_number'], text)

    def test_project_implementation(self):
        partner = Partner.objects.first()
        url = reverse('partners:project-implementation', kwargs={"pk": partner.id})

        response = self.client.get(url, format='json')
        self.assertTrue(statuses.is_success(response.status_code))

        payload = response.data
        del payload['most_recent_audit_report']
        del payload['publish_annual_reports']
        del payload['link_report']
        del payload['assessment_report']
        del payload['report']
        del payload['key_result']
        del payload['last_report']
        text = 'test'
        payload['financial_control_system_desc'] = text
        payload['management_approach_desc'] = text
        payload['comment'] = text

        for internal_control in payload['internal_controls']:
            internal_control['comment'] = text

        response = self.client.patch(url, data=payload, format='json')

        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['financial_control_system_desc'], text)
        self.assertEquals(response.data['management_approach_desc'], text)
        self.assertEquals(response.data['comment'], text)
        for ic in response.data['internal_controls']:
            self.assertEquals(ic['comment'], text)

    def test_other_info(self):
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

        partner = Partner.objects.first()
        url = reverse('partners:other-info', kwargs={"pk": partner.id})

        response = self.client.get(url, format='json')
        self.assertTrue(statuses.is_success(response.status_code))

        text = 'test'
        payload = {
            'info_to_share': text,
            'org_logo': file_id,
            'confirm_data_updated': True,
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertTrue(statuses.is_success(response.status_code))
        self.assertEquals(response.data['info_to_share'], text)
        self.assertTrue(response.data['org_logo'] is not None)

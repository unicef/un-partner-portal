# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os

from django.urls import reverse
from django.conf import settings
from rest_framework import status as statuses

from partner.models import Partner, PartnerProfile
from common.tests.base import BaseAPITestCase
from common.factories import (
    AgencyFactory,
    UserFactory,
    PartnerFactory,
    OtherAgencyFactory,
)
from common.consts import (
    MEMBER_ROLES,
)


class TestPartnerDetailAPITestCase(BaseAPITestCase):

    quantity = 1
    initial_factories = [
        OtherAgencyFactory,
        AgencyFactory,
        UserFactory,
        PartnerFactory,
    ]

    def test_identification(self):
        profile = PartnerProfile.objects.first()
        year_establishment = 2015
        registration_date = '2016-01-01'
        url = reverse('partners:identification', kwargs={"pk": profile.id})
        filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.csv')
        with open(filename) as gov_doc:
            with open(filename) as registration_doc:
                payload = {
                    'year_establishment': year_establishment,
                    'have_gov_doc': True,
                    'gov_doc': gov_doc,
                    'registration_to_operate_in_country': True,
                    'registration_doc': registration_doc,
                    'registration_date': registration_date,
                    'registration_comment': 'test comment',
                    'registration_number': '123/2016',
                }
                response = self.client.put(url, data=payload, format='multipart')

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

        for authorised_officer in response.data['authorised_officers']:
            self.assertEquals(authorised_officer['first_name'], first_name)
            self.assertEquals(authorised_officer['email'], email)

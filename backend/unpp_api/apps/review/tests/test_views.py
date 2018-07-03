# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from typing import List
import mock
from django.core.management import call_command
from django.urls import reverse

from rest_framework import status

from account.models import User
from agency.roles import AgencyRole
from common.consts import FLAG_TYPES, PARTNER_TYPES, SANCTION_LIST_TYPES, INTERNAL_FLAG_CATEGORIES, FLAG_CATEGORIES
from common.tests.base import BaseAPITestCase
from common.factories import (
    PartnerSimpleFactory,
    PartnerFlagFactory,
    PartnerVerificationFactory,
    AgencyOfficeFactory,
    AgencyMemberFactory,
    PartnerMemberFactory, PartnerFactory)
from partner.models import Partner
from review.models import PartnerFlag
from sanctionslist.models import SanctionedItem, SanctionedName


class TestPartnerFlagAPITestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    def test_create_flag(self):
        partner = PartnerSimpleFactory(country_code=self.user.agency_members.first().office.country.code)

        url = reverse(
            'partner-reviews:flags', kwargs={"partner_id": partner.id}
        )

        payload = {
            "comment": "This is a comment on a flag",
            "flag_type": FLAG_TYPES.yellow,
            "contact_email": "test@test.com",
            "contact_person": "Nancy",
            "contact_phone": "Smith"
        }

        response = self.client.post(url, data=payload, format='json')
        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
        self.assertEquals(response.data['submitter']['name'], self.user.get_fullname())
        self.assertEquals(response.data['flag_type'], FLAG_TYPES.yellow)
        self.assertEquals(response.data['is_valid'], True)
        self.assertEquals(response.data['comment'], payload['comment'])

    def test_create_observation(self):
        partner = PartnerSimpleFactory(country_code=self.user.agency_members.first().office.country.code)

        url = reverse(
            'partner-reviews:flags', kwargs={"partner_id": partner.id}
        )

        payload = {
            "comment": "This is an observation",
            "flag_type": FLAG_TYPES.observation,
            "contact_email": "test@test.com",
            "contact_person": "Nancy",
            "contact_phone": "Smith"
        }

        response = self.client.post(url, data=payload, format='json')
        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
        self.assertEquals(response.data['submitter']['name'], self.user.get_fullname())
        self.assertEquals(response.data['flag_type'], FLAG_TYPES.observation)
        self.assertEquals(response.data['comment'], payload['comment'])

    def test_patch_flag(self):
        flag = PartnerFlagFactory(is_valid=True)
        # Change valid status
        url = reverse('partner-reviews:flag-details', kwargs={"partner_id": flag.partner.id, 'pk': flag.id})
        payload = {
            'is_valid': False,
            'invalidation_comment': 'comment',
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertResponseStatusIs(response, status.HTTP_200_OK)
        self.assertEquals(response.data['is_valid'], False)

        # Attempt to modify data. Should not change comment
        flag_comment = flag.comment
        url = reverse('partner-reviews:flag-details', kwargs={"partner_id": flag.partner.id, 'pk': flag.id})
        payload = {
            'comment': "%s - Appended" % flag_comment
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertResponseStatusIs(response, status.HTTP_200_OK)
        self.assertEquals(response.data['comment'], flag_comment)

    def test_create_invalid_flag(self):
        partner = PartnerSimpleFactory(country_code=self.user.agency_members.first().office.country.code)

        url = reverse(
            'partner-reviews:flags', kwargs={"partner_id": partner.id}
        )

        payload = {
            "comment": "This is a comment on a flag",
            "category": 'INVASDASDAD',
            "contact_email": "test@test.com",
            "contact_person": "Nancy",
            "contact_phone": "Smith"
        }

        response = self.client.post(url, data=payload, format='json')
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)
        self.assertIn('category', response.data)

        payload['category'] = INTERNAL_FLAG_CATEGORIES.sanctions_match

        response = self.client.post(url, data=payload, format='json')
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)
        self.assertIn('category', response.data)

        payload['flag_type'] = FLAG_TYPES.yellow
        payload['is_valid'] = None

        response = self.client.post(url, data=payload, format='json')
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)
        self.assertIn('is_valid', response.data)

    def test_flag_type_history_is_saved(self):
        flag = PartnerFlagFactory(is_valid=True)
        original_type = flag.flag_type
        url = reverse('partner-reviews:flag-details', kwargs={"partner_id": flag.partner.id, 'pk': flag.id})
        payload = {
            'flag_type': FLAG_TYPES.escalated
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertResponseStatusIs(response)
        flag.refresh_from_db()
        self.assertIn(original_type, flag.type_history)

    def test_cant_add_red_flag(self):
        flag = PartnerFlagFactory()
        url = reverse('partner-reviews:flag-details', kwargs={"partner_id": flag.partner.id, 'pk': flag.id})
        payload = {
            'flag_type': FLAG_TYPES.red
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertResponseStatusIs(response, status.HTTP_403_FORBIDDEN)

    def test_escalation_flow(self):
        payload = {
            "comment": "This is a comment on a flag",
            "flag_type": FLAG_TYPES.yellow,
            "contact_email": "test@test.com",
            "contact_person": "Nancy",
            "contact_phone": "Smith"
        }

        hq_editor = AgencyMemberFactory(
            office=self.user.agency_members.first().office,
            role=AgencyRole.HQ_EDITOR.name
        )

        for is_valid in (True, False):
            partner = PartnerSimpleFactory(country_code=self.user.agency_members.first().office.country.code)

            create_url = reverse('partner-reviews:flags', kwargs={"partner_id": partner.id})
            response = self.client.post(create_url, data=payload)
            self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
            flag_url = reverse(
                'partner-reviews:flag-details', kwargs={"partner_id": partner.id, 'pk': response.data['id']}
            )
            patch_response = self.client.patch(flag_url, data={
                'flag_type': FLAG_TYPES.escalated
            })
            self.assertResponseStatusIs(patch_response)
            self.assertEqual(patch_response.data['flag_type'], FLAG_TYPES.escalated)
            self.assertEqual(patch_response.data['is_valid'], None)

            patch_response = self.client.patch(flag_url, data={
                'is_valid': is_valid,
                'invalidation_comment': 'comment',
            })
            self.assertResponseStatusIs(patch_response, status.HTTP_403_FORBIDDEN)

            self.client.logout()
            self.client.force_login(hq_editor.user)

            patch_response = self.client.patch(flag_url, data={
                'is_valid': is_valid,
                'invalidation_comment': 'comment',
            })
            self.assertResponseStatusIs(patch_response, status.HTTP_200_OK)
            self.assertEqual(patch_response.data['flag_type'], FLAG_TYPES.red if is_valid else FLAG_TYPES.yellow)
            self.assertFalse(patch_response.data['can_be_escalated'])

            self.client.logout()
            self.client.force_login(self.user)
            partner.refresh_from_db()
            self.assertTrue(sum(partner.flagging_status.values()) > 0)
            self.assertEqual(partner.is_locked, is_valid)

    def test_listing_flags(self):
        partner: Partner = PartnerFactory()

        # My observations filter
        my_flags: List[PartnerFlag] = PartnerFlagFactory.create_batch(3, partner=partner, submitter=self.user)
        other_user = PartnerMemberFactory().user
        other_ppl_flags: List[PartnerFlag] = PartnerFlagFactory.create_batch(3, partner=partner, submitter=other_user)
        all_flags = my_flags + other_ppl_flags

        list_url = reverse('partner-reviews:flags', kwargs={"partner_id": partner.pk})
        list_response = self.client.get(list_url)
        self.assertResponseStatusIs(list_response)
        self.assertEqual(list_response.data['count'], len(all_flags))

        my_flags_response = self.client.get(list_url + '?only_mine=True')
        self.assertResponseStatusIs(my_flags_response)
        self.assertEqual(my_flags_response.data['count'], len(my_flags))

        partner.flags.all().delete()

        # Type filter
        observation_flags: List[PartnerFlag] = PartnerFlagFactory.create_batch(
            5, partner=partner, flag_type=FLAG_TYPES.observation
        )
        yellow_flags: List[PartnerFlag] = PartnerFlagFactory.create_batch(
            7, partner=partner, flag_type=FLAG_TYPES.yellow
        )

        observation_flags_response = self.client.get(list_url + f'?flag_type={FLAG_TYPES.observation}')
        self.assertResponseStatusIs(observation_flags_response)
        self.assertEqual(observation_flags_response.data['count'], len(observation_flags))

        yellow_flags_response = self.client.get(list_url + f'?flag_type={FLAG_TYPES.yellow}')
        self.assertResponseStatusIs(yellow_flags_response)
        self.assertEqual(yellow_flags_response.data['count'], len(yellow_flags))

        partner.flags.all().delete()

        # Category filter
        fraud_and_corruption_flags: List[PartnerFlag] = PartnerFlagFactory.create_batch(
            5, partner=partner, category=FLAG_CATEGORIES.fraud_and_corruption
        )
        sex_abuse_flags: List[PartnerFlag] = PartnerFlagFactory.create_batch(
            7, partner=partner, category=FLAG_CATEGORIES.sex_abuse
        )

        fraud_and_corruption_flags_response = self.client.get(
            list_url + f'?category={FLAG_CATEGORIES.fraud_and_corruption}'
        )
        self.assertResponseStatusIs(fraud_and_corruption_flags_response)
        self.assertEqual(fraud_and_corruption_flags_response.data['count'], len(fraud_and_corruption_flags))

        sex_abuse_flags_response = self.client.get(list_url + f'?category={FLAG_CATEGORIES.sex_abuse}')
        self.assertResponseStatusIs(sex_abuse_flags_response)
        self.assertEqual(sex_abuse_flags_response.data['count'], len(sex_abuse_flags))


class TestPartnerVerificationAPITestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.HQ_EDITOR

    def setUp(self):
        super(TestPartnerVerificationAPITestCase, self).setUp()
        AgencyOfficeFactory.create_batch(self.quantity)
        PartnerSimpleFactory.create_batch(self.quantity)
        PartnerVerificationFactory.create_batch(self.quantity)

    def test_verification_create(self):
        partner = Partner.objects.first()

        url = reverse('partner-reviews:verifications', kwargs={"partner_id": partner.id})

        payload = {
            "is_mm_consistent": True,
            "is_indicate_results": True,
            "cert_uploaded_comment": "Comment",
            "indicate_results_comment": "Comment",
            "yellow_flag_comment": "Comment",
            "mm_consistent_comment": "Comment",
            "is_cert_uploaded": True,
            "rep_risk_comment": "Comment",
            "is_yellow_flag": False,
            "is_rep_risk": False
        }
        # Test Verified Status
        response = self.client.post(url, data=payload, format='json')
        self.assertResponseStatusIs(response, status_code=status.HTTP_400_BAD_REQUEST)

        with mock.patch('partner.models.Partner.profile_is_complete', lambda: True):
            response = self.client.post(url, data=payload, format='json')
            self.assertResponseStatusIs(response, status_code=status.HTTP_201_CREATED)
            self.assertEquals(response.data['is_verified'], True)

            # Test Unverified status
            payload['is_rep_risk'] = True
            response = self.client.post(url, data=payload, format='json')
            self.assertEquals(response.data['is_verified'], False)


class TestRegisterSanctionedPartnerTestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.HQ_EDITOR

    def setUp(self):
        super(TestRegisterSanctionedPartnerTestCase, self).setUp()
        self.client.logout()
        self.email = "test@myorg.org"
        self.data = {
            "partner": {
                "legal_name": "My org legal name",
                "country_code": "PL",
                "display_type": PARTNER_TYPES.international,
            },
            "user": {
                "email": self.email,
                "password": "Test123!",
                "fullname": "Leszek Orzeszek",
            },
            "partner_profile": {
                "alias_name": "Name Inc.",
                "acronym": "N1",
                "legal_name_change": True,
                "former_legal_name": "Former Legal Name Inc.",
            },
            "partner_head_organization": {
                "fullname": "Jack Orzeszek",
                "email": "captain@blackpearl.org",
            },
            "partner_member": {
                "title": "Project Manager",
            },
        }

    def test_register_sanctioned_partner(self):
        item_inst, _ = SanctionedItem.objects.update_or_create(
            sanctioned_type=SANCTION_LIST_TYPES.entity,
            data_id=123456,
        )
        SanctionedName.objects.get_or_create(item=item_inst, name=self.data['partner']['legal_name'])
        url = reverse('accounts:registration')
        response = self.client.post(url, data=self.data)
        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
        partner = Partner.objects.get(id=response.data['partner']['id'])
        self.assertTrue(partner.has_sanction_match)
        flag = partner.flags.filter(category=INTERNAL_FLAG_CATEGORIES.sanctions_match).first()
        self.assertIsNotNone(flag)

        self.client.force_login(self.user)
        flag_url = reverse('partner-reviews:flag-details', kwargs={"partner_id": flag.partner.id, 'pk': flag.id})
        flag_response = self.client.get(flag_url)
        self.assertResponseStatusIs(flag_response)

        payload = {
            'is_valid': False,
            'invalidation_comment': 'comment',
        }
        response = self.client.patch(flag_url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_200_OK)
        self.assertFalse(response.data['is_valid'])
        partner.refresh_from_db()
        self.assertFalse(partner.is_locked)
        self.assertFalse(partner.has_sanction_match)

        payload = {
            'is_valid': True
        }
        response = self.client.patch(flag_url, data=payload)
        self.assertResponseStatusIs(response, status.HTTP_200_OK)
        self.assertTrue(response.data['is_valid'])
        partner.refresh_from_db()
        self.assertTrue(partner.is_locked)
        self.assertTrue(partner.has_sanction_match)

        self.client.logout()
        partner_member = PartnerMemberFactory(partner=partner)
        user: User = partner_member.user
        password = 'testing1235'
        user.set_password(password)
        user.save()

        login_url = reverse('rest_login')
        response = self.client.post(login_url, data={
            'email': user.email,
            'password': password,
        })
        self.assertResponseStatusIs(response, status.HTTP_400_BAD_REQUEST)

    def test_matches_dont_duplicate(self):
        item_inst, _ = SanctionedItem.objects.update_or_create(
            sanctioned_type=SANCTION_LIST_TYPES.entity,
            data_id=123456,
        )
        SanctionedName.objects.get_or_create(item=item_inst, name=self.data['partner']['legal_name'])
        url = reverse('accounts:registration')
        response = self.client.post(url, data=self.data, format='json')
        self.assertResponseStatusIs(response, status.HTTP_201_CREATED)
        partner = Partner.objects.get(id=response.data['partner']['id'])
        self.assertTrue(partner.has_sanction_match)
        partner_sanction_flags = partner.flags.filter(category=INTERNAL_FLAG_CATEGORIES.sanctions_match)
        flag = partner_sanction_flags.first()
        self.assertIsNotNone(flag)

        flag_count_before = partner_sanction_flags.count()
        call_command('sanctions_list_match_scan')
        self.assertEqual(partner_sanction_flags.count(), flag_count_before)

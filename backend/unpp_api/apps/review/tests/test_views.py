# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.urls import reverse

from rest_framework import status

from agency.roles import AgencyRole
from common.consts import FLAG_TYPES
from common.tests.base import BaseAPITestCase
from common.factories import PartnerSimpleFactory, PartnerFlagFactory, PartnerVerificationFactory, AgencyOfficeFactory
from partner.models import Partner
from review.models import PartnerFlag, PartnerVerification


class TestPartnerFlagAPITestCase(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.HQ_EDITOR

    def setUp(self):
        super(TestPartnerFlagAPITestCase, self).setUp()
        AgencyOfficeFactory.create_batch(self.quantity)
        PartnerSimpleFactory.create_batch(self.quantity)
        PartnerFlagFactory.create_batch(self.quantity)

    def test_create_flag(self):
        partner = Partner.objects.first()

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

    def test_patch_flag(self):
        flag = PartnerFlag.objects.filter(is_valid=True).first()
        # Change valid status
        url = reverse('partner-reviews:flags-detail', kwargs={"partner_id": flag.partner.id, 'pk': flag.id})
        payload = {
            'is_valid': False
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertResponseStatusIs(response, status.HTTP_200_OK)
        self.assertEquals(response.data['is_valid'], False)

        # Attempt to modify data. Should not change comment
        flag_comment = flag.comment
        url = reverse('partner-reviews:flags-detail', kwargs={"partner_id": flag.partner.id, 'pk': flag.id})
        payload = {
            'comment': "%s - Appended" % flag_comment
        }
        response = self.client.patch(url, data=payload, format='json')
        self.assertResponseStatusIs(response, status.HTTP_200_OK)
        self.assertEquals(response.data['comment'], flag_comment)


class TestPartnerVerificationAPITestCase(BaseAPITestCase):

    def setUp(self):
        super(TestPartnerVerificationAPITestCase, self).setUp()
        AgencyOfficeFactory.create_batch(self.quantity)
        PartnerSimpleFactory.create_batch(self.quantity)
        PartnerVerificationFactory.create_batch(self.quantity)

    def test_verification_create(self):
        partner = Partner.objects.first()

        url = reverse('partner-reviews:verifications',
                      kwargs={"partner_id": partner.id})

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
        self.assertEquals(response.data['is_verified'], True)

        # Test Unverified status
        payload['is_rep_risk'] = True
        response = self.client.post(url, data=payload, format='json')
        self.assertEquals(response.data['is_verified'], False)

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from datetime import date
from django.urls import reverse

from agency.roles import AgencyRole
from common.tests.base import BaseAPITestCase
from common.factories import (
    OpenEOIFactory,
    AgencyMemberFactory,
    PartnerSimpleFactory,
    AgencyOfficeFactory,
    PartnerFactory,
    UserFactory,
    UnsolicitedFactory,
    DirectEOIFactory,
)
from project.models import Assessment, Application


class TestAgencyDashboardAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    quantity = 10

    def setUp(self):
        super(TestAgencyDashboardAPIView, self).setUp()
        PartnerSimpleFactory.create_batch(self.quantity)
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        OpenEOIFactory.create_batch(self.quantity)

    def test_get(self):
        url = reverse('dashboard:main')
        read_response = self.client.get(url, format='json')
        self.assertResponseStatusIs(read_response)


class TestPartnerDashboardAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_PARTNER
    quantity = 10

    def setUp(self):
        super(TestPartnerDashboardAPIView, self).setUp()
        PartnerSimpleFactory.create_batch(self.quantity)
        AgencyOfficeFactory.create_batch(self.quantity)
        AgencyMemberFactory.create_batch(self.quantity)
        OpenEOIFactory.create_batch(self.quantity)

    def test_get(self):
        url = reverse('dashboard:main')
        read_response = self.client.get(url, format='json')
        self.assertResponseStatusIs(read_response)


class TestApplicationsToScoreListAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    def test_get(self):
        url = reverse('dashboard:applications-to-score')
        read_response = self.client.get(url, format='json')
        self.assertResponseStatusIs(read_response)
        self.assertEqual(read_response.data['count'], 0)

        PartnerFactory()
        cfeis = OpenEOIFactory.create_batch(10)
        Assessment.objects.filter(reviewer=self.user).delete()
        for cfei in cfeis:
            cfei.reviewers.add(self.user)

        read_response = self.client.get(url, format='json')
        self.assertResponseStatusIs(read_response)
        self.assertEqual(read_response.data['count'], 10)


class TestCurrentUsersOpenProjectsAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    def test_get(self):
        url = reverse('dashboard:open-projects')
        read_response = self.client.get(url, format='json')
        self.assertResponseStatusIs(read_response)
        self.assertEqual(read_response.data['count'], 0)

        OpenEOIFactory.create_batch(5, created_by=self.user)
        not_created_by_user_cfeis = OpenEOIFactory.create_batch(5, created_by=UserFactory())

        for cfei in not_created_by_user_cfeis:
            cfei.focal_points.clear()

        read_response = self.client.get(url, format='json')
        self.assertResponseStatusIs(read_response)
        self.assertEqual(read_response.data['count'], 5)

        for cfei in not_created_by_user_cfeis:
            cfei.focal_points.add(self.user)

        read_response = self.client.get(url, format='json')
        self.assertResponseStatusIs(read_response)
        self.assertEqual(read_response.data['count'], 10)


class TestApplicationsPartnerDecisionsListAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED

    def test_get(self):
        url = reverse('dashboard:applications-decisions')
        read_response = self.client.get(url, format='json')
        self.assertResponseStatusIs(read_response)
        self.assertEqual(read_response.data['count'], 0)

        cfeis = OpenEOIFactory.create_batch(5, created_by=self.user, agency=self.user.agency)
        applications = Application.objects.filter(eoi__in=cfeis)
        applications.update(
            did_win=True,
            did_accept=True,
            decision_date=date.today()
        )

        read_response = self.client.get(url, format='json')
        self.assertResponseStatusIs(read_response)
        self.assertEqual(read_response.data['count'], applications.count())


class TestSubmittedCNListAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_PARTNER

    def test_get(self):
        url = reverse('dashboard:submitted-cn')
        read_response = self.client.get(url, format='json')
        self.assertResponseStatusIs(read_response)
        self.assertEqual(read_response.data['count'], 0)

        UnsolicitedFactory.create_batch(10, partner=self.user.partner_members.first().partner)

        read_response = self.client.get(url, format='json')
        self.assertResponseStatusIs(read_response)
        self.assertEqual(read_response.data['count'], 10)


class TestPendingOffersListAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_PARTNER

    def test_get(self):
        url = reverse('dashboard:pending-offers')
        read_response = self.client.get(url, format='json')
        self.assertResponseStatusIs(read_response)
        self.assertEqual(read_response.data['count'], 0)

        DirectEOIFactory.create_batch(10)
        Application.objects.update(
            partner=self.user.partner_members.first().partner,
            did_win=True,
            did_accept=False,
            did_withdraw=False,
            decision_date=None,
            did_decline=False,
        )

        read_response = self.client.get(url, format='json')
        self.assertResponseStatusIs(read_response)
        self.assertEqual(read_response.data['count'], 10)

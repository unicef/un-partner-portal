from django.core.management import call_command
from django.test import TestCase
from django.urls import reverse

from agency.roles import AgencyRole
from common.tests.base import BaseAPITestCase
from rest_framework import status


class TestGeneralConfigAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.ADMINISTRATOR

    def test_view(self):
        url = reverse('config:general-config')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TestAPISwaggerView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.ADMINISTRATOR

    def test_view(self):
        response = self.client.get('/api/doc/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class MigrationTestCase(TestCase):

    def test_all_changes_migrated(self):
        """
        Fail if there are changes in the models not reflected in migrations
        """
        call_command('makemigrations', check=True, dry_run=True)

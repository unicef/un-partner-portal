from __future__ import unicode_literals
import os
from django.conf import settings
from rest_framework import status
from rest_framework.test import APITestCase, APIClient

from account.models import User
from agency.roles import AgencyRole, AGENCY_ROLE_PERMISSIONS
from common.factories import (
    PartnerSimpleFactory, PartnerMemberFactory, AgencyFactory, AgencyOfficeFactory, AgencyMemberFactory
)
from common.headers import CustomHeader
from partner.roles import PartnerRole


class CustomTestAPIClient(APIClient):

    headers = {}

    def generic(self, *args, **kwargs):
        kwargs.update(self.headers)
        return super(CustomTestAPIClient, self).generic(*args, **kwargs)

    def set_headers(self, kwargs):
        self.headers.update(kwargs)

    def clean_headers(self):
        self.headers.clear()

    def _login(self, user: User, backend=None):
        if user.is_partner_user:
            self.set_headers({
                CustomHeader.PARTNER_ID.value: user.partner_members.first().partner_id
            })
        elif user.is_agency_user:
            self.set_headers({
                CustomHeader.AGENCY_OFFICE_ID.value: user.agency_members.first().office_id
            })
        super(CustomTestAPIClient, self)._login(user, backend=backend)

    def logout(self):
        self.clean_headers()
        super(CustomTestAPIClient, self).logout()


class BaseAPITestCase(APITestCase):
    """
    Base class for all api test case with generated fake data.
    """

    client_class = CustomTestAPIClient

    USER_AGENCY = 'agency'
    USER_PARTNER = 'partner'

    fixtures = [
        os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'fixtures', 'initial.json'),
    ]
    with_session_login = True
    user_type = USER_PARTNER

    partner_role = PartnerRole.ADMIN
    agency_role = AgencyRole.ADMINISTRATOR

    initial_factories = [AgencyFactory, AgencyOfficeFactory, PartnerSimpleFactory]
    quantity = 1

    def setUp(self):
        super(BaseAPITestCase, self).setUp()
        assert self.user_type in [self.USER_AGENCY, self.USER_PARTNER], "User type can be only agency or partner."

        for factory in self.initial_factories:
            factory.create_batch(self.quantity)

        if self.user_type == self.USER_PARTNER:
            self.user = PartnerMemberFactory(role=self.partner_role.name).user
        elif self.user_type == self.USER_AGENCY:
            self.user = AgencyMemberFactory(role=self.agency_role.name).user

        if self.with_session_login:
            self.client = self.client_class()
            self.client.login(email=self.user.email, password='test')

    def set_current_user_role(self, role):
        if self.user_type == self.USER_PARTNER:
            self.user.partner_members.update(role=role)
        elif self.user_type == self.USER_AGENCY:
            self.user.agency_members.update(role=role)

    def get_agency_with_and_without_permissions(self, agency_permission):
        roles_with_permission = []
        roles_without_permission = []

        for role, permission_set in AGENCY_ROLE_PERMISSIONS.items():
            if agency_permission in permission_set:
                roles_with_permission.append(role)
            else:
                roles_without_permission.append(role)

        return roles_with_permission, roles_without_permission

    def assertResponseStatusIs(self, response, status_code=status.HTTP_200_OK, msg=None):
        return self.assertEqual(response.status_code, status_code, msg=msg or getattr(response, 'data', None))

    def tearDown(self):
        self.client.clean_headers()

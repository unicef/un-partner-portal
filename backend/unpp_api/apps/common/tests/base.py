from __future__ import unicode_literals
import os
from django.conf import settings
from rest_framework.test import APITestCase, APIClient

from agency.roles import AgencyRole
from common.factories import (
    PartnerSimpleFactory, PartnerMemberFactory, AgencyFactory, AgencyOfficeFactory, AgencyMemberFactory
)
from partner.roles import PartnerRole


class BaseAPITestCase(APITestCase):
    """
    Base class for all api test case with generated fake data.
    """

    USER_AGENCY = 'agency'
    USER_PARTNER = 'partner'

    fixtures = [os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'fixtures', 'initial.json'), ]
    client_class = APIClient
    with_session_login = True
    user_type = USER_PARTNER

    partner_role = PartnerRole.ADMIN
    agency_role = AgencyRole.ADMINISTRATOR

    initial_factories = [AgencyFactory, AgencyOfficeFactory, PartnerSimpleFactory]
    quantity = 1

    def setUp(self):
        assert self.user_type in [self.USER_AGENCY, self.USER_PARTNER], "User type can be only agency or partner."

        for factory in self.initial_factories:
            factory.create_batch(self.quantity)

        if self.user_type == self.USER_PARTNER:
            self.user = PartnerMemberFactory.create_batch(1, role=self.partner_role.name)[0].user
        elif self.user_type == self.USER_AGENCY:
            self.user = AgencyMemberFactory.create_batch(1, role=self.agency_role.name)[0].user

        # creating a session (login already created user in generate_fake_data)
        if self.with_session_login:
            self.client = self.client_class()
            self.client.login(email=self.user.email, password='test')

    def set_current_user_role(self, role):
        if self.user_type == self.USER_PARTNER:
            self.user.partner_members.update(role=role)
        elif self.user_type == self.USER_AGENCY:
            self.user.agency_members.update(role=role)

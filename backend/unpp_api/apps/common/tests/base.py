from __future__ import unicode_literals
import os
from django.conf import settings
from rest_framework.test import APITestCase, APIClient
from account.models import User
from ..factories import PartnerSimpleFactory, PartnerMemberFactory, AgencyMemberFactory, AgencyFactory


class BaseAPITestCase(APITestCase):
    """
    Base class for all api test case with generated fake data.
    """

    fixtures = [os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'fixtures', 'initial.json'), ]
    client_class = APIClient
    with_session_login = True
    user_type = 'partner'  # or agency

    def setUp(self):
        assert self.user_type in ['agency', 'partner'], "User type can be only agency or partner."
        AgencyFactory.create_batch(1)
        PartnerSimpleFactory.create_batch(1)
        if self.user_type == 'partner':
            PartnerMemberFactory.create_batch(1)
        elif self.user_type == 'agency':
            AgencyMemberFactory.create_batch(1)

        # creating a session (login already created user in generate_fake_data)
        if self.with_session_login:
            self.client = self.client_class()
            self.user = User.objects.first()
            self.client.login(username=self.user.username, password='test')

from __future__ import absolute_import
from .base import *  # noqa: ignore=F403


# dev overrides
DEBUG = False
IS_STAGING = False
FRONTEND_URL = 'http://unpp.tivixlabs.com/'

extend_list_avoid_repeats(INSTALLED_APPS, [
    'rest_framework_swagger',
])

DEFAULT_FROM_EMAIL = 'noreply@unpp.org'

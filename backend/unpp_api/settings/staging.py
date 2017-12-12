from __future__ import absolute_import
from .base import *  # noqa: ignore=F403


# dev overrides
DEBUG = True
IS_STAGING = True
FRONTEND_URL = 'http://unpp-stage.tivixlabs.com/'

extend_list_avoid_repeats(INSTALLED_APPS, [
    'rest_framework_swagger',
])


EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# extend MIDDLEWARE's
MIDDLEWARE.append('silk.middleware.SilkyMiddleware')

# extend INSTALLED_APPS
INSTALLED_APPS.append('silk')

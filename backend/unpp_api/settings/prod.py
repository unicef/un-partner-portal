from __future__ import absolute_import
from .base import *  # noqa: ignore=F403


# dev overrides
DEBUG = False
IS_STAGING = False
FRONTEND_URL = 'http://unpp.tivixlabs.com/'

extend_list_avoid_repeats(INSTALLED_APPS, [
    'rest_framework_swagger',
])

# Sendgrid stuff
EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = True

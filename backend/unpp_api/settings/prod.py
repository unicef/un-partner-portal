from __future__ import absolute_import
from .base import *  # noqa: ignore=F403


# dev overrides
DEBUG = False
IS_STAGING = False

extend_list_avoid_repeats(INSTALLED_APPS, [
    'rest_framework_swagger',
])

DEFAULT_FROM_EMAIL = 'noreply@unpp.org'

# Sentry Configs
INSTALLED_APPS += (
    'raven.contrib.django.raven_compat',
)

RAVEN_CONFIG = {
    'dsn': os.environ.get('SENTRY_DSN'),
}

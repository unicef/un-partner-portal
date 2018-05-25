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

# django-storages: https://django-storages.readthedocs.io/en/latest/backends/azure.html
AZURE_ACCOUNT_NAME = os.environ.get('AZURE_ACCOUNT_NAME', None)  # noqa: F405
AZURE_ACCOUNT_KEY = os.environ.get('AZURE_ACCOUNT_KEY', None)  # noqa: F405
AZURE_CONTAINER = os.environ.get('AZURE_CONTAINER', None)  # noqa: F405
AZURE_SSL = True
AZURE_AUTO_SIGN = True  # flag for automatically signing urls
AZURE_ACCESS_POLICY_EXPIRY = 10800  # length of time before signature expires in seconds
AZURE_ACCESS_POLICY_PERMISSION = 'r'  # read permission

if AZURE_ACCOUNT_NAME and AZURE_ACCOUNT_KEY and AZURE_CONTAINER:
    DEFAULT_FILE_STORAGE = 'storages.backends.azure_storage.AzureStorage'

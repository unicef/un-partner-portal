from __future__ import absolute_import
from .base import *  # noqa: ignore=F403


# dev overrides
DEBUG = True
# TEMPLATE_DEBUG = DEBUG
IS_DEV = True

# domains/hosts etc.
DOMAIN_NAME = 'localhost:8000'
WWW_ROOT = 'http://%s/' % DOMAIN_NAME
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "10.0.2.2"]
FRONTEND_URL = 'http://127.0.0.1:8080/'

# other
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'TIMEOUT': 1800,
    }
}

# change logging level to debug
LOGGING['loggers']['']['level'] = 'DEBUG'
LOGGING['loggers']['django.request']['level'] = 'DEBUG'
LOGGING['handlers']['default']['class'] = 'common.utils.DeferredRotatingFileHandler'
LOGGING['handlers']['default']['filename'] = 'django.log'  # Full path is created by DeferredRotatingFileHandler.

extend_list_avoid_repeats(INSTALLED_APPS, [
    'django_extensions',
    'rest_framework_swagger',
])

try:
    from .local import *  # noqa: ignore=F403
except ImportError:
    pass

from __future__ import absolute_import
from .base import *  # noqa: ignore=F403


# dev overrides
DEBUG = True
IS_DEV = True
TEMPLATES[0]['OPTIONS']['debug'] = True

# domains/hosts etc.
DOMAIN_NAME = 'localhost:8000'
WWW_ROOT = 'http://%s/' % DOMAIN_NAME
ALLOWED_HOSTS = ["localhost", "127.0.0.1", "10.0.2.2"]

# other
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'


CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'TIMEOUT': 1800,
    }
}

# change logging level to debug
LOGGING['loggers']['django.request']['level'] = 'DEBUG'

extend_list_avoid_repeats(INSTALLED_APPS, [
    'django_extensions',
    'rest_framework_swagger',
])

try:
    from .local import *  # noqa: ignore=F403
except ImportError:
    pass

STATIC_URL = '/api/static/'
STATICFILES_DIR = [
    # os.path.join(BASE_DIR, "static"),
    # "/home/jojo/workspace/unpp/backend/unpp_api/static",
]
STATIC_ROOT = "/home/jojo/workspace/unpp/backend/unpp_api/static"


print(111, STATICFILES_DIR)

BASE = os.path.abspath(os.path.dirname(__name__))
STATICFILES_DIRS = (os.path.join(BASE, "static"),)
print(222, BASE)
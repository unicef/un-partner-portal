from __future__ import absolute_import
from .base import *  # noqa: ignore=F403


# dev overrides
DEBUG = True
# TEMPLATE_DEBUG = DEBUG
IS_DEV = True

MEDIA_ROOT = os.path.join(BASE_DIR, '%s' % UPLOADS_DIR_NAME)
STATIC_ROOT = '%s/staticserve' % BASE_DIR

COMPRESS = False
# COMPRESS = True   # so we can test compressor locally. setting debug=False leads to other url / static serving issues.

# domains/hosts etc.
DOMAIN_NAME = 'localhost:8000'
WWW_ROOT = 'http://%s/' % DOMAIN_NAME
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

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

extend_list_avoid_repeats(INSTALLED_APPS, [
    'django_extensions',
    'rest_framework_swagger',
])

try:
    from .local import *  # noqa: ignore=F403
except ImportError:
    pass

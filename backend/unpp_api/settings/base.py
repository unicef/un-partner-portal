from __future__ import absolute_import
import os
import sys


####
# Change per project
####
PROJECT_NAME = 'unpp_api'
# project root and add "apps" to the path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(PROJECT_ROOT, 'apps/'))

####
# Other settings
####
ADMINS = (
    ('Alerts', 'dev@unpp_api.com'),
)
SITE_ID = 1
TIME_ZONE = 'America/Los_Angeles'  # changed to UTC
LANGUAGE_CODE = 'en-us'
USE_I18N = True
SECRET_KEY = '7mtv%enh%j6v23jl*y2kf!@@@=uj1x1e2yb^dpkr3l83s&amp;_7+_'
DEFAULT_CHARSET = 'utf-8'
ROOT_URLCONF = 'unpp_api.urls'

DATA_VOLUME = '/data'

UPLOADS_DIR_NAME = 'uploads'
MEDIA_URL = '/%s/' % UPLOADS_DIR_NAME
MEDIA_ROOT = os.path.join(DATA_VOLUME, '%s' % UPLOADS_DIR_NAME)

FILE_UPLOAD_MAX_MEMORY_SIZE = 4194304  # 4mb


# static resources related. See documentation at: http://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/
STATIC_URL = '/api/static/'
STATIC_ROOT = '%s/staticserve' % DATA_VOLUME
# STATICFILES_DIRS = (
#     ('global', '%s/static' % PROJECT_ROOT),
# )

# static serving
STATICFILES_FINDERS = (
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",

    # other finders..
    "compressor.finders.CompressorFinder",
)

DEBUG = True
IS_DEV = False
IS_STAGING = False
IS_PROD = False

# Get the ENV setting. Needs to be set in .bashrc or similar.
ENV = os.getenv('ENV')
if not ENV:
    raise Exception('Environment variable ENV is required!')

# domains/hosts etc.
DOMAIN_NAME = os.getenv('DJANGO_ALLOWED_HOST', 'localhost')
WWW_ROOT = 'http://%s/' % DOMAIN_NAME
ALLOWED_HOSTS = [DOMAIN_NAME]

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': '%s' % os.getenv('POSTGRES_DB'),
        'USER': '%s' % os.getenv('POSTGRES_USER'),
        'PASSWORD': '%s' % os.getenv('POSTGRES_PASSWORD'),
        'HOST': '%s' % os.getenv('POSTGRES_HOST'),
        'PORT': 5432,
    }
}

MIDDLEWARE_CLASSES = [
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.media',
                'django.template.context_processors.request',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.static',
                'django_common.context_processors.common_settings',
                'django.template.context_processors.request',
            ],
        },
    },
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.humanize',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.sitemaps',
    'django.contrib.staticfiles',

    'rest_framework',
    'django_filters',
    # 'compressor',
    'django_common',

    'common',
    'account',
    'agency',
    'partner',
    'project',
    'review',
]

# auth / django-registration params
AUTH_USER_MODEL = 'account.User'

ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 7

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

TEST_RUNNER = 'django.test.runner.DiscoverRunner'

# COMPRESS_PRECOMPILERS = (
#     ('text/less', 'lessc {infile} {outfile}'),
# )
#
# COMPRESS_CSS_FILTERS = [
#     # css minimizer
#     'compressor.filters.cssmin.CSSMinFilter',
#     'compressor.filters.css_default.CssAbsoluteFilter'
# ]
# COMPRESS_JS_FILTERS = [
#     'compressor.filters.jsmin.JSMinFilter'
# ]

USERSWITCH_OPTIONS = {
    'auth_backend':
        'django.contrib.auth.backends.ModelBackend',
    'css_inline':
        'position:fixed !important; bottom: 10px !important; left: 10px !important; opacity:0.50; z-index: 9999;',
}


# helper function to extend all the common lists
def extend_list_avoid_repeats(list_to_extend, extend_with):
    """Extends the first list with the elements in the second one, making sure its elements are not already there in the
    original list."""
    list_to_extend.extend(filter(lambda x: not list_to_extend.count(x), extend_with))


LOGS_PATH = os.path.join(DATA_VOLUME, PROJECT_NAME, 'logs')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(asctime)s [%(levelname)s] %(name)s line %(lineno)d: %(message)s'
        },
    },
    'filters': {
        'require_debug_false': {
            '()': 'django.utils.log.RequireDebugFalse'
        }
    },
    'handlers': {
        'default': {
            'level': 'DEBUG',
            'class': 'common.utils.DeferredRotatingFileHandler',
            'filename': 'django.log',  # Full path is created by DeferredRotatingFileHandler.
            'maxBytes': 1024*1024*5,  # 5 MB
            'backupCount': 5,
            'formatter': 'standard'
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'filters': ['require_debug_false'],
            'include_html': True,
        }
    },
    'loggers': {
        '': {
            'handlers': ['default'],
            'level': 'INFO',
            'propagate': True},
        'django.request': {
            'handlers': ['mail_admins', 'default'],
            'level': 'ERROR',
            'propagate': False,
        },
        'django.security.DisallowedHost': {
            # Skip "SuspiciousOperation: Invalid HTTP_HOST" e-mails.
            'handlers': ['default'],
            'propagate': False,
        },
    }
}

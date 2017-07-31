from __future__ import absolute_import
import os, sys


####
# Change per project
####
PROJECT_NAME = 'unpp_api'
PROJECT_NAME_DB = 'unpp_api'
# VIRTUAL_ENV_DIR = '/data/backend/unpp_api'
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(BASE_DIR, 'apps/'))
VIRTUAL_ENV_DIR = BASE_DIR

####
# Other settings
####
ADMINS = (
    # ('Alerts', 'dev@unpp_api.com'),
    ('Alerts', 'dev@tivix.com'),
)
SITE_ID = 1
TIME_ZONE = 'America/Los_Angeles'  # changed to UTC
LANGUAGE_CODE = 'en-us'
USE_I18N = True
SECRET_KEY = '7mtv%enh%j6v23jl*y2kf!@@@=uj1x1e2yb^dpkr3l83s&amp;_7+_'
DEFAULT_CHARSET = 'utf-8'
ROOT_URLCONF = 'unpp_api.urls'

# project root and add "apps" to the path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(PROJECT_ROOT, 'apps/'))

UPLOADS_DIR_NAME = 'uploads'
MEDIA_URL = '/%s/' % UPLOADS_DIR_NAME
MEDIA_ROOT = os.path.join(VIRTUAL_ENV_DIR, '%s' % UPLOADS_DIR_NAME)
FILE_UPLOAD_MAX_MEMORY_SIZE = 4194304  # 4mb


# static resources related. See documentation at: http://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/
STATIC_URL = '/static/'
STATIC_ROOT = '%s/staticserve' % VIRTUAL_ENV_DIR
STATICFILES_DIRS = (
    ('global', '%s/static' % PROJECT_ROOT),
)

# static serving
STATICFILES_FINDERS = (
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",

    # other finders..
    "compressor.finders.CompressorFinder",
)

DEBUG = False
IS_DEV = False
IS_STAGING = False
IS_PROD = False

# Get the ENV setting. Needs to be set in .bashrc or similar.
ENV = os.getenv('ENV')
if not ENV:
    raise Exception('Environment variable ENV is required!')

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
        'DIRS': [
            os.path.join(PROJECT_ROOT, 'templates'),
        ],
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

    'compressor',
    'django_common',

    'account',
    'common',
]



# Email settings #
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = 'smtp.sendgrid.net'
EMAIL_PORT = 587
# EMAIL_HOST_USER = 'dev@unpp_api.com'
# EMAIL_HOST_PASSWORD = 'TBD-unpp_api'
EMAIL_HOST_USER = 'sumit@tivix.com'
EMAIL_HOST_PASSWORD = 'Tivix!rules1!@#!'
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = 'noreply@unpp_api.com'
EMAIL_SUBJECT_PREFIX = '[%s %s] ' % (PROJECT_NAME, ENV)


# auth / django-registration params
AUTH_USER_MODEL = 'account.User'

ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 7
LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/'
LOGIN_ERROR_URL = '/accounts/login/error/'

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

TEST_RUNNER = 'django.test.runner.DiscoverRunner'

if 'test' in sys.argv:
    DATABASES['default'] = {'ENGINE': 'django.db.backends.sqlite3', 'PASSWORD': '', 'USER': ''}

COMPRESS_PRECOMPILERS = (
    ('text/less', 'lessc {infile} {outfile}'),
)

COMPRESS_CSS_FILTERS = [
    #css minimizer
    'compressor.filters.cssmin.CSSMinFilter',
    'compressor.filters.css_default.CssAbsoluteFilter'
]
COMPRESS_JS_FILTERS = [
    'compressor.filters.jsmin.JSMinFilter'
]

USERSWITCH_OPTIONS = {
    'auth_backend': 'django.contrib.auth.backends.ModelBackend',
    'css_inline': 'position:fixed !important; bottom: 10px !important; left: 10px !important; opacity:0.50; z-index: 9999;',
}

# helper function to extend all the common lists
def extend_list_avoid_repeats(list_to_extend, extend_with):
    """Extends the first list with the elements in the second one, making sure its elements are not already there in the
    original list."""
    list_to_extend.extend(filter(lambda x: not list_to_extend.count(x), extend_with))


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

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
    ('Alerts', os.getenv('ALERTS_EMAIL') or 'unicef-unpp@tivix.com'),
)

SANCTIONS_LIST_URL = 'https://scsanctions.un.org/resources/xml/en/consolidated.xml'
SITE_ID = 1
TIME_ZONE = 'UTC'
LANGUAGE_CODE = 'en-us'
USE_I18N = True
SECRET_KEY = os.getenv('SECRET_KEY')
DEFAULT_CHARSET = 'utf-8'
ROOT_URLCONF = 'unpp_api.urls'

DATA_VOLUME = os.getenv('DATA_VOLUME', '/data')

ALLOWED_EXTENSIONS = (
    'pdf', 'doc', 'docx', 'xls', 'xlsx' 'img', 'png', 'jpg', 'jpeg'
)
UPLOADS_DIR_NAME = 'uploads'
MEDIA_URL = '/api/%s/' % UPLOADS_DIR_NAME
MEDIA_ROOT = os.getenv('UNPP_UPLOADS_PATH', os.path.join(DATA_VOLUME, '%s' % UPLOADS_DIR_NAME))

FILE_UPLOAD_MAX_MEMORY_SIZE = 4194304  # 4mb


# static resources related. See documentation at: http://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/
STATIC_URL = '/api/static/'
STATIC_ROOT = '%s/staticserve' % DATA_VOLUME

# static serving
STATICFILES_FINDERS = (
    "django.contrib.staticfiles.finders.FileSystemFinder",
    "django.contrib.staticfiles.finders.AppDirectoriesFinder",
)

DEBUG = True
IS_DEV = False
IS_STAGING = False
IS_PROD = False

UN_SANCTIONS_LIST_EMAIL_ALERT = 'test@tivix.com'  # TODO - change to real one
DEFAULT_FROM_EMAIL = 'UNPP Stage <noreply@unpp.org>'
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_PORT = os.getenv('EMAIL_PORT')
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', '').lower() == 'true'

# Get the ENV setting. Needs to be set in .bashrc or similar.
ENV = os.getenv('ENV')
if not ENV:
    raise Exception('Environment variable ENV is required!')

# domains/hosts etc.
DOMAIN_NAME = os.getenv('DJANGO_ALLOWED_HOST', 'localhost')
WWW_ROOT = 'http://%s/' % DOMAIN_NAME
ALLOWED_HOSTS = [DOMAIN_NAME]
FRONTEND_HOST = os.getenv('UNPP_FRONTEND_HOST', DOMAIN_NAME)

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

POSTGRES_SSL_MODE = os.getenv('POSTGRES_SSL_MODE', 'off')
if POSTGRES_SSL_MODE == 'on':
    DATABASES['default'].update({'OPTIONS': {"sslmode": 'require'}})

MIDDLEWARE = [
    'elasticapm.contrib.django.middleware.TracingMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'common.middleware.ActivePartnerMiddleware',
    'common.middleware.ActiveAgencyOfficeMiddleware',
    'common.middleware.ClientTimezoneMiddleware',
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
                'django.template.context_processors.request',
            ],
        },
    },
]

INSTALLED_APPS = [
    'elasticapm.contrib.django',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.humanize',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.sitemaps',
    'django.contrib.staticfiles',

    'rest_framework',
    'rest_framework.authtoken',
    'rest_auth',
    'django_filters',
    'imagekit',
    'django_countries',
    'mail_templated',
    'social_django',
    'sequences.apps.SequencesConfig',
    'django_nose',

    'common',
    'account',
    'agency',
    'partner',
    'project',
    'review',
    'storages',
    'notification',
    'sanctionslist',
    'management',
    'reports',
    'externals',
]

# auth / django-registration params
AUTH_USER_MODEL = 'account.User'

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 12,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

PASSWORD_RESET_TIMEOUT_DAYS = 31

ACCOUNT_EMAIL_CONFIRMATION_EXPIRE_DAYS = 7

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'common.authentication.CustomAzureADBBCOAuth2',
]

# Django-social-auth settings
KEY = os.getenv('AZURE_B2C_CLIENT_ID', None)
SECRET = os.getenv('AZURE_B2C_CLIENT_SECRET', None)

SOCIAL_AUTH_URL_NAMESPACE = 'social'
SOCIAL_AUTH_SANITIZE_REDIRECTS = False
POLICY = os.getenv('AZURE_B2C_POLICY_NAME', "b2c_1A_UNICEF_PARTNERS_signup_signin")

TENANT_ID = os.getenv('AZURE_B2C_TENANT', 'unicefpartners.onmicrosoft.com')
SCOPE = ['openid', 'email']
IGNORE_DEFAULT_SCOPE = True
SOCIAL_AUTH_USERNAME_IS_FULL_EMAIL = True
SOCIAL_AUTH_PROTECTED_USER_FIELDS = ['email']
SOCIAL_AUTH_LOGIN_REDIRECT_URL = "/dashboard"

# TODO: Re-enable this back once we figure out all email domain names to whitelist from partners
# SOCIAL_AUTH_WHITELISTED_DOMAINS = ['unicef.org', 'google.com']

TEST_RUNNER = os.getenv('DJANGO_TEST_RUNNER', 'django.test.runner.DiscoverRunner')
NOSE_ARGS = ['--with-timer', '--nocapture', '--nologcapture']

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'TEST_REQUEST_DEFAULT_FORMAT': 'json',
}
REST_AUTH_SERIALIZERS = {
    'LOGIN_SERIALIZER': 'account.serializers.CustomLoginSerializer',
    'USER_DETAILS_SERIALIZER': 'account.serializers.RegisterSimpleAccountSerializer',
    'PASSWORD_RESET_SERIALIZER': 'account.serializers.CustomPasswordResetSerializer',
}


# helper function to extend all the common lists
def extend_list_avoid_repeats(list_to_extend, extend_with):
    """Extends the first list with the elements in the second one, making sure its elements are not already there in the
    original list."""
    list_to_extend.extend(filter(lambda x: not list_to_extend.count(x), extend_with))


LOGS_PATH = os.getenv('UNPP_LOGS_PATH', os.path.join(DATA_VOLUME, PROJECT_NAME, 'logs'))

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(asctime)s [%(levelname)s] %(name)s line %(lineno)d: %(message)s'
        },
        'verbose': {
            'format': '[%(asctime)s][%(levelname)s][%(name)s] %(filename)s.%(funcName)s:%(lineno)d %(message)s',
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
            'class': 'logging.StreamHandler',
            'formatter': 'standard',
        },
        'filesystem': {
            'level': 'DEBUG',
            'class': 'common.utils.DeferredRotatingFileHandler',
            'filename': 'django.log',
            'formatter': 'verbose',
        },
        'elasticapm': {
            'level': 'ERROR',
            'class': 'elasticapm.contrib.django.handlers.LoggingHandler',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': True,
        }
    },
    'loggers': {
        '': {
            'handlers': ['default', 'filesystem'],
            'level': 'INFO',
            'propagate': True
        },
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
        'elasticapm.errors': {
            'level': 'ERROR',
            'handlers': ['default'],
            'propagate': False,
        },
    }
}

# apm related - it's enough to set those as env variables, here just for documentation
# by default logging and apm is off, so below envs needs to be set per environment

# ELASTIC_APM_APP_NAME=<app-name> # set app name visible on dashboard
# ELASTIC_APM_SECRET_TOKEN=<app-token> #secret token - needs to be exact same as on apm-server
# ELASTIC_APM_SERVER_URL=http://elastic.tivixlabs.com:8200 # apm-server url

UNHCR_API_HOST = os.getenv('UNHCR_API_HOST')
UNHCR_API_USERNAME = os.getenv('UNHCR_API_USERNAME')
UNHCR_API_PASSWORD = os.getenv('UNHCR_API_PASSWORD')

UNICEF_API_HOST = os.getenv('UNICEF_API_HOST')
UNICEF_API_USERNAME = os.getenv('UNICEF_API_USERNAME')
UNICEF_API_PASSWORD = os.getenv('UNICEF_API_PASSWORD')

WFP_API_HOST = os.getenv('WFP_API_HOST')
WFP_API_USERNAME = os.getenv('WFP_API_USERNAME')
WFP_API_PASSWORD = os.getenv('WFP_API_PASSWORD')

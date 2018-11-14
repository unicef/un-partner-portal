from __future__ import absolute_import
import os
import sys


####
# Change per project
####
from django.urls import reverse_lazy
from django.utils.text import slugify

PROJECT_NAME = 'unpp_api'
# project root and add "apps" to the path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.join(PROJECT_ROOT, 'apps/'))

# domains/hosts etc.
DOMAIN_NAME = os.getenv('DJANGO_ALLOWED_HOST', 'localhost')
WWW_ROOT = 'http://%s/' % DOMAIN_NAME
ALLOWED_HOSTS = [DOMAIN_NAME]
FRONTEND_HOST = os.getenv('UNPP_FRONTEND_HOST', DOMAIN_NAME)

####
# Other settings
####
ADMINS = (
    ('Alerts', os.getenv('ALERTS_EMAIL') or 'admin@unpartnerportal.com'),
    ('Tivix', f'unicef-unpp+{slugify(DOMAIN_NAME)}@tivix.com'),
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
MEDIA_URL = f'/api/{UPLOADS_DIR_NAME}/'
MEDIA_ROOT = os.getenv('UNPP_UPLOADS_PATH', os.path.join(DATA_VOLUME, UPLOADS_DIR_NAME))

FILE_UPLOAD_MAX_MEMORY_SIZE = 4194304  # 4mb


# static resources related. See documentation at: http://docs.djangoproject.com/en/dev/ref/contrib/staticfiles/
STATIC_URL = '/api/static/'
STATIC_ROOT = f'{DATA_VOLUME}/staticserve'

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
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'UNPP Stage <noreply@unpartnerportal.org>')
EMAIL_HOST = os.getenv('EMAIL_HOST')
EMAIL_PORT = os.getenv('EMAIL_PORT')
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', '').lower() == 'true'

# Get the ENV setting. Needs to be set in .bashrc or similar.
ENV = os.getenv('ENV')
if not ENV:
    raise Exception('Environment variable ENV is required!')

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': os.getenv('POSTGRES_DB'),
        'USER': os.getenv('POSTGRES_USER'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'),
        'HOST': os.getenv('POSTGRES_HOST'),
        'PORT': 5432,
    }
}

POSTGRES_SSL_MODE = os.getenv('POSTGRES_SSL_MODE', 'off')
if POSTGRES_SSL_MODE == 'on':
    DATABASES['default'].update({'OPTIONS': {"sslmode": 'require'}})

MIDDLEWARE = [
    'django.middleware.common.CommonMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'account.authentication.CustomSocialAuthExceptionMiddleware',
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
    'account.authentication.CustomAzureADBBCOAuth2',
]

# Django-social-auth settings
SOCIAL_AUTH_AZUREAD_B2C_OAUTH2_KEY = os.getenv('AZURE_B2C_CLIENT_ID', None)
SOCIAL_AUTH_AZUREAD_B2C_OAUTH2_SECRET = os.getenv('AZURE_B2C_CLIENT_SECRET', None)

SOCIAL_AUTH_URL_NAMESPACE = 'social'
SOCIAL_AUTH_SANITIZE_REDIRECTS = True
SOCIAL_AUTH_AZUREAD_B2C_OAUTH2_POLICY = os.getenv('AZURE_B2C_POLICY_NAME', "b2c_1A_UNICEF_PARTNERS_signup_signin")
SOCIAL_AUTH_AZUREAD_B2C_OAUTH2_PW_RESET_POLICY = os.getenv(
    'AZURE_B2C_PW_RESET_POLICY_NAME', "B2C_1_PasswordResetPolicy"
)

SOCIAL_AUTH_AZUREAD_B2C_OAUTH2_TENANT_ID = os.getenv('AZURE_B2C_TENANT', 'unicefpartners.onmicrosoft.com')
SOCIAL_AUTH_AZUREAD_B2C_OAUTH2_SCOPE = [
    'openid', 'email', 'profile',
]
IGNORE_DEFAULT_SCOPE = True
SOCIAL_AUTH_USERNAME_IS_FULL_EMAIL = True
SOCIAL_AUTH_PROTECTED_USER_FIELDS = ['email']
SOCIAL_AUTH_LOGIN_REDIRECT_URL = reverse_lazy('accounts:social-logged-in')
SOCIAL_AUTH_PIPELINE = (
    'account.authentication.social_details',
    'social_core.pipeline.social_auth.social_uid',
    'social_core.pipeline.social_auth.auth_allowed',
    'social_core.pipeline.social_auth.social_user',
    'social_core.pipeline.user.get_username',
    'account.authentication.require_email',
    'social_core.pipeline.social_auth.associate_by_email',
    'account.authentication.create_user',
    'social_core.pipeline.social_auth.associate_user',
    'social_core.pipeline.social_auth.load_extra_data',
    'account.authentication.user_details',
)
SOCIAL_AUTH_AZUREAD_B2C_OAUTH2_USER_FIELDS = [
    'email', 'fullname'
]

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
    'USER_DETAILS_SERIALIZER': 'account.serializers.SimpleAccountSerializer',
    'PASSWORD_RESET_SERIALIZER': 'account.serializers.CustomPasswordResetSerializer',
}


# helper function to extend all the common lists
def extend_list_avoid_repeats(list_to_extend, extend_with):
    """Extends the first list with the elements in the second one, making sure its elements are not already there in the
    original list."""
    list_to_extend.extend(filter(lambda x: not list_to_extend.count(x), extend_with))


LOG_LEVEL = 'DEBUG' if DEBUG and 'test' not in sys.argv else 'INFO'
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
            'level': LOG_LEVEL,
            'class': 'logging.StreamHandler',
            'formatter': 'standard',
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': True,
        }
    },
    'loggers': {
        '': {
            'handlers': ['default'],
            'level': 'INFO',
            'propagate': True
        },
        'console': {
            'handlers': ['default'],
            'level': 'DEBUG',
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
    }
}

UNHCR_API_HOST = os.getenv('UNHCR_API_HOST')
UNHCR_API_USERNAME = os.getenv('UNHCR_API_USERNAME')
UNHCR_API_PASSWORD = os.getenv('UNHCR_API_PASSWORD')

UNICEF_PARTNER_DETAILS_URL = os.getenv('UNICEF_PARTNER_DETAILS_URL')
UNICEF_API_USERNAME = os.getenv('UNICEF_API_USERNAME')
UNICEF_API_PASSWORD = os.getenv('UNICEF_API_PASSWORD')

WFP_API_HOST = os.getenv('WFP_API_HOST')
WFP_API_TOKEN = os.getenv('WFP_API_TOKEN')


LEGACY_DB_HOST = os.getenv('LEGACY_DB_HOST')
if LEGACY_DB_HOST and 'test' not in sys.argv:
    # bit of an ugly hack, to stop creating legacy DB when testing
    DATABASES['legacy'] = {
        'ENGINE': 'sqlserver',
        'NAME': os.getenv('LEGACY_DB_NAME', 'UNPP'),
        'USER': os.getenv('LEGACY_DB_USER', 'SA'),
        'PASSWORD': os.getenv('SA_PASSWORD'),
        'HOST': LEGACY_DB_HOST,
        'PORT': int(os.getenv('LEGACY_DB_PORT', 1433)),
    }
    DATABASE_ROUTERS = [
        'legacy.database_routers.LegacyDatabaseRouter',
    ]
    INSTALLED_APPS += ['legacy']


GIT_VERSION = os.getenv('GIT_VERSION', 'UNKNOWN')

REDIS_INSTANCE = os.getenv('REDIS_INSTANCE')

if REDIS_INSTANCE:
    CACHES = {
        'default': {
            'BACKEND': 'django_redis.cache.RedisCache',
            'LOCATION': f'redis://{REDIS_INSTANCE}/1',
            'OPTIONS': {
                'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            },
            'TIMEOUT': 3600
        }
    }
    DJANGO_REDIS_IGNORE_EXCEPTIONS = not DEBUG
else:
    CACHES = {
        'default': {
            'BACKEND': 'common.cache_backends.DummyRedisCache',
            'LOCATION': 'unpp'
        }
    }

SESSION_ENGINE = "django.contrib.sessions.backends.cached_db"

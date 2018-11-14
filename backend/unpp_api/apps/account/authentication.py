import logging
from urllib.parse import quote, urlencode

import requests
from django.contrib.auth import get_user_model
from rest_framework import status
from social_core.exceptions import InvalidEmail
from social_core.pipeline import social_auth

from django.conf import settings
from social_core.backends.azuread_b2c import AzureADB2COAuth2
from social_core.pipeline import user as social_core_user
from social_django.middleware import SocialAuthExceptionMiddleware

from agency.agencies import AGENCIES
from agency.models import AgencyMember, AgencyOffice

logger = logging.getLogger('console')


class CustomAzureADBBCOAuth2(AzureADB2COAuth2):

    def __init__(self, *args, **kwargs):
        super(CustomAzureADBBCOAuth2, self).__init__(*args, **kwargs)
        self.redirect_uri = f'https://{settings.FRONTEND_HOST}/api/social/complete/azuread-b2c-oauth2/'

    @property
    def logout_url(self):
        config_response = requests.get(self.openid_configuration_url())
        if config_response.status_code == status.HTTP_200_OK:
            logout_url = config_response.json()['end_session_endpoint']
        else:
            logout_url = f'{self.base_url}/oauth2/v2.0/logout?p={settings.SOCIAL_AUTH_AZUREAD_B2C_OAUTH2_POLICY}'

        frontend_url = f'https://{settings.FRONTEND_HOST}'
        return f'{logout_url}&post_logout_redirect_uri={quote(frontend_url)}'


class CustomSocialAuthExceptionMiddleware(SocialAuthExceptionMiddleware):

    def get_redirect_uri(self, request, exception):
        # This is what we should expect:
        # ['AADB2C90118: The user has forgotten their password.\r\n
        # Correlation ID: 7e8c3cf9-2fa7-47c7-8924-a1ea91137ba9\r\n
        # Timestamp: 2018-11-13 11:37:56Z\r\n']

        if 'AADB2C90118' in (request.GET.get('error_description') or ''):
            auth_class = CustomAzureADBBCOAuth2()
            redirect_home = auth_class.get_redirect_uri()

            url_kwargs = {
                'p': settings.SOCIAL_AUTH_AZUREAD_B2C_OAUTH2_PW_RESET_POLICY,
                'client_id': settings.SOCIAL_AUTH_AZUREAD_B2C_OAUTH2_KEY,
                'nonce': 'defaultNonce',
                'redirect_uri': redirect_home,
                'scope': 'openid+email',
                'response_type': 'code',
            }
            return auth_class.authorization_url() + '?' + urlencode(url_kwargs)

        # TODO: In case of password reset the state can't be verified figure out a way to log the user in after reset
        if request.GET.get('error') is None:
            return f'https://{settings.FRONTEND_HOST}'

        strategy = getattr(request, 'social_strategy', None)
        return strategy.setting('LOGIN_ERROR_URL')


def social_details(backend, details, response, *args, **kwargs):
    logger.debug(f'social_details response:\n{response}')
    logger.debug(f'user_data:\n{backend.user_data(None, response=response)}')
    r = social_auth.social_details(backend, details, response, *args, **kwargs)

    if not r['details'].get('email'):
        user_data = backend.user_data(None, response=response) or {}
        r['details']['email'] = user_data.get('email', user_data.get('signInNames.emailAddress'))

    r['details']['idp'] = response.get('idp', '')

    return r


def user_details(strategy, details, user=None, *args, **kwargs):
    logger.debug(f'user_details for user {user} details:\n{details}')

    if user:
        user.fullname = details.get('fullname') or f"{details['first_name']} {details['last_name']}"
        user.save()

        if not user.agency_members.exists():
            for agency in AGENCIES:
                # TODO: Settle if it's ok to use IDP, or just match by email domain
                if agency.name.lower() in details.get('idp', '').lower():
                    office, _ = AgencyOffice.objects.get_or_create(
                        agency=agency.model_instance,
                        country='CH'  # TODO: Need to decide how to retrieve country for user
                    )
                    AgencyMember.objects.get_or_create(
                        user=user,
                        defaults={
                            'office': office,
                        }
                    )
                    break

    return social_core_user.user_details(strategy, details, user, *args, **kwargs)


def require_email(strategy, details, user=None, is_new=False, *args, **kwargs):
    if user and user.email:
        return
    elif is_new and not details.get('email'):
        raise InvalidEmail(strategy)


def create_user(strategy, details, backend, user=None, *args, **kwargs):
    if user:
        return {'is_new': False}

    user = get_user_model().objects.create(
        email=details['email'],
        fullname=details.get('fullname'),
    )
    user.set_unusable_password()
    user.save()

    return {
        'is_new': True,
        'user': user
    }

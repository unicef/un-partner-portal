import logging

from django.contrib.auth import get_user_model
from social_core.exceptions import InvalidEmail
from social_core.pipeline import social_auth

from django.conf import settings
from social_core.backends.azuread_b2c import AzureADB2COAuth2
from social_core.pipeline import user as social_core_user


logger = logging.getLogger('console')


class CustomAzureADBBCOAuth2(AzureADB2COAuth2):

    def __init__(self, *args, **kwargs):
        super(CustomAzureADBBCOAuth2, self).__init__(*args, **kwargs)
        self.redirect_uri = f'https://{settings.FRONTEND_HOST}/api/social/complete/azuread-b2c-oauth2/'


def social_details(backend, details, response, *args, **kwargs):
    logger.debug(f'social_details response:\n{response}')
    logger.debug(f'user_data:\n{backend.user_data(None, response=response)}')
    r = social_auth.social_details(backend, details, response, *args, **kwargs)

    if not r['details'].get('email'):
        user_data = backend.user_data(None, response=response) or {}
        r['details']['email'] = user_data.get('email', user_data.get('signInNames.emailAddress'))

    return r


def user_details(strategy, details, user=None, *args, **kwargs):
    logger.debug(f'user_details for user {user} details:\n{details}')

    if user:
        user.fullname = details.get('fullname') or f"{details['first_name']} {details['last_name']}"
        user.save()

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

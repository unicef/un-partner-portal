import logging

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
    r = social_auth.social_details(backend, details, response, *args, **kwargs)
    r['details']['idp'] = response.get('idp')

    if not r['details'].get('email'):
        r['details']['email'] = response.get('email')
    logger.debug(f'social_details response:\n{r}')

    return r


def user_details(strategy, details, user=None, *args, **kwargs):
    logger.debug(f'user_details for user {user} details:\n{details}')

    if user:
        user.fullname = f"{details['first_name']} {details['last_name']}"
        user.save()

        # TODO: update details

    return social_core_user.user_details(strategy, details, user, *args, **kwargs)

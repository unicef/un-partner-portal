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

    return r


def user_details(strategy, details, user=None, *args, **kwargs):
    # # This is where we update the user
    # # see what the property to map by is here
    # updates_available = False

    logger.debug(f'For {user} got details:\n{details}')
    if user:
        # user_groups = [group.name for group in user.groups.all()]
        # business_area_code = details.get("business_area_code", 'defaultBA1235')

        # Update username with email and unusable password
        user.username = user.email
        user.fullname = f"{details['first_name']} {details['last_name']}"
        user.save()

        # TODO: update details
        # def update_user_country():
        #     try:
        #         user.profile.country = Country.objects.get(business_area_code=business_area_code)
        #     except Country.DoesNotExist:
        #         user.profile.country = Country.objects.get(name='UAT')

        # if not user.profile.country:
        #     update_user_country()
        #     updates_available = True

        # elif not user.profile.country_override:
        #     # make sure that we update the workspace based business area
        #     if business_area_code != user.profile.country.business_area_code:
        #         update_user_country()
        #         updates_available = True

        # if updates_available:
        #     user.save()
        #     user.profile.save()

    return social_core_user.user_details(strategy, details, user, *args, **kwargs)

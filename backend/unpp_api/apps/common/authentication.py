from social_core.backends.azuread_b2c import AzureADB2COAuth2


class CustomAzureADBBCOAuth2(AzureADB2COAuth2):

    def __init__(self, *args, **kwargs):
        super(CustomAzureADBBCOAuth2, self).__init__(*args, **kwargs)
        self.redirect_uri = f'{settings.FRONTEND_HOST}/social/complete/azuread-b2c-oauth2/'

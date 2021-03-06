from django.conf.urls import url

from account.views import (
    AccountRegisterAPIView,
    AccountCurrentUserRetrieveAPIView,
    UserProfileRetrieveUpdateAPIView,
    SocialAuthLoggedInUserView,
    SocialAuthLoginView,
)


urlpatterns = [
    url(r'^registration$', AccountRegisterAPIView.as_view(), name="registration"),
    url(r'^me/$', AccountCurrentUserRetrieveAPIView.as_view(), name="my-account"),
    url(r'^me/profile/$', UserProfileRetrieveUpdateAPIView.as_view(), name="my-profile"),
    url(r'^social-login/(?P<backend>[^/]+)/$', SocialAuthLoginView.as_view(), name='social-login'),
    url(r'^social-logged-in/$', SocialAuthLoggedInUserView.as_view(), name="social-logged-in"),
]

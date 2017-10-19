from django.conf.urls import url

from .views import AccountRegisterAPIView, AccountCurrentUserRetrieveAPIView


urlpatterns = [
    url(r'^registration$', AccountRegisterAPIView.as_view(), name="registration"),
    url(r'^me/$', AccountCurrentUserRetrieveAPIView.as_view(), name="my-account"),
]

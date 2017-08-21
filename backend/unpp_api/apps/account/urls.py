from django.conf.urls import url

from .views import (
    AccountListCreateAPIView,
    AccountRegisterAPIView,
    AccountLoginAPIView,
    AccountLogoutAPIView,
)


urlpatterns = [
    url(r'^$', AccountListCreateAPIView.as_view(), name="index"),
    url(r'^registration$', AccountRegisterAPIView.as_view(), name="registration"),
    url(r'^login', AccountLoginAPIView.as_view(), name="login"),
    url(r'^logout', AccountLogoutAPIView.as_view(), name="logout"),

]

from django.conf.urls import url

from .views import (
    ConfigCountriesAPIView,
    ConfigPPAPIView,
)


urlpatterns = [
    url(r'^countries/$', ConfigCountriesAPIView.as_view(), name="countries"),
    url(r'^partners/profile/$', ConfigPPAPIView.as_view(), name="partners-profile"),

]

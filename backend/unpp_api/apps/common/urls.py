from django.conf.urls import url

from .views import (
    ConfigCountriesAPIView,
    ConfigPPAPIView,
    ConfigSectorsAPIView,
)


urlpatterns = [
    url(r'^countries/$', ConfigCountriesAPIView.as_view(), name="countries"),
    url(r'^partners/profile/$', ConfigPPAPIView.as_view(), name="partners-profile"),
    url(r'^sectors/$', ConfigSectorsAPIView.as_view(), name="sectors"),
]

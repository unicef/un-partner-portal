from django.conf.urls import url

from .views import (
    OpenProjectAPIView,
    DirectProjectAPIView,
    PinProjectAPIView,
    EOIAPIView,
    ApplicationsPartnerAPIView,
    ApplicationsAgencyAPIView,
    ApplicationsAPIView,
)


urlpatterns = [
    url(r'^(?P<pk>\d+)/$', EOIAPIView.as_view(), name="eoi-detail"),
    url(r'^(?P<pk>\d+)/partner-applications/$', ApplicationsPartnerAPIView.as_view(), name="partner-applications"),
    url(r'^(?P<pk>\d+)/agency-applications/$', ApplicationsAgencyAPIView.as_view(), name="agency-applications"),
    url(r'^applications/(?P<pk>\d+)/$', ApplicationsAPIView.as_view(), name="applications"),
    url(r'^open/$', OpenProjectAPIView.as_view(), name="open"),
    url(r'^direct/$', DirectProjectAPIView.as_view(), name="direct"),
    url(r'^pins/$', PinProjectAPIView.as_view(), name="pins"),
]

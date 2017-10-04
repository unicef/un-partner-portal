from django.conf.urls import url

from .views import (
    OpenProjectAPIView,
    DirectProjectAPIView,
    PinProjectAPIView,
    UnsolicitedProjectAPIView,
    EOIAPIView,
    ApplicationsPartnerAPIView,
    ApplicationsAgencyAPIView,
    ApplicationAPIView,
    ApplicationsListAPIView,
)


urlpatterns = [
    url(r'^(?P<pk>\d+)/$', EOIAPIView.as_view(), name="eoi-detail"),
    url(r'^(?P<pk>\d+)/partner-applications/$', ApplicationsPartnerAPIView.as_view(), name="partner-applications"),
    url(r'^(?P<pk>\d+)/agency-applications/$', ApplicationsAgencyAPIView.as_view(), name="agency-applications"),
    url(r'^application/(?P<pk>\d+)/$', ApplicationAPIView.as_view(), name="application"),
    url(r'^(?P<pk>\d+)/applications/$', ApplicationsListAPIView.as_view(), name="applications"),
    url(r'^open/$', OpenProjectAPIView.as_view(), name="open"),
    url(r'^direct/$', DirectProjectAPIView.as_view(), name="direct"),
    url(r'^pins/$', PinProjectAPIView.as_view(), name="pins"),
    url(r'^unsolicited/$', UnsolicitedProjectAPIView.as_view(), name="unsolicited"),
]

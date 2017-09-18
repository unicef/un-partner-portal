from django.conf.urls import url

from .views import (
    OrganizationProfileAPIView,
    PartnerProfileAPIView,
)


urlpatterns = [
    url(r'^(?P<pk>\d+)/org-profile', OrganizationProfileAPIView.as_view(), name="org-profile"),
    url(r'^(?P<pk>\d+)', PartnerProfileAPIView.as_view(), name="partner-profile"),
]

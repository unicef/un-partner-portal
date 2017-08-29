from django.conf.urls import url

from .views import (
    OrganizationProfileAPIView,
    PartnerProfileAPIView,
)


urlpatterns = [
    url(r'^(?P<partner_id>\d+)/org-profile', OrganizationProfileAPIView.as_view(), name="org-profile"),
    url(r'^(?P<partner_id>\d+)', PartnerProfileAPIView.as_view(), name="partner-profile"),
]

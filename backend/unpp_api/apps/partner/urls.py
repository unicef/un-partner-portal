from django.conf.urls import url

from .views import (
    OrganizationProfileAPIView,
)


urlpatterns = [
    url(r'^(?P<partner_id>\d+)/org-profile', OrganizationProfileAPIView.as_view(), name="org-profile"),
]

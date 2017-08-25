from django.conf.urls import url

from .views import (
    PartnerProfilesAPIView,
)


urlpatterns = [
    url(r'^(?P<partner_id>\d+)/$', PartnerProfilesAPIView.as_view(), name="partner_detail"),
]

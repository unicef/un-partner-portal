from django.conf.urls import url

from .views import (
    PartnerFlagListCreateAPIView,
    PartnerVerificationListCreateAPIView
)


urlpatterns = [
    url(r'^(?P<pk>\d+)/flags/$',
        PartnerFlagListCreateAPIView.as_view(), name="flags"),
    url(r'^(?P<pk>\d+)/verifications/$',
        PartnerVerificationListCreateAPIView.as_view(), name="verifications"),
]

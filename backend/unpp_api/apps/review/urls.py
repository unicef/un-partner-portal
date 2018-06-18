from django.conf.urls import url

from .views import (
    PartnerFlagListCreateAPIView,
    PartnerVerificationListCreateAPIView,
    PartnerFlagRetrieveUpdateAPIView,
    PartnerVerificationRetrieveAPIView
)


urlpatterns = [
    url(r'^(?P<partner_id>\d+)/flags/$',
        PartnerFlagListCreateAPIView.as_view(), name="flags"),
    url(r'^(?P<partner_id>\d+)/verifications/$',
        PartnerVerificationListCreateAPIView.as_view(), name="verifications"),
    url(r'^(?P<partner_id>\d+)/flags/(?P<pk>\d+)/$',
        PartnerFlagRetrieveUpdateAPIView.as_view(), name="flag-details"),
    url(r'^(?P<partner_id>\d+)/verifications/(?P<pk>\d+)/$',
        PartnerVerificationRetrieveAPIView.as_view(), name="verifications-detail"),
]

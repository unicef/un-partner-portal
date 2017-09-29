from django.conf.urls import url

from .views import (
    PartnerFlagListCreateAPIView,
    PartnerVerificationListCreateAPIView,
    PartnerFlagRetrieveUpdateAPIView,
    PartnerVerificationRetrieveUpdateAPIView
)


urlpatterns = [
    url(r'^(?P<partner_id>\d+)/flags/$',
        PartnerFlagListCreateAPIView.as_view(), name="parnter-flags"),
    url(r'^(?P<partner_id>\d+)/verifications/$',
        PartnerVerificationListCreateAPIView.as_view(), name="partner-verifications"),
    url(r'^(?P<partner_id>\d+)/flags/(?P<pk>\d+)/$',
        PartnerFlagRetrieveUpdateAPIView.as_view(), name="partner-flags-detail"),
    url(r'^(?P<partner_id>\d+)/verifications/(?P<pk>\d+)/$',
        PartnerVerificationRetrieveUpdateAPIView.as_view(), name="partner-verifications-detail"),
]

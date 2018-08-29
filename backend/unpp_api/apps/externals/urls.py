from django.conf.urls import url

from externals.views import (
    PartnerVendorNumberAPIView,
    PartnerExternalDetailsAPIView,
    PartnerBasicInfoAPIView,
)


urlpatterns = [
    url(r'^vendor-number/partner/$', PartnerVendorNumberAPIView.as_view(), name="vendor-number-create"),
    url(r'^vendor-number/partner/(?P<pk>\d+)/$', PartnerVendorNumberAPIView.as_view(), name="vendor-number-details"),
    url(
        r'^partner-details/(?P<agency_id>\d+)/(?P<partner_id>\d+)/$',
        PartnerExternalDetailsAPIView.as_view(),
        name="partner-external-details"
    ),
    url(
        r'^partner-basic-info/$',
        PartnerBasicInfoAPIView.as_view(),
        name="partner-basic-info"
    ),
]

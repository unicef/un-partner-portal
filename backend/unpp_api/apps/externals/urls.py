from django.conf.urls import url

from externals.views import (
    PartnerVendorNumberAPIView,
)


urlpatterns = [
    url(r'^vendor-number/partner/$', PartnerVendorNumberAPIView.as_view(), name="vendor-number-create"),
    url(r'^vendor-number/partner/(?P<pk>\d+)/$', PartnerVendorNumberAPIView.as_view(), name="vendor-number-details"),
]

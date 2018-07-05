from django.conf.urls import url

from reports.views import (
    PartnerProfileReportAPIView
)


urlpatterns = [
    url(r'^partner-information/$', PartnerProfileReportAPIView.as_view(), name="partner-information"),
]

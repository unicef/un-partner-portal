from django.conf.urls import url

from reports.views import (
    PartnerProfileReportAPIView,
    ProjectReportAPIView,
)


urlpatterns = [
    url(r'^partner-information/$', PartnerProfileReportAPIView.as_view(), name="partner-information"),
    url(r'^projects/$', ProjectReportAPIView.as_view(), name="projects"),
]

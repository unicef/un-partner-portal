from django.conf.urls import url

from reports.views import (
    PartnerProfileReportAPIView,
    ProjectReportAPIView,
    VerificationsAndObservationsReportAPIView,
)


urlpatterns = [
    url(r'^partners/$', PartnerProfileReportAPIView.as_view(), name="partner-information"),
    url(r'^projects/$', ProjectReportAPIView.as_view(), name="projects"),
    url(
        r'^verifications-observations/$',
        VerificationsAndObservationsReportAPIView.as_view(),
        name="verifications-observations"
    ),
]

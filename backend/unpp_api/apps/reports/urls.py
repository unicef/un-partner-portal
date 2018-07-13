from django.conf.urls import url

from reports.views import (
    PartnerProfileReportAPIView,
    ProjectReportAPIView,
    VerificationsAndObservationsReportAPIView,
    PartnerProfileReportXLSXReportAPIView,
    PartnerContactInformationReportXLSXReportAPIView,
)


urlpatterns = [
    url(r'^partners/$', PartnerProfileReportAPIView.as_view(), name="partner-information"),
    url(
        r'^partners/profile/export/xlsx/$',
        PartnerProfileReportXLSXReportAPIView.as_view(),
        name="partner-profile-export-xlsx"
    ),
    url(
        r'^partners/contact/export/xlsx/$',
        PartnerContactInformationReportXLSXReportAPIView.as_view(),
        name="partner-contact-export-xlsx"
    ),
    url(r'^projects/$', ProjectReportAPIView.as_view(), name="projects"),
    url(
        r'^verifications-observations/$',
        VerificationsAndObservationsReportAPIView.as_view(),
        name="verifications-observations"
    ),
]

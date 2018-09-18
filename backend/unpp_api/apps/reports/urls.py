from django.conf.urls import url

from reports.views import (
    PartnerProfileReportAPIView,
    ProjectReportAPIView,
    VerificationsAndObservationsReportAPIView,
    PartnerProfileReportXLSXReportAPIView,
    PartnerContactInformationReportXLSXReportAPIView,
    ProjectDetailsXLSXReportAPIView,
    PartnerVerificationsObservationsXLSXReportAPIView,
    PartnerMappingReportXLSXReportAPIView,
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
    url(
        r'^partners/mapping/export/xlsx/$',
        PartnerMappingReportXLSXReportAPIView.as_view(),
        name="partner-mapping-export-xlsx"
    ),
    url(r'^projects/$', ProjectReportAPIView.as_view(), name="projects"),
    url(
        r'^projects/details/export/xlsx/$',
        ProjectDetailsXLSXReportAPIView.as_view(),
        name="projects-details-export-xlsx"
    ),
    url(
        r'^verifications-observations/$',
        VerificationsAndObservationsReportAPIView.as_view(),
        name="verifications-observations"
    ),
    url(
        r'^verifications-observations/export/xlsx/$',
        PartnerVerificationsObservationsXLSXReportAPIView.as_view(),
        name="verifications-observations-export-xlsx"
    ),
]

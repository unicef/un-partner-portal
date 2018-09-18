from django.conf.urls import url

from partner.views import (
    OrganizationProfileAPIView,
    PartnerProfileAPIView,
    PartnerProfileSummaryAPIView,
    PartnersListAPIView,
    PartnerShortListAPIView,
    PartnerIdentificationAPIView,
    PartnerContactInformationAPIView,
    PartnerMandateMissionAPIView,
    PartnerFundingAPIView,
    PartnerCollaborationAPIView,
    PartnerProjectImplementationAPIView,
    PartnerOtherInfoAPIView,
    PartnerCountryProfileAPIView,
    PartnersMemberListAPIView,
)


urlpatterns = [
    url(r'^$', PartnersListAPIView.as_view(), name="partners"),
    url(r'^(?P<pk>\d+)/$', PartnerProfileAPIView.as_view(), name="partner-profile"),
    url(r'^(?P<pk>\d+)/country-profile/$', PartnerCountryProfileAPIView.as_view(), name="country-profile"),
    url(r'^(?P<pk>\d+)/org-profile$', OrganizationProfileAPIView.as_view(), name="org-profile"),
    url(r'^(?P<pk>\d+)/summary/$', PartnerProfileSummaryAPIView.as_view(), name="partner-profile-summary"),
    url(r'^(?P<pk>\d+)/identification/$', PartnerIdentificationAPIView.as_view(), name="identification"),
    url(r'^(?P<pk>\d+)/contact-information/$', PartnerContactInformationAPIView.as_view(), name="contact-information"),
    url(r'^(?P<pk>\d+)/mandate-mission/$', PartnerMandateMissionAPIView.as_view(), name="mandate-mission"),
    url(r'^(?P<pk>\d+)/funding/$', PartnerFundingAPIView.as_view(), name="funding"),
    url(r'^(?P<pk>\d+)/collaboration/$', PartnerCollaborationAPIView.as_view(), name="collaboration"),
    url(
        r'^(?P<pk>\d+)/project-implementation/$',
        PartnerProjectImplementationAPIView.as_view(),
        name="project-implementation"
    ),
    url(r'^(?P<pk>\d+)/other-info/$', PartnerOtherInfoAPIView.as_view(), name="other-info"),
    url(r'^short$', PartnerShortListAPIView.as_view(), name="partners-short"),
    url(r'^(?P<pk>\d+)/members/', PartnersMemberListAPIView.as_view(), name="members"),
]

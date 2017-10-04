from django.conf.urls import url

from .views import (
    OrganizationProfileAPIView,
    PartnerProfileAPIView,
    PartnersListAPIView,
    PartnerShortListAPIView,
    PartnersListItemAPIView,
    PartnerIdentificationAPIView,
    PartnerContactInformationAPIView,
    PartnerMandateMissionAPIView,
    PartnerFundingAPIView,
    PartnerCollaborationAPIView,
    PartnerProjectImplementationAPIView,
    PartnerOtherInfoAPIView,
    PartnerCountryProfileAPIView,
)


urlpatterns = [
    url(r'^(?P<pk>\d+)/country-profile/$', PartnerCountryProfileAPIView.as_view(), name="country-profile"),
    url(r'^(?P<pk>\d+)/org-profile$', OrganizationProfileAPIView.as_view(), name="org-profile"),
    url(r'^(?P<pk>\d+)/$', PartnerProfileAPIView.as_view(), name="partner-profile"),
    url(r'^(?P<pk>\d+)/identification/$', PartnerIdentificationAPIView.as_view(), name="identification"),
    url(r'^(?P<pk>\d+)/contact-information/$', PartnerContactInformationAPIView.as_view(), name="contact-information"),
    url(r'^(?P<pk>\d+)/mandate-mission/$', PartnerMandateMissionAPIView.as_view(), name="mandate-mission"),
    url(r'^(?P<pk>\d+)/funding/$', PartnerFundingAPIView.as_view(), name="funding"),
    url(r'^(?P<pk>\d+)/collaboration/$', PartnerCollaborationAPIView.as_view(), name="collaboration"),
    url(r'^(?P<pk>\d+)/project-implementation/$',
        PartnerProjectImplementationAPIView.as_view(),
        name="project-implementation"),
    url(r'^(?P<pk>\d+)/other-info/$', PartnerOtherInfoAPIView.as_view(), name="other-info"),
    url(r'^$', PartnersListAPIView.as_view(), name="partners"),
    url(r'^short$', PartnerShortListAPIView.as_view(), name="partners-short"),
    url(r'^(?P<pk>\d+)/partners-list-item$', PartnersListItemAPIView.as_view(), name="partners-list-item"),
]

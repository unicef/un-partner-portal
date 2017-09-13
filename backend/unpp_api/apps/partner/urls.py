from django.conf.urls import url

from .views import (
    OrganizationProfileAPIView,
    PartnerProfileAPIView,
    PartnersListAPIView,
    PartnerShortListAPIView,
    PartnersListItemAPIView,
)


urlpatterns = [
    url(r'^(?P<partner_id>\d+)/org-profile$', OrganizationProfileAPIView.as_view(), name="org-profile"),
    url(r'^(?P<partner_id>\d+)$', PartnerProfileAPIView.as_view(), name="partner-profile"),
    url(r'^$', PartnersListAPIView.as_view(), name="partners"),
    url(r'^short$', PartnerShortListAPIView.as_view(), name="partners-short"),
    url(r'^(?P<partner_id>\d+)/partners-list-item$', PartnersListItemAPIView.as_view(), name="partners-list-item"),
]

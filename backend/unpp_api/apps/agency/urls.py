from django.conf.urls import url

from agency.views import (
    AgencyListAPIView,
    AgencyOfficeListAPIView,
    AgencyOfficeMemberListAPIView,
    AgencyMemberListAPIView,
)

urlpatterns = [
    url(r'^$', AgencyListAPIView.as_view(), name="agencies"),
    url(r'^(?P<pk>\d+)/offices/$', AgencyOfficeListAPIView.as_view(), name="offices"),
    url(r'^(?P<pk>\d+)/members/$', AgencyOfficeMemberListAPIView.as_view(), name="agency-members"),
    url(r'^members/$', AgencyMemberListAPIView.as_view(), name="members"),
]

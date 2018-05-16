from django.conf.urls import url

from agency.views import (
    AgencyListAPIView,
    AgencyOfficeListAPIView,
    AgencyMemberListAPIView,
    AgencyMemberInviteAPIView,
)

urlpatterns = [
    url(r'^$', AgencyListAPIView.as_view(), name="agencies"),
    url(r'^(?P<pk>\d+)/offices/$', AgencyOfficeListAPIView.as_view(), name="offices"),
    url(r'^(?P<pk>\d+)/members/$', AgencyMemberListAPIView.as_view(), name="agency-members"),
    url(r'^members/$', AgencyMemberListAPIView.as_view(), name="members"),
    url(r'^member/$', AgencyMemberInviteAPIView.as_view(), name="invite-member"),
    url(r'^member/(?P<pk>\d+)/$', AgencyMemberInviteAPIView.as_view(), name="update-member"),
]

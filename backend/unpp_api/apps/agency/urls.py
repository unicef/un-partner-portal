from django.conf.urls import url

from .views import (AgencyListAPIView, AgencyOfficeListAPIView,
                    AgencyMemberListAPIView)

urlpatterns = [
    url(r'^$', AgencyListAPIView.as_view(), name="agencies"),
    url(r'^(?P<pk>\d+)/offices/$',
        AgencyOfficeListAPIView.as_view(),
        name="offices"),
    url(r'^(?P<pk>\d+)/members/$',
        AgencyMemberListAPIView.as_view(),
        name="members"),
]

from django.conf.urls import url

from .views import (
    OpenProjectAPIView,
    DirectProjectAPIView,
    PinProjectAPIView,
    EOIAPIView,
    ApplicationsPartnerAPIView,
    ApplicationsAgencyAPIView,
    ApplicationAPIView,
    ApplicationsListAPIView,
    ReviewersStatusAPIView,
    ReviewerAssessmentsAPIView,
)


urlpatterns = [
    url(r'^(?P<pk>\d+)/$', EOIAPIView.as_view(), name="eoi-detail"),
    url(r'^(?P<pk>\d+)/partner-applications/$', ApplicationsPartnerAPIView.as_view(), name="partner-applications"),
    url(r'^(?P<pk>\d+)/agency-applications/$', ApplicationsAgencyAPIView.as_view(), name="agency-applications"),
    url(r'^applications/(?P<application_id>\d+)/reviewers-status/',
        ReviewersStatusAPIView.as_view(),
        name="reviewers-status"),
    url(r'^applications/(?P<application_id>\d+)/reviewer-assessments/',
        ReviewerAssessmentsAPIView.as_view(),
        name="reviewer-assessments"),
    url(r'^applications/(?P<application_id>\d+)/reviewer-assessments/(?P<pk>\d+)/',
        ReviewerAssessmentsAPIView.as_view(),
        name="reviewer-assessments"),
    url(r'^application/(?P<pk>\d+)/$', ApplicationAPIView.as_view(), name="application"),
    url(r'^(?P<pk>\d+)/applications/$', ApplicationsListAPIView.as_view(), name="applications"),
    url(r'^open/$', OpenProjectAPIView.as_view(), name="open"),
    url(r'^direct/$', DirectProjectAPIView.as_view(), name="direct"),
    url(r'^pins/$', PinProjectAPIView.as_view(), name="pins"),
]

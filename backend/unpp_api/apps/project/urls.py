from django.conf.urls import url

from .views import (
    OpenProjectAPIView,
    DirectProjectAPIView,
    PinProjectAPIView,
    UnsolicitedProjectAPIView,
    EOIAPIView,
    ApplicationsPartnerAPIView,
    ApplicationPartnerAPIView,
    ApplicationsAgencyAPIView,
    ApplicationAPIView,
    ApplicationsListAPIView,
    AppsPartnerOpenAPIView,
    AppsPartnerUnsolicitedAPIView,
    AppsPartnerDirectAPIView,
    ReviewersStatusAPIView,
    ReviewerAssessmentsAPIView,
    ApplicationFeedbackListCreateAPIView,
    ConvertUnsolicitedAPIView,
)


urlpatterns = [
    url(r'^(?P<pk>\d+)/$', EOIAPIView.as_view(), name="eoi-detail"),
    url(r'^(?P<pk>\d+)/partner-applications/$', ApplicationsPartnerAPIView.as_view(), name="partner-applications"),
    url(r'^(?P<pk>\d+)/partner-application/$', ApplicationPartnerAPIView.as_view(), name="partner-application"),
    url(r'^(?P<pk>\d+)/agency-applications/$', ApplicationsAgencyAPIView.as_view(), name="agency-applications"),
    url(r'^applications/(?P<application_id>\d+)/reviewers-status/',
        ReviewersStatusAPIView.as_view(),
        name="reviewers-status"),
    url(r'^applications/(?P<application_id>\d+)/reviewer-assessments/(?P<reviewer_id>\d+)/',
        ReviewerAssessmentsAPIView.as_view(),
        name="reviewer-assessments"),
    url(r'^applications/(?P<application_id>\d+)/reviewer-assessments/',
        ReviewerAssessmentsAPIView.as_view(),
        name="reviewer-assessments"),
    url(r'^application/(?P<pk>\d+)/$', ApplicationAPIView.as_view(), name="application"),
    url(r'^application/(?P<pk>\d+)/feedback/$',
        ApplicationFeedbackListCreateAPIView.as_view(),
        name="application-feedback"),
    url(r'^(?P<pk>\d+)/applications/$', ApplicationsListAPIView.as_view(), name="applications"),
    url(r'^open/$', OpenProjectAPIView.as_view(), name="open"),
    url(r'^direct/$', DirectProjectAPIView.as_view(), name="direct"),
    url(r'^pins/$', PinProjectAPIView.as_view(), name="pins"),
    url(r'^unsolicited/$', UnsolicitedProjectAPIView.as_view(), name="unsolicited"),
    url(r'^convert-unsolicited/(?P<pk>\d+)/$', ConvertUnsolicitedAPIView.as_view(), name="convert-unsolicited"),

    url(r'^applications/open/$', AppsPartnerOpenAPIView.as_view(), name="applications-open"),
    url(r'^applications/unsolicited/$', AppsPartnerUnsolicitedAPIView.as_view(), name="applications-unsolicited"),
    url(r'^applications/direct/$', AppsPartnerDirectAPIView.as_view(), name="applications-direct"),
]

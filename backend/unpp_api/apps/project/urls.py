from django.conf.urls import url

from project.views import (
    OpenProjectAPIView,
    DirectProjectAPIView,
    PinProjectAPIView,
    UnsolicitedProjectListAPIView,
    EOIAPIView,
    PartnerEOIApplicationCreateAPIView,
    PartnerEOIApplicationRetrieveAPIView,
    AgencyEOIApplicationCreateAPIView,
    AgencyEOIApplicationDestroyAPIView,
    AgencyApplicationListAPIView,
    ApplicationAPIView,
    EOIApplicationsListAPIView,
    PartnerApplicationOpenListAPIView,
    UCNListCreateAPIView,
    PartnerApplicationDirectListCreateAPIView,
    ReviewersStatusAPIView,
    ReviewerAssessmentsAPIView,
    ApplicationFeedbackListCreateAPIView,
    ConvertUnsolicitedAPIView,
    ReviewSummaryAPIView,
    EOIReviewersAssessmentsListAPIView,
    AwardedPartnersListAPIView,
    CompareSelectedListAPIView,
    EOIReviewersAssessmentsNotifyAPIView,
    PublishCFEIAPIView,
    EOISendToPublishAPIView,
    UCNManageAPIView,
)


urlpatterns = [
    url(r'^(?P<pk>\d+)/$', EOIAPIView.as_view(), name="eoi-detail"),
    url(r'^(?P<pk>\d+)/publish/$', PublishCFEIAPIView.as_view(), name="eoi-publish"),
    url(r'^(?P<pk>\d+)/send-to-publish/$', EOISendToPublishAPIView.as_view(), name="eoi-send-to-publish"),
    url(r'^applications/$', AgencyApplicationListAPIView.as_view(), name="agency-applications-list"),
    url(r'^(?P<pk>\d+)/partner-applications/$',
        PartnerEOIApplicationCreateAPIView.as_view(),
        name="partner-applications"),
    url(r'^(?P<pk>\d+)/partner-application/$',
        PartnerEOIApplicationRetrieveAPIView.as_view(),
        name="partner-application"),
    url(r'^(?P<pk>\d+)/agency-applications/$', AgencyEOIApplicationCreateAPIView.as_view(), name="agency-applications"),
    url(r'^(?P<eoi_id>\d+)/agency-applications-delete/(?P<pk>\d+)/$',
        AgencyEOIApplicationDestroyAPIView.as_view(), name="agency-applications-delete"),
    url(r'^(?P<pk>\d+)/review-summary/$', ReviewSummaryAPIView.as_view(), name="review-summary"),
    url(r'^applications/(?P<application_id>\d+)/reviewers-status/',
        ReviewersStatusAPIView.as_view(),
        name="reviewers-status"),
    url(r'^applications/(?P<application_id>\d+)/reviewer-assessments/(?P<reviewer_id>\d+)/',
        ReviewerAssessmentsAPIView.as_view(),
        name="reviewer-assessments"),
    url(r'^applications/(?P<application_id>\d+)/reviewer-assessments/',
        ReviewerAssessmentsAPIView.as_view(),
        name="reviewer-assessments"),
    url(r'^(?P<eoi_id>\d+)/applications/reviewers/$',
        EOIReviewersAssessmentsListAPIView.as_view(),
        name="eoi-reviewers-assessments"),
    url(r'^(?P<eoi_id>\d+)/applications/compare-selected/',
        CompareSelectedListAPIView.as_view(),
        name="compare-selected"),
    url(r'^(?P<eoi_id>\d+)/applications/reviewers/(?P<reviewer_id>\d+)/notify/$',
        EOIReviewersAssessmentsNotifyAPIView.as_view(),
        name="eoi-reviewers-assessments-notify"),
    url(r'^(?P<eoi_id>\d+)/applications/awarded-partners/',
        AwardedPartnersListAPIView.as_view(),
        name="applications-awarded-partners"),
    url(r'^application/(?P<pk>\d+)/$', ApplicationAPIView.as_view(), name="application"),
    url(r'^application/(?P<pk>\d+)/feedback/$',
        ApplicationFeedbackListCreateAPIView.as_view(),
        name="application-feedback"),
    url(r'^(?P<pk>\d+)/applications/$', EOIApplicationsListAPIView.as_view(), name="applications"),
    url(r'^open/$', OpenProjectAPIView.as_view(), name="open"),
    url(r'^direct/$', DirectProjectAPIView.as_view(), name="direct"),
    url(r'^pins/$', PinProjectAPIView.as_view(), name="pins"),
    url(r'^unsolicited/$', UnsolicitedProjectListAPIView.as_view(), name="unsolicited"),
    url(r'^application/(?P<pk>\d+)/convert-unsolicited/$',
        ConvertUnsolicitedAPIView.as_view(),
        name="convert-unsolicited"),
    url(r'^applications/open/$', PartnerApplicationOpenListAPIView.as_view(), name="applications-open"),
    url(r'^applications/unsolicited/$',
        UCNListCreateAPIView.as_view(),
        name="applications-unsolicited"),
    url(r'^applications/unsolicited/(?P<pk>\d+)/manage/$', UCNManageAPIView.as_view(), name="ucn-manage"),
    url(r'^applications/direct/$', PartnerApplicationDirectListCreateAPIView.as_view(), name="applications-direct"),
]

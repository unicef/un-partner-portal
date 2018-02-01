# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf.urls import url

from dashboard.views import (
    DashboardAPIView,
    SubmittedCNListAPIView,
    PendingOffersListAPIView,
    ApplicationsToScoreListAPIView,
    ApplicationsPartnerDecisionsListAPIView,
    CurrentUsersActiveProjectsAPIView,
)

urlpatterns = [
    url(r'^$', DashboardAPIView.as_view(), name="main"),
    # agency dashboard
    url(r'^applications-to-score/$', ApplicationsToScoreListAPIView.as_view(), name="applications-to-score"),
    url(r'^applications-decisions/$', ApplicationsPartnerDecisionsListAPIView.as_view(), name="applications-decisions"),
    # partner dashboard
    url(r'^submitted-cn/$', SubmittedCNListAPIView.as_view(), name="submitted-cn"),
    url(r'^pending-offers/$', PendingOffersListAPIView.as_view(), name="pending-offers"),
    url(r'^open-projects/$', CurrentUsersActiveProjectsAPIView.as_view(), name="open-projects"),
]

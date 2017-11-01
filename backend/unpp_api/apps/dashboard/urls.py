# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf.urls import url

from .views import (DashboardAPIView,
                    ApplicationsToScoreListAPIView,
                    ApplicationsPartnerDecisionsListAPIView)

urlpatterns = [
    url(r'^$', DashboardAPIView.as_view(), name="main"),
    url(r'^applications-to-score/$', ApplicationsToScoreListAPIView.as_view(), name="applications-to-score"),
    url(r'^applications-decisions/$', ApplicationsPartnerDecisionsListAPIView.as_view(), name="applications-decisions"),
]

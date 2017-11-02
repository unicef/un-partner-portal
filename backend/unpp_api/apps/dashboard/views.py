# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from datetime import datetime, timedelta

from django.http import Http404

from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated

from common.permissions import IsAtLeastMemberReader
from common.paginations import MediumPagination
from project.serializers import ApplicationFullSerializer
from project.models import Application
from .serializers import AgencyDashboardSerializer, PartnerDashboardSerializer


class DashboardAPIView(RetrieveAPIView):
    """
    Generic Dashboard view for partner or agency user
    """
    permission_classes = (IsAuthenticated, IsAtLeastMemberReader, )

    def get_serializer_class(self):
        if self.request.user.is_agency_user:
            return AgencyDashboardSerializer
        if self.request.user.is_partner_user:
            return PartnerDashboardSerializer
        raise Http404('User has no relation to agency or partners')

    def get_object(self):
        if self.request.user.is_agency_user:
            return self.request.user.get_agency()
        if self.request.user.is_partner_user:
            return self.request.active_partner
        raise Http404('User has no relation to agency or partners')


class ApplicationsToScoreListAPIView(ListAPIView):
    """
    Returns list of applications needing scoring for agency user
    """

    serializer_class = ApplicationFullSerializer
    permission_classes = (IsAuthenticated, IsAtLeastMemberReader, )
    pagination_class = MediumPagination

    def get_queryset(self):
        user = self.request.user
        open_eois_as_reviewer = user.eoi_as_reviewer.filter(completed_reason=None, completed_date=None)
        return Application.objects.filter(eoi__in=open_eois_as_reviewer).exclude(assessments__reviewer=user)


class ApplicationsPartnerDecisionsListAPIView(ListAPIView):
    """
    Returns list of applications where decision made recently
    """

    DAYS_AGO = 5
    serializer_class = ApplicationFullSerializer
    permission_classes = (IsAuthenticated, IsAtLeastMemberReader, )
    pagination_class = MediumPagination

    def get_queryset(self):
        date_N_days_ago = datetime.now() - timedelta(days=self.DAYS_AGO)
        user = self.request.user
        agency = user.get_agency()
        won_applications = Application.objects.filter(eoi__agency=agency,
                                                      did_win=True,
                                                      did_accept_date__gte=date_N_days_ago).exclude(is_unsolicited=True)

        return won_applications.filter(did_accept=True) | won_applications.filter(did_decline=True)

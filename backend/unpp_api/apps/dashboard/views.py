# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from datetime import datetime, timedelta, date

from django.db.models import Q
from django.http import Http404

from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated

from agency.permissions import AgencyPermission
from common.consts import CFEI_TYPES
from common.permissions import HasUNPPPermission
from common.mixins import PartnerIdsMixin
from common.pagination import MediumPagination, SmallPagination
from project.serializers import ApplicationFullEOISerializer, SubmittedCNSerializer, PendingOffersSerializer, \
    AgencyProjectSerializer
from project.models import Application, EOI
from .serializers import AgencyDashboardSerializer, PartnerDashboardSerializer


class DashboardAPIView(RetrieveAPIView):
    """
    Generic Dashboard view for partner or agency user
    """
    permission_classes = (
        IsAuthenticated,
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.VIEW_DASHBOARD,
            ]
        ),
    )

    def get_serializer_class(self):
        if self.request.user.is_agency_user:
            return AgencyDashboardSerializer
        if self.request.user.is_partner_user:
            return PartnerDashboardSerializer
        raise Http404('User has no relation to agency or partners')

    def get_object(self):
        if self.request.user.is_agency_user:
            return self.request.user.agency
        if self.request.user.is_partner_user:
            return self.request.active_partner
        raise Http404('User has no relation to agency or partners')


class ApplicationsToScoreListAPIView(ListAPIView):
    """
    Returns list of applications needing scoring for agency user
    """

    serializer_class = ApplicationFullEOISerializer
    permission_classes = (
        HasUNPPPermission(
            # TODO: Permissions
        ),
    )
    pagination_class = MediumPagination

    def get_queryset(self):
        user = self.request.user
        open_eois_as_reviewer = user.eoi_as_reviewer.filter(completed_reason=None, completed_date=None)
        return Application.objects.filter(
            eoi__in=open_eois_as_reviewer
        ).exclude(assessments__reviewer=user).order_by('eoi__modified').distinct('eoi__modified', 'eoi')


class CurrentUsersActiveProjectsAPIView(ListAPIView):
    """
    Returns list of projects where deadline hasn't been reached yet, for which user is creator or focal point
    """

    queryset = EOI.objects.select_related("agency").prefetch_related("specializations").distinct()
    serializer_class = AgencyProjectSerializer
    permission_classes = (
        HasUNPPPermission(
            # TODO: Permissions
        ),
    )
    pagination_class = SmallPagination

    def get_queryset(self):
        user = self.request.user
        today = date.today()
        queryset = self.queryset.filter(display_type=CFEI_TYPES.open, deadline_date__gte=today, is_completed=False)
        queryset = queryset.filter(
            Q(created_by=user) | Q(focal_points=user)
        )

        return queryset


class ApplicationsPartnerDecisionsListAPIView(ListAPIView):
    """
    Returns list of applications where decision made recently
    """

    DAYS_AGO = 5
    serializer_class = ApplicationFullEOISerializer
    permission_classes = (
        HasUNPPPermission(
            # TODO: Permissions
        ),
    )
    pagination_class = MediumPagination

    def get_queryset(self):
        date_N_days_ago = datetime.now() - timedelta(days=self.DAYS_AGO)
        user = self.request.user
        agency = user.agency
        won_applications = Application.objects.filter(eoi__agency=agency,
                                                      decision_date__gte=date_N_days_ago,
                                                      did_win=True).exclude(is_unsolicited=True)

        return won_applications.filter(did_accept=True) | won_applications.filter(did_decline=True)


class SubmittedCNListAPIView(PartnerIdsMixin, ListAPIView):
    """
    Returns list of partner submitted concept notes
    """
    serializer_class = SubmittedCNSerializer
    permission_classes = (
        HasUNPPPermission(
            #  TODO: Permissions
        ),
    )
    pagination_class = SmallPagination

    def get_queryset(self):
        return Application.objects.filter(partner_id__in=self.get_partner_ids())


class PendingOffersListAPIView(PartnerIdsMixin, ListAPIView):
    """
    Returns list of pending offers for partner
    """
    serializer_class = PendingOffersSerializer
    permission_classes = (
        HasUNPPPermission(
            #  TODO: Permissions
        ),
    )
    pagination_class = SmallPagination

    def get_queryset(self):
        return Application.objects.filter(
            did_win=True,
            did_accept=False,
            did_withdraw=False,
            decision_date__isnull=True,
            did_decline=False,
            partner_id__in=self.get_partner_ids()
        )

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from datetime import datetime, timedelta, date

from django.db.models import Q
from django.http import Http404

from rest_framework.generics import RetrieveAPIView, ListAPIView

from agency.permissions import AgencyPermission
from common.consts import CFEI_TYPES
from common.permissions import HasUNPPPermission
from common.mixins.views import PartnerIdsMixin
from common.pagination import MediumPagination, SmallPagination
from partner.permissions import PartnerPermission
from project.serializers import ApplicationFullEOISerializer, SubmittedCNSerializer, PendingOffersSerializer, \
    AgencyProjectSerializer
from project.models import Application, EOI
from dashboard.serializers import AgencyDashboardSerializer, PartnerDashboardSerializer


class DashboardAPIView(RetrieveAPIView):
    """
    Generic Dashboard view for partner or agency user
    """
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.VIEW_DASHBOARD,
            ],
            partner_permissions=[
                PartnerPermission.VIEW_DASHBOARD,
            ],
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
            agency_permissions=[
                AgencyPermission.CFEI_REVIEW_APPLICATIONS,
            ],
        ),
    )
    pagination_class = MediumPagination

    def get_queryset(self):
        user = self.request.user
        return Application.objects.filter(
            eoi__reviewers=user,
            eoi__completed_reason=None,
            eoi__completed_date=None,
        ).exclude(assessments__reviewer=user).order_by('eoi__modified').distinct('eoi__modified', 'eoi')


class CurrentUsersOpenProjectsAPIView(ListAPIView):

    queryset = EOI.objects.select_related("agency").prefetch_related("specializations").distinct()
    serializer_class = AgencyProjectSerializer
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW
            ]
        ),
    )
    pagination_class = SmallPagination

    def get_queryset(self):
        valid_ids = EOI.objects.filter(
            Q(created_by=self.request.user) | Q(focal_points=self.request.user)
        ).values_list('id', flat=True).distinct()

        return super(CurrentUsersOpenProjectsAPIView, self).get_queryset().filter(
            id__in=valid_ids, display_type=CFEI_TYPES.open, deadline_date__gte=date.today(), is_completed=False
        )


class ApplicationsPartnerDecisionsListAPIView(ListAPIView):
    """
    Returns list of applications where decision made recently
    """

    DAYS_AGO = 5
    serializer_class = ApplicationFullEOISerializer
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CFEI_VIEW
            ]
        ),
    )
    pagination_class = MediumPagination

    def get_queryset(self):
        won_applications = Application.objects.filter(
            eoi__agency=self.request.user.agency,
            partner_decision_date__gte=datetime.now() - timedelta(days=self.DAYS_AGO),
            did_win=True
        ).filter(
            Q(did_accept=True) | Q(did_decline=True)
        ).exclude(
            is_unsolicited=True
        )

        return won_applications


class SubmittedCNListAPIView(PartnerIdsMixin, ListAPIView):
    """
    Returns list of partner submitted concept notes
    """
    serializer_class = SubmittedCNSerializer
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[
                PartnerPermission.CFEI_VIEW,
            ]
        ),
    )
    pagination_class = SmallPagination

    def get_queryset(self):
        applications = Application.objects.filter(partner_id__in=self.get_partner_ids())
        applications = applications.filter(
            Q(eoi=None) | Q(eoi__is_published=True)
        )

        return applications


class PendingOffersListAPIView(PartnerIdsMixin, ListAPIView):
    """
    Returns list of pending offers for partner
    """
    serializer_class = PendingOffersSerializer
    permission_classes = (
        HasUNPPPermission(
            partner_permissions=[
                PartnerPermission.CFEI_VIEW,
            ]
        ),
    )
    pagination_class = SmallPagination

    def get_queryset(self):
        return Application.objects.filter(
            did_win=True,
            did_accept=False,
            did_withdraw=False,
            partner_decision_date__isnull=True,
            did_decline=False,
            partner_id__in=self.get_partner_ids()
        )

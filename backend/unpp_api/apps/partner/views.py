# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import get_object_or_404
# from rest_framework import status as statuses
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from common.permissions import IsAtLeastMemberEditor
from common.paginations import SmallPagination
from .serializers import (
    OrganizationProfileSerializer,
    OrganizationProfileDetailsSerializer,
    PartnersListSerializer,
    PartnersListItemSerializer,
)
from .filters import PartnersListFilter
from .models import (
    Partner,
    PartnerProfile,
    PartnerMailingAddress,
    PartnerDirector,
    PartnerAuthorisedOfficer,
    PartnerHeadOrganization,
    PartnerMandateMission,
    PartnerExperience,
    PartnerBudget,
    PartnerFunding,
    PartnerCollaborationPartnership,
    PartnerCollaborationPartnershipOther,
    PartnerCollaborationEvidence,
    PartnerOtherInfo,
    PartnerOtherDocument,
    PartnerInternalControl,
    PartnerPolicyArea,
    PartnerAuditAssessment,
    PartnerReporting,
)


class OrganizationProfileAPIView(APIView):
    """
    Endpoint for getting Organization Profile.
    """
    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)

    def get_object(self, pk):
        return get_object_or_404(Partner, id=pk)

    def get(self, request, partner_id, format=None):
        org_profile = self.get_object(partner_id)
        serializer = OrganizationProfileSerializer(org_profile)
        return Response(serializer.data)


class PartnerProfileAPIView(APIView):

    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)

    def get(self, request, partner_id, format=None):
        partner = get_object_or_404(Partner, id=partner_id)
        profile = get_object_or_404(PartnerProfile, partner=partner)
        mailing = get_object_or_404(PartnerMailingAddress, partner=partner)
        directors = PartnerDirector.objects.filter(partner=partner)
        authorised_officers = PartnerAuthorisedOfficer.objects.filter(partner=partner)
        head_organization = get_object_or_404(PartnerHeadOrganization, partner=partner)
        mandate_mission = get_object_or_404(PartnerMandateMission, partner=partner)
        experiences = PartnerExperience.objects.filter(partner=partner)
        budgets = PartnerBudget.objects.filter(partner=partner)
        fund = get_object_or_404(PartnerFunding, partner=partner)
        collaborations_partnership = PartnerCollaborationPartnership.objects.filter(partner=partner)
        collaborations_partnership_others = PartnerCollaborationPartnershipOther.objects.filter(partner=partner)
        collaboration_evidences = PartnerCollaborationEvidence.objects.filter(partner=partner)
        other_info = get_object_or_404(PartnerOtherInfo, partner=partner)
        other_documents = PartnerOtherDocument.objects.filter(partner=partner)
        internal_controls = PartnerInternalControl.objects.filter(partner=partner)
        area_policies = PartnerPolicyArea.objects.filter(partner=partner)
        audit_assessment = get_object_or_404(PartnerAuditAssessment, partner=partner)
        report = get_object_or_404(PartnerReporting, partner=partner)
        serializer = OrganizationProfileDetailsSerializer(dict(
            partner=partner,
            profile=profile,
            mailing=mailing,
            directors=directors,
            authorised_officers=authorised_officers,
            head_organization=head_organization,
            mandate_mission=mandate_mission,
            experiences=experiences,
            budgets=budgets,
            fund=fund,
            collaborations_partnership=collaborations_partnership,
            collaborations_partnership_others=collaborations_partnership_others,
            collaboration_evidences=collaboration_evidences,
            other_info=other_info,
            other_documents=other_documents,
            internal_controls=internal_controls,
            area_policies=area_policies,
            audit_assessment=audit_assessment,
            report=report,
        ))
        return Response(serializer.data)


class PartnersListAPIView(ListAPIView):

    permission_classes = (IsAuthenticated, )
    queryset = Partner.objects.all()
    serializer_class = PartnersListSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )
    filter_class = PartnersListFilter


class PartnersListItemAPIView(APIView):

    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)

    def get(self, request, partner_id, format=None):
        mailing = get_object_or_404(PartnerMailingAddress, partner_id=partner_id)
        head_organization = get_object_or_404(PartnerHeadOrganization, partner_id=partner_id)
        profile = get_object_or_404(PartnerProfile, partner_id=partner_id)
        experiences = PartnerExperience.objects.filter(partner_id=partner_id)

        serializer = PartnersListItemSerializer(dict(
            mailing=mailing,
            head_organization=head_organization,
            working_languages=profile and profile.working_languages,
            experiences=experiences
        ))
        return Response(serializer.data)

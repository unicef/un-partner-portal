# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import get_object_or_404
# from rest_framework import status as statuses
# from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
# from django_filters.rest_framework import DjangoFilterBackend
from common.permissions import IsAtLeastMemberEditor
from .serializers import OrganizationProfileSerializer, OrganizationProfileDetailsSerializer
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
        funding = get_object_or_404(PartnerFunding, partner=partner)
        collaborations_partnership = PartnerCollaborationPartnership.objects.filter(partner=partner)
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
            funding=funding,
            collaborations_partnership=collaborations_partnership,
        ))
        return Response(serializer.data)

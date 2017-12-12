# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from account.serializers import PartnerMemberSerializer
from common.permissions import (
    IsPartner,
    IsAtLeastEditorPartnerOnNotGET,
    IsRoleAdministratorOnNotGET,
)
from common.paginations import SmallPagination
from common.mixins import PatchOneFieldErrorMixin
from .serializers import (
    OrganizationProfileSerializer,
    OrganizationProfileDetailsSerializer,
    PartnerProfileSummarySerializer,
    PartnersListSerializer,
    PartnerShortSerializer,
    PartnerIdentificationSerializer,
    PartnerContactInformationSerializer,
    PartnerProfileMandateMissionSerializer,
    PartnerProfileFundingSerializer,
    PartnerProfileCollaborationSerializer,
    PartnerProfileProjectImplementationSerializer,
    PartnerProfileOtherInfoSerializer,
    PartnerCountryProfileSerializer,
)
from .filters import PartnersListFilter
from .models import (
    Partner,
    PartnerProfile,
    PartnerMember,
)


class OrganizationProfileAPIView(RetrieveAPIView):
    """
    Endpoint for getting Organization Profile.
    """
    permission_classes = (IsAuthenticated, IsPartner)
    serializer_class = OrganizationProfileSerializer
    queryset = Partner.objects.all()


class PartnerProfileAPIView(RetrieveAPIView):

    permission_classes = (IsAuthenticated, )
    serializer_class = OrganizationProfileDetailsSerializer
    queryset = Partner.objects.all()
    queryset = Partner.objects.\
        prefetch_related("directors", "authorised_officers", "experiences", "budgets", "hq__budgets",
                         "collaborations_partnership", "collaboration_evidences", "internal_controls",
                         "area_policies", "location_field_offices", "collaboration_evidences__evidence_file",
                         "collaborations_partnership__agency").\
        select_related("profile", "mailing_address", "org_head", "hq__org_head", "mandate_mission", "fund",
                       "other_info", "audit", "report", "report__report", "profile__gov_doc",
                       "profile__registration_doc", "audit__most_recent_audit_report", "audit__assessment_report",
                       "mandate_mission__governance_organigram", "mandate_mission__ethic_safeguard_policy",
                       "mandate_mission__ethic_fraud_policy", "other_info__org_logo", "other_info__other_doc_1",
                       "other_info__other_doc_2", "other_info__other_doc_3").\
        all()


class PartnerProfileSummaryAPIView(RetrieveAPIView):

    permission_classes = (IsAuthenticated, )
    serializer_class = PartnerProfileSummarySerializer
    # TODO: add select related and prefetch_related to other queryset in the UNPP system
    queryset = Partner.objects.\
        prefetch_related("experiences", "experiences__specialization", "collaborations_partnership", 'budgets',
                         "hq__budgets", "collaborations_partnership__agency").\
        select_related('location_of_office', 'org_head', 'mailing_address', 'mandate_mission', 'profile',
                       'report', 'hq', 'hq__org_head')\
        .all()


class PartnersListAPIView(ListAPIView):

    permission_classes = (IsAuthenticated, )
    queryset = Partner.objects.all()
    serializer_class = PartnersListSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, )
    filter_class = PartnersListFilter


class PartnerShortListAPIView(ListAPIView):

    permission_classes = (IsAuthenticated, )
    queryset = Partner.objects.all()
    serializer_class = PartnerShortSerializer
    filter_backends = (DjangoFilterBackend, )
    filter_class = PartnersListFilter


class PartnerIdentificationAPIView(PatchOneFieldErrorMixin, RetrieveUpdateAPIView):
    """
    PartnerIdentificationAPIView endpoint return specific partner profile data via serializer,
    by given pk (PartnerProfile)
    """
    permission_classes = (IsAuthenticated, IsAtLeastEditorPartnerOnNotGET)
    serializer_class = PartnerIdentificationSerializer
    queryset = PartnerProfile.objects.\
        select_related('partner', 'partner__other_info', 'partner__mailing_address', 'partner__mandate_mission',
                       'partner__audit', 'partner__report', 'gov_doc', 'registration_doc').all()


class PartnerContactInformationAPIView(PatchOneFieldErrorMixin, RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastEditorPartnerOnNotGET)
    serializer_class = PartnerContactInformationSerializer
    queryset = Partner.objects.\
        prefetch_related("directors", "authorised_officers").\
        select_related('mailing_address', 'profile', 'org_head', 'hq__org_head').all()


class PartnerMandateMissionAPIView(PatchOneFieldErrorMixin, RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastEditorPartnerOnNotGET)
    serializer_class = PartnerProfileMandateMissionSerializer
    queryset = Partner.objects.all()


class PartnerFundingAPIView(PatchOneFieldErrorMixin, RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastEditorPartnerOnNotGET)
    serializer_class = PartnerProfileFundingSerializer
    queryset = Partner.objects.all()


class PartnerCollaborationAPIView(PatchOneFieldErrorMixin, RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastEditorPartnerOnNotGET)
    serializer_class = PartnerProfileCollaborationSerializer
    queryset = Partner.objects.all()


class PartnerProjectImplementationAPIView(PatchOneFieldErrorMixin, RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastEditorPartnerOnNotGET)
    serializer_class = PartnerProfileProjectImplementationSerializer
    queryset = Partner.objects.all()


class PartnerOtherInfoAPIView(PatchOneFieldErrorMixin, RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastEditorPartnerOnNotGET)
    serializer_class = PartnerProfileOtherInfoSerializer
    queryset = Partner.objects.all()


class PartnerCountryProfileAPIView(CreateAPIView, RetrieveAPIView):

    permission_classes = (IsAuthenticated, IsPartner, IsRoleAdministratorOnNotGET)
    serializer_class = PartnerCountryProfileSerializer
    queryset = Partner.objects.all()


class PartnersMemberListAPIView(ListAPIView):

    permission_classes = (IsAuthenticated, )
    serializer_class = PartnerMemberSerializer
    queryset = PartnerMember.objects.select_related("user").all()
    pagination_class = SmallPagination
    lookup_field = 'pk'

    def get_queryset(self, *args, **kwargs):
        partner_id = self.kwargs.get(self.lookup_field)
        return self.queryset.filter(partner_id=partner_id)

from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import serializers

from agency.serializers import AgencySerializer
from common.consts import (
    FINANCIAL_CONTROL_SYSTEM_CHOICES,
    METHOD_ACC_ADOPTED_CHOICES,
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    PARTNER_TYPES,
    POLICY_AREA_CHOICES,
)
from common.defaults import ActivePartnerIDDefault
from common.mixins.serializers import SkipUniqueTogetherValidationOnPatchMixin
from common.models import Point
from common.countries import COUNTRIES_ALPHA2_CODE_DICT
from common.serializers import (
    CommonFileSerializer,
    SpecializationSerializer,
    MixinPartnerRelatedSerializer,
    MixinPreventManyCommonFile,
    PointSerializer,
    CommonFileBase64UploadSerializer,
)
from externals.serializers import PartnerVendorNumberSerializer

from partner.utilities import get_recent_budgets_for_partner
from partner.models import (
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
    PartnerCollaborationEvidence,
    PartnerOtherInfo,
    PartnerInternalControl,
    PartnerPolicyArea,
    PartnerAuditAssessment,
    PartnerAuditReport,
    PartnerReporting,
    PartnerMember,
    PartnerCapacityAssessment,
    PartnerGoverningDocument,
    PartnerRegistrationDocument,
)


class PartnerGoverningDocumentSerializer(serializers.ModelSerializer):

    created_by = serializers.HiddenField(default=serializers.CreateOnlyDefault(serializers.CurrentUserDefault()))
    document = CommonFileBase64UploadSerializer()

    class Meta:
        model = PartnerGoverningDocument
        fields = (
            'id',
            'created_by',
            'document',
            'editable',
        )
        extra_kwargs = {
            'editable': {
                'read_only': True
            }
        }


class PartnerRegistrationDocumentSerializer(serializers.ModelSerializer):

    created_by = serializers.HiddenField(default=serializers.CreateOnlyDefault(serializers.CurrentUserDefault()))
    document = CommonFileBase64UploadSerializer()

    class Meta:
        model = PartnerRegistrationDocument
        fields = (
            'id',
            'created_by',
            'document',
            'registration_number',
            'editable',
            'issuing_authority',
            'issue_date',
            'expiry_date',
        )
        extra_kwargs = {
            'editable': {
                'read_only': True
            }
        }


class PartnerSimpleSerializer(serializers.ModelSerializer):

    class Meta:
        model = Partner
        fields = (
            'id',
            'legal_name',
        )


class PartnerAdditionalSerializer(serializers.ModelSerializer):

    hq = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = (
            'id',
            'legal_name',
            'flagging_status',
            'is_verified',
            'has_finished',
            'hq',
            'has_potential_sanction_match',
            'can_be_verified',
        )

    def get_hq(self, partner):
        if getattr(partner, 'hq', None):
            return PartnerAdditionalSerializer(instance=partner.hq).data


class PartnerSerializer(serializers.ModelSerializer):

    is_hq = serializers.BooleanField(read_only=True)
    logo = CommonFileSerializer(source='other_info.org_logo', read_only=True)
    org_logo_thumbnail = serializers.ImageField(source='other_info.org_logo_thumbnail', read_only=True)
    partner_additional = PartnerAdditionalSerializer(source='*', read_only=True)
    last_profile_update = serializers.DateTimeField(source='last_update_timestamp', read_only=True, allow_null=True)
    country_display = serializers.CharField(source='get_country_code_display', read_only=True)

    class Meta:
        model = Partner
        fields = (
            'id',
            'is_hq',
            'hq_id',
            'logo',
            'legal_name',
            'country_code',
            'country_display',
            'display_type',
            'partner_additional',
            'org_logo_thumbnail',
            'last_profile_update',
        )


class PartnerShortSerializer(serializers.ModelSerializer):

    partner_additional = PartnerAdditionalSerializer(source='*', read_only=True)

    class Meta:
        model = Partner
        fields = (
            'id',
            'legal_name',
            'country_code',
            'partner_additional',
        )
        read_only_fields = ('country_code', )


class PartnerMemberSerializer(serializers.ModelSerializer):

    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = PartnerMember
        fields = (
            'id',
            'title',
            'role',
            'role_display',
        )


class PartnerProfileSerializer(serializers.ModelSerializer):

    registered_to_operate_in_country = serializers.BooleanField(required=True)
    have_governing_document = serializers.BooleanField(required=True)

    class Meta:
        model = PartnerProfile
        fields = (
            'id',
            'alias_name',
            'acronym',
            'former_legal_name',
            'legal_name_change',
            'year_establishment',
            'registered_to_operate_in_country',
            'missing_registration_document_comment',
            'have_governing_document',
            'missing_governing_document_comment',
        )
        extra_kwargs = {
            'year_establishment': {
                'required': True,
            },
        }


class PartnerFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = Partner
        fields = "__all__"


class PartnerFullProfilesSerializer(serializers.ModelSerializer):

    governing_documents = PartnerGoverningDocumentSerializer(read_only=True, many=True)
    registration_documents = PartnerRegistrationDocumentSerializer(read_only=True, many=True)

    class Meta:
        model = PartnerProfile
        fields = "__all__"


class OrganizationProfileSerializer(serializers.ModelSerializer):

    partner_additional = PartnerAdditionalSerializer(source='*', read_only=True)
    country_profiles = PartnerSerializer(many=True)
    users = serializers.IntegerField(source='partner_members.count')

    class Meta:
        model = Partner
        fields = (
            'id',
            'partner_additional',
            'legal_name',
            'country_code',
            'is_hq',
            'country_profiles',
            'country_presence',
            'users',
            'modified',
        )


class PartnerMailingAddressSerializer(serializers.ModelSerializer):

    mailing_telephone = serializers.CharField(source="telephone", allow_blank=True, allow_null=True)
    mailing_fax = serializers.CharField(source="fax", allow_null=True, allow_blank=True)

    class Meta:
        model = PartnerMailingAddress
        exclude = ("telephone", "fax")


class PartnerHeadOrganizationRegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerHeadOrganization
        exclude = ("partner", )


class PartnerHeadOrganizationSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerHeadOrganization
        fields = "__all__"
        read_only_fields = (
            'fullname',
            'email',
        )


class PartnerDirectorSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerDirector
        fields = "__all__"


class PartnerAuthorisedOfficerSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerAuthorisedOfficer
        fields = "__all__"


class PartnerMandateMissionSerializer(serializers.ModelSerializer):

    governance_organigram = CommonFileSerializer(allow_null=True)
    ethic_safeguard_policy = CommonFileSerializer()
    ethic_fraud_policy = CommonFileSerializer()

    class Meta:
        model = PartnerMandateMission
        fields = "__all__"


class PartnerExperienceSerializer(serializers.ModelSerializer):

    specialization = SpecializationSerializer(read_only=True)
    specialization_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = PartnerExperience
        fields = "__all__"


class PartnerBudgetSerializer(SkipUniqueTogetherValidationOnPatchMixin, serializers.ModelSerializer):

    created = serializers.DateTimeField(read_only=True)
    modified = serializers.DateTimeField(read_only=True)

    class Meta:
        model = PartnerBudget
        fields = "__all__"


class PartnerFundingSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerFunding
        fields = "__all__"


class PartnerCollaborationPartnershipSerializer(serializers.ModelSerializer):

    agency = AgencySerializer(read_only=True)
    agency_id = serializers.IntegerField(write_only=True, required=False, allow_null=True)
    partner_id = serializers.IntegerField(write_only=True, default=ActivePartnerIDDefault())

    class Meta:
        model = PartnerCollaborationPartnership
        fields = (
            'id',
            'partner',
            'partner_id',
            'agency',
            'agency_id',
            'description',
            'partner_number',
        )
        read_only_fields = (
            'partner', 'agency'
        )


class PartnerCollaborationEvidenceSerializer(serializers.ModelSerializer):

    created_by = serializers.HiddenField(default=serializers.CreateOnlyDefault(serializers.CurrentUserDefault()))
    evidence_file = CommonFileSerializer(read_only=True)

    class Meta:
        model = PartnerCollaborationEvidence
        fields = "__all__"
        read_only_fields = (
            'editable',
        )
        extra_kwargs = {
            'evidence_file_id': {
                'write_only': True,
                'required': True,
            }
        }


class PartnerOtherInfoSerializer(serializers.ModelSerializer):

    org_logo = CommonFileSerializer(allow_null=True)
    other_doc_1 = CommonFileSerializer(allow_null=True)
    other_doc_2 = CommonFileSerializer(allow_null=True)
    other_doc_3 = CommonFileSerializer(allow_null=True)

    class Meta:
        model = PartnerOtherInfo
        fields = "__all__"


class PartnerInternalControlSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerInternalControl
        fields = "__all__"


class PartnerPolicyAreaSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerPolicyArea
        fields = "__all__"


class PartnerAuditReportSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(required=False)

    most_recent_audit_report = CommonFileSerializer(allow_null=True)
    audit_link_report = serializers.URLField(source="link_report", allow_null=True, allow_blank=True)

    class Meta:
        model = PartnerAuditReport
        fields = ('id', 'org_audit', 'most_recent_audit_report', 'audit_link_report')


class PartnerCapacityAssessmentSerializer(serializers.ModelSerializer):

    id = serializers.IntegerField(required=False)

    report_file = CommonFileSerializer(allow_null=True)
    report_url = serializers.URLField(allow_null=True, allow_blank=True)

    class Meta:
        model = PartnerCapacityAssessment
        fields = ('id', 'assessment_type', 'report_file', 'report_url')


class PartnerAuditAssessmentSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerAuditAssessment
        fields = "__all__"


class PartnerReportingSerializer(serializers.ModelSerializer):

    report = CommonFileSerializer(required=False)

    class Meta:
        model = PartnerReporting
        fields = "__all__"


class OrganizationProfileDetailsSerializer(serializers.ModelSerializer):
    partner_additional = PartnerAdditionalSerializer(source='*', read_only=True)
    profile = PartnerFullProfilesSerializer()
    mailing_address = PartnerMailingAddressSerializer()
    directors = PartnerDirectorSerializer(many=True)
    authorised_officers = PartnerAuthorisedOfficerSerializer(many=True)
    org_head = PartnerHeadOrganizationSerializer(read_only=True)
    organisation_heads = PartnerHeadOrganizationSerializer(many=True)
    hq_org_head = PartnerHeadOrganizationSerializer(source='hq.org_head', read_only=True, allow_null=True)
    hq_organisation_heads = PartnerHeadOrganizationSerializer(
        source='hq.organisation_heads', read_only=True, many=True, allow_null=True
    )
    mandate_mission = PartnerMandateMissionSerializer()
    experiences = PartnerExperienceSerializer(many=True)
    budgets = serializers.SerializerMethodField()
    hq_budgets = serializers.SerializerMethodField()
    fund = PartnerFundingSerializer()
    collaborations_partnership = PartnerCollaborationPartnershipSerializer(many=True)
    collaboration_evidences = PartnerCollaborationEvidenceSerializer(many=True)
    other_info = PartnerOtherInfoSerializer()
    internal_controls = PartnerInternalControlSerializer(many=True)
    area_policies = PartnerPolicyAreaSerializer(many=True)
    audit = PartnerAuditAssessmentSerializer()
    audit_reports = PartnerAuditReportSerializer(many=True)
    capacity_assessments = PartnerCapacityAssessmentSerializer(many=True)
    report = PartnerReportingSerializer(required=False)
    location_field_offices = PointSerializer(many=True)
    is_finished = serializers.BooleanField(read_only=True, source="has_finished")
    identification_is_complete = serializers.BooleanField(read_only=True, source="profile.identification_is_complete")
    contact_is_complete = serializers.BooleanField(read_only=True, source="profile.contact_is_complete")
    mandatemission_complete = serializers.BooleanField(read_only=True, source="profile.mandatemission_complete")
    funding_complete = serializers.BooleanField(read_only=True, source="profile.funding_complete")
    collaboration_complete = serializers.BooleanField(read_only=True, source="profile.collaboration_complete")
    proj_impl_is_complete = serializers.BooleanField(
        read_only=True, source="profile.project_implementation_is_complete"
    )
    other_info_is_complete = serializers.BooleanField(read_only=True, source="profile.other_info_is_complete")
    country_of_origin = serializers.CharField()
    registration_declaration = CommonFileSerializer()

    class Meta:
        model = Partner
        fields = (
            'legal_name',
            'display_type',
            'partner_additional',
            'hq',
            'country_code',
            'is_active',
            'country_presence',
            'staff_globally',
            'location_of_office',
            'more_office_in_country',
            'location_field_offices',
            'staff_in_country',
            'engagement_operate_desc',
            "profile",
            "mailing_address",
            "directors",
            "authorised_officers",
            "org_head",
            "hq_org_head",
            "mandate_mission",
            "experiences",
            "budgets",
            "hq_budgets",
            "fund",
            "collaborations_partnership",
            "collaboration_evidences",
            "other_info",
            "internal_controls",
            "area_policies",
            "audit",
            "audit_reports",
            "capacity_assessments",
            "report",
            "is_finished",
            "identification_is_complete",
            "contact_is_complete",
            "mandatemission_complete",
            "funding_complete",
            "collaboration_complete",
            "proj_impl_is_complete",
            "other_info_is_complete",
            "country_of_origin",
            "has_sanction_match",
            "registration_declaration",
            "organisation_heads",
            "hq_organisation_heads",
        )

    def get_hq_budgets(self, partner):
        if partner.is_hq is False:
            return PartnerBudgetSerializer(get_recent_budgets_for_partner(partner.hq), many=True).data

    def get_budgets(self, partner):
        return PartnerBudgetSerializer(get_recent_budgets_for_partner(partner), many=True).data


class PartnerProfileSummarySerializer(serializers.ModelSerializer):

    display_type_display = serializers.CharField(source='get_display_type_display', read_only=True)
    country_display = serializers.CharField(source='get_country_code_display', read_only=True)
    location_of_office = PointSerializer()
    location_field_offices = PointSerializer(many=True)
    country_presence_display = serializers.SerializerMethodField()
    org_head = serializers.SerializerMethodField()
    mailing_address = PartnerMailingAddressSerializer()
    experiences = PartnerExperienceSerializer(many=True)
    population_of_concern = serializers.ListField(source="mandate_mission.concern_groups")
    year_establishment = serializers.IntegerField(source="profile.year_establishment")
    collaborations_partnership = PartnerCollaborationPartnershipSerializer(many=True)
    annual_budget = serializers.CharField(source="profile.annual_budget")
    key_result = serializers.CharField(source="report.key_result")
    mandate_and_mission = serializers.CharField(source="mandate_mission.mandate_and_mission")
    partner_additional = PartnerAdditionalSerializer(source='*', read_only=True)
    last_profile_update = serializers.DateTimeField(source='last_update_timestamp', read_only=True, allow_null=True)
    vendor_numbers = PartnerVendorNumberSerializer(many=True, read_only=True)
    hq = PartnerSerializer(read_only=True, allow_null=True)

    class Meta:
        model = Partner
        fields = (
            'id',
            'legal_name',
            'display_type',
            'display_type_display',
            'is_hq',
            'country_code',
            'country_display',
            'location_of_office',
            'location_field_offices',
            'country_presence_display',
            'org_head',
            'mailing_address',
            'experiences',
            'population_of_concern',
            'year_establishment',
            'collaborations_partnership',
            'annual_budget',
            'key_result',
            'mandate_and_mission',
            'partner_additional',
            'last_profile_update',
            'has_potential_sanction_match',
            'is_locked',
            'vendor_numbers',
            'hq',
        )
        read_only_fields = (
            'is_locked',
        )

    def get_country_presence_display(self, partner):
        if partner.is_hq:
            return ', '.join(
                map(lambda country_code: COUNTRIES_ALPHA2_CODE_DICT[country_code], partner.country_presence)
            )
        elif partner.location_of_office:
            return COUNTRIES_ALPHA2_CODE_DICT.get(partner.location_of_office.admin_level_1.country_code, None)

    def get_org_head(self, obj):
        org_head = getattr(obj.hq if obj.is_hq is False else obj, 'org_head', None)
        return PartnerHeadOrganizationSerializer(org_head).data


class PartnersListSerializer(serializers.ModelSerializer):

    partner_additional = PartnerAdditionalSerializer(source='*', read_only=True)
    acronym = serializers.SerializerMethodField()
    experience_working = serializers.SerializerMethodField()
    mailing_address = PartnerMailingAddressSerializer()
    org_head = PartnerHeadOrganizationSerializer()
    working_languages = serializers.ListField(source="profile.working_languages")
    experiences = PartnerExperienceSerializer(many=True)

    class Meta:
        model = Partner
        fields = (
            'id',
            'legal_name',
            'partner_additional',
            'acronym',
            'display_type',
            'country_code',
            'is_hq',
            'experience_working',

            "mailing_address",
            "org_head",
            "working_languages",
            "experiences",
        )

    def get_acronym(self, obj):
        return obj.profile.acronym

    def get_experience_working(self, obj):
        return PartnerCollaborationPartnership.objects.filter(partner=obj).\
            values_list("agency__name", flat=True).distinct()


class PartnerIdentificationSerializer(serializers.ModelSerializer):

    legal_name = serializers.CharField(source="partner.legal_name")
    partner_additional = PartnerAdditionalSerializer(source="partner", read_only=True)
    alias_name = serializers.CharField(allow_blank=True)
    acronym = serializers.CharField(allow_blank=True)
    former_legal_name = serializers.CharField(max_length=255, allow_blank=True)
    country_origin = serializers.CharField(read_only=True)
    type_org = serializers.CharField(source="partner.display_type", read_only=True)
    has_finished = serializers.BooleanField(read_only=True, source="profile.identification_is_complete")
    governing_documents = PartnerGoverningDocumentSerializer(many=True, read_only=True)
    registration_documents = PartnerRegistrationDocumentSerializer(many=True, read_only=True)

    class Meta:
        model = PartnerProfile
        fields = (
            'legal_name',
            'partner_additional',
            'alias_name',
            'acronym',
            'former_legal_name',
            'country_origin',
            'type_org',

            'year_establishment',
            'have_governing_document',
            'missing_governing_document_comment',
            'registered_to_operate_in_country',
            'missing_registration_document_comment',
            'has_finished',
            'governing_documents',
            'registration_documents',
        )

    @transaction.atomic
    def update(self, instance, validated_data):
        instance.partner.legal_name = validated_data.pop('partner', {}).pop('legal_name', instance.partner.legal_name)
        instance.partner.save()

        governing_documents = self.initial_data.get('governing_documents', None)
        registration_documents = self.initial_data.get('registration_documents', None)

        if governing_documents is not None:
            valid_ids = []
            if governing_documents:
                for gov_doc_data in governing_documents:
                    gov_doc = PartnerGoverningDocument.objects.filter(id=gov_doc_data.get('id')).first()
                    if gov_doc and (not gov_doc.editable or not gov_doc.profile == instance):
                        continue
                    serializer = PartnerGoverningDocumentSerializer(
                        instance=gov_doc, data=gov_doc_data, context=self.context, partial=bool(gov_doc)
                    )
                    serializer.is_valid(raise_exception=True)
                    valid_ids.append(serializer.save(profile=instance).id)
            instance.governing_documents.exclude(editable=False).exclude(id__in=valid_ids).delete()

        if registration_documents is not None:
            valid_ids = []
            if registration_documents:
                for reg_doc_data in registration_documents:
                    reg_doc = PartnerRegistrationDocument.objects.filter(id=reg_doc_data.get('id')).first()
                    if reg_doc and (not reg_doc.editable or not reg_doc.profile == instance):
                        continue
                    serializer = PartnerRegistrationDocumentSerializer(
                        instance=reg_doc, data=reg_doc_data, context=self.context, partial=bool(reg_doc)
                    )
                    serializer.is_valid(raise_exception=True)
                    valid_ids.append(serializer.save(profile=instance).id)
            instance.registration_documents.exclude(editable=False).exclude(id__in=valid_ids).delete()

        return super(PartnerIdentificationSerializer, self).update(instance, validated_data)


class PartnerContactInformationSerializer(MixinPartnerRelatedSerializer, serializers.ModelSerializer):

    mailing_address = PartnerMailingAddressSerializer()
    have_board_directors = serializers.BooleanField(source="profile.have_board_directors")
    have_authorised_officers = serializers.BooleanField(source="profile.have_authorised_officers")
    directors = PartnerDirectorSerializer(many=True)
    authorised_officers = PartnerAuthorisedOfficerSerializer(many=True)
    org_head = PartnerHeadOrganizationSerializer(allow_null=True, read_only=True)
    organisation_heads = PartnerHeadOrganizationSerializer(allow_null=True, many=True)
    connectivity = serializers.BooleanField(source="profile.connectivity")
    connectivity_excuse = serializers.CharField(
        source="profile.connectivity_excuse", allow_null=True, allow_blank=True
    )
    working_languages = serializers.ListField(source="profile.working_languages")
    working_languages_other = serializers.CharField(
        source="profile.working_languages_other",
        allow_null=True
    )
    has_finished = serializers.BooleanField(read_only=True, source="profile.contact_is_complete")

    class Meta:
        model = Partner
        fields = (
            'mailing_address',
            'have_board_directors',
            'have_authorised_officers',
            'directors',
            'authorised_officers',
            'org_head',
            'connectivity',
            'connectivity_excuse',
            'working_languages',
            'working_languages_other',
            'has_finished',
            'organisation_heads',
        )

    related_names = [
        "profile", "mailing_address", "directors", "authorised_officers", "organisation_heads",
    ]

    @transaction.atomic
    def update(self, instance, validated_data):
        # std method does not support writable nested fields by default
        self.update_partner_related(instance, validated_data, related_names=self.related_names)
        return Partner.objects.get(id=instance.id)  # we want to refresh changes after update on related models


class PartnerProfileMandateMissionSerializer(MixinPartnerRelatedSerializer, serializers.ModelSerializer):

    background_and_rationale = serializers.CharField(
        source="mandate_mission.background_and_rationale", allow_blank=True
    )
    mandate_and_mission = serializers.CharField(source="mandate_mission.mandate_and_mission", allow_blank=True)
    governance_structure = serializers.CharField(source="mandate_mission.governance_structure", allow_blank=True)
    governance_hq = serializers.CharField(source="mandate_mission.governance_hq", allow_blank=True)
    governance_organigram = CommonFileSerializer(source="mandate_mission.governance_organigram", allow_null=True)
    ethic_safeguard = serializers.BooleanField(source="mandate_mission.ethic_safeguard")
    ethic_safeguard_policy = CommonFileSerializer(source="mandate_mission.ethic_safeguard_policy", allow_null=True)
    ethic_safeguard_comment = serializers.CharField(source="mandate_mission.ethic_safeguard_comment", allow_blank=True)
    ethic_fraud = serializers.BooleanField(source="mandate_mission.ethic_fraud")
    ethic_fraud_policy = CommonFileSerializer(source="mandate_mission.ethic_fraud_policy", allow_null=True)
    ethic_fraud_comment = serializers.CharField(source="mandate_mission.ethic_fraud_comment", allow_blank=True)
    population_of_concern = serializers.BooleanField(source="mandate_mission.population_of_concern")
    concern_groups = serializers.ListField(source="mandate_mission.concern_groups")
    security_high_risk_locations = serializers.BooleanField(source="mandate_mission.security_high_risk_locations")
    security_high_risk_policy = serializers.BooleanField(source="mandate_mission.security_high_risk_policy")
    security_desc = serializers.CharField(source="mandate_mission.security_desc", allow_blank=True)

    experiences = PartnerExperienceSerializer(many=True)
    location_of_office = PointSerializer()
    location_field_offices = PointSerializer(many=True)

    has_finished = serializers.BooleanField(read_only=True, source="profile.mandatemission_complete")

    class Meta:
        model = Partner
        fields = (
            'background_and_rationale',
            'mandate_and_mission',
            'governance_structure',
            'governance_hq',
            'governance_organigram',
            'ethic_safeguard',
            'ethic_safeguard_policy',
            'ethic_safeguard_comment',
            'ethic_fraud',
            'ethic_fraud_policy',
            'ethic_fraud_comment',
            'population_of_concern',
            'concern_groups',
            'security_high_risk_locations',
            'security_high_risk_policy',
            'security_desc',
            'country_presence',
            'staff_globally',
            'location_of_office',
            'more_office_in_country',
            'location_field_offices',
            'staff_in_country',
            'engagement_operate_desc',
            'experiences',
            'has_finished',
        )

    related_names = [
        "mandate_mission", "experiences"
    ]

    @transaction.atomic
    def update(self, instance, validated_data):
        location_field_offices = validated_data.get('location_field_offices', [])
        location_of_office = validated_data.get('location_of_office')
        instance.country_presence = validated_data.get('country_presence', instance.country_presence)
        instance.staff_globally = validated_data.get('staff_globally', instance.staff_globally)
        instance.more_office_in_country = validated_data.get('more_office_in_country', instance.more_office_in_country)
        instance.staff_in_country = validated_data.get('staff_in_country', instance.staff_in_country)
        instance.engagement_operate_desc = validated_data.get(
            'engagement_operate_desc', instance.engagement_operate_desc
        )

        if location_of_office:
            point = Point.objects.get_point(**location_of_office)
            instance.location_of_office = point

        self.instance.location_field_offices.clear()
        for location_of_office in location_field_offices:
            point = Point.objects.get_point(**location_of_office)
            self.instance.location_field_offices.add(point)

        instance.save()

        self.update_partner_related(instance, validated_data, related_names=self.related_names)
        instance.refresh_from_db()

        return instance


class PartnerProfileFundingSerializer(MixinPartnerRelatedSerializer, serializers.ModelSerializer):

    budgets = PartnerBudgetSerializer(many=True)
    hq_budgets = serializers.SerializerMethodField()
    major_donors = serializers.ListField(source="fund.major_donors")
    source_core_funding = serializers.CharField(source="fund.source_core_funding", allow_blank=True)
    main_donors_list = serializers.CharField(source="fund.main_donors_list", allow_blank=True)

    has_finished = serializers.BooleanField(read_only=True, source="profile.funding_complete")

    class Meta:
        model = Partner
        fields = (
            'budgets',
            'hq_budgets',
            'major_donors',
            'main_donors_list',
            'source_core_funding',
            'has_finished',
        )

    related_names = [
        "fund", "budgets"
    ]

    @transaction.atomic
    def update(self, instance, validated_data):
        # std method does not support writable nested fields by default
        self.update_partner_related(instance, validated_data, related_names=self.related_names)
        return Partner.objects.get(id=instance.id)  # we want to refresh changes after update on related models

    def get_hq_budgets(self, partner):
        if partner.is_hq is False:
            return PartnerBudgetSerializer(get_recent_budgets_for_partner(partner.hq), many=True).data


class PartnerProfileCollaborationSerializer(MixinPartnerRelatedSerializer, serializers.ModelSerializer):

    collaborations_partnership = PartnerCollaborationPartnershipSerializer(many=True)

    partnership_collaborate_institution = serializers.BooleanField(
        source="profile.partnership_collaborate_institution"
    )
    partnership_collaborate_institution_desc = serializers.CharField(
        source="profile.partnership_collaborate_institution_desc",
        allow_null=True,
        allow_blank=True,
    )

    collaboration_evidences = PartnerCollaborationEvidenceSerializer(many=True)

    any_partnered_with_un = serializers.BooleanField(source="profile.any_partnered_with_un")
    any_accreditation = serializers.BooleanField(source="profile.any_accreditation")
    any_reference = serializers.BooleanField(source="profile.any_reference")
    has_finished = serializers.BooleanField(read_only=True, source="profile.collaboration_complete")

    class Meta:
        model = Partner
        fields = (
            'collaborations_partnership',
            'partnership_collaborate_institution',
            'partnership_collaborate_institution_desc',
            'collaboration_evidences',
            'any_partnered_with_un',
            'any_accreditation',
            'any_reference',
            'has_finished',
        )

    related_names = [
        "profile", "collaborations_partnership", "collaboration_evidences"
    ]
    exclude_fields = {
        "collaborations_partnership": PartnerCollaborationPartnershipSerializer.Meta.read_only_fields
    }

    def validate(self, attrs):
        partner_agency_set = set()
        collaborations_partnerships = self.initial_data.get('collaborations_partnership', [])
        for collaborations_partnership in self.initial_data.get('collaborations_partnership', []):
            partner_agency_set.add((
                collaborations_partnership.get('partner_id'), collaborations_partnership.get('agency_id'),
            ))
        if not len(partner_agency_set) == len(collaborations_partnerships):
            raise serializers.ValidationError({
                'collaborations_partnership': 'Only one partnership statement per agency is allowed'
            })
        return attrs

    @transaction.atomic
    def update(self, instance, validated_data):
        self.update_partner_related(instance, validated_data, related_names=self.related_names)
        instance = super(PartnerProfileCollaborationSerializer, self).update(instance, validated_data)
        return instance


class PartnerProfileProjectImplementationSerializer(
        MixinPreventManyCommonFile, MixinPartnerRelatedSerializer, serializers.ModelSerializer):

    have_management_approach = serializers.BooleanField(
        source="profile.have_management_approach")
    management_approach_desc = serializers.CharField(
        source="profile.management_approach_desc", allow_blank=True, allow_null=True)
    have_system_monitoring = serializers.BooleanField(
        source="profile.have_system_monitoring")
    system_monitoring_desc = serializers.CharField(
        source="profile.system_monitoring_desc", allow_blank=True, allow_null=True)
    have_feedback_mechanism = serializers.BooleanField(
        source="profile.have_feedback_mechanism")
    feedback_mechanism_desc = serializers.CharField(
        source="profile.feedback_mechanism_desc", allow_blank=True, allow_null=True)
    org_acc_system = serializers.ChoiceField(
        source="profile.org_acc_system", choices=FINANCIAL_CONTROL_SYSTEM_CHOICES)
    method_acc = serializers.ChoiceField(
        source="profile.method_acc", choices=METHOD_ACC_ADOPTED_CHOICES)
    have_system_track = serializers.BooleanField(
        source="profile.have_system_track")
    financial_control_system_desc = serializers.CharField(
        source="profile.financial_control_system_desc", allow_blank=True, allow_null=True)
    internal_controls = PartnerInternalControlSerializer(many=True)
    experienced_staff = serializers.BooleanField(
        source="profile.experienced_staff")
    experienced_staff_desc = serializers.CharField(
        source="profile.experienced_staff_desc", allow_blank=True, allow_null=True)
    area_policies = PartnerPolicyAreaSerializer(many=True)
    have_bank_account = serializers.BooleanField(
        source="profile.have_bank_account")
    have_separate_bank_account = serializers.BooleanField(
        source="profile.have_separate_bank_account")
    explain = serializers.CharField(
        source="profile.explain", allow_blank=True, allow_null=True)

    regular_audited = serializers.NullBooleanField(source="audit.regular_audited")
    regular_audited_comment = serializers.CharField(
        source="audit.regular_audited_comment", allow_blank=True, allow_null=True)
    audit_reports = PartnerAuditReportSerializer(many=True)

    major_accountability_issues_highlighted = serializers.BooleanField(
        source="audit.major_accountability_issues_highlighted")
    comment = serializers.CharField(source="audit.comment", allow_blank=True, allow_null=True)

    regular_capacity_assessments = serializers.NullBooleanField(source="audit.regular_capacity_assessments")
    capacity_assessments = PartnerCapacityAssessmentSerializer(many=True)

    key_result = serializers.CharField(source="report.key_result", allow_blank=True)
    publish_annual_reports = serializers.BooleanField(source="report.publish_annual_reports")
    last_report = serializers.DateField(source="report.last_report", allow_null=True)
    report = CommonFileSerializer(source="report.report", allow_null=True)
    link_report = serializers.URLField(source="report.link_report", allow_blank=True, allow_null=True)

    has_finished = serializers.BooleanField(read_only=True, source="profile.project_implementation_is_complete")

    class Meta:
        model = Partner
        fields = (
            'have_management_approach',
            'management_approach_desc',
            'have_system_monitoring',
            'system_monitoring_desc',
            'have_feedback_mechanism',
            'feedback_mechanism_desc',
            'org_acc_system',
            'method_acc',
            'have_system_track',
            'financial_control_system_desc',
            'internal_controls',
            'experienced_staff',
            'experienced_staff_desc',
            'area_policies',
            'have_bank_account',
            'have_separate_bank_account',
            'explain',

            'regular_audited',
            'regular_audited_comment',
            'audit_reports',
            'major_accountability_issues_highlighted',
            'comment',

            'regular_capacity_assessments',
            'capacity_assessments',

            'key_result',
            'publish_annual_reports',
            'last_report',
            'report',
            'link_report',
            'has_finished',
        )

    related_names = [
        "profile", "audit", "report", "internal_controls", "area_policies",
    ]

    prevent_keys = ["report"]

    def is_valid(self, raise_exception=False):
        """
        Need to raise exception in order to display correct
        errors for `audit_reports`
        """
        return super(PartnerProfileProjectImplementationSerializer, self).is_valid(raise_exception=True)

    def raise_error_if_file_is_already_referenced(self, cfile):
        if cfile.has_existing_reference:
            raise serializers.ValidationError({
                'audit_reports': 'This given common file id {} can be used only once.'.format(cfile.id)
            })

    def update_audit_reports(self, instance, audit_reports_payload):
        payload_report_ids = [r['id'] for r in audit_reports_payload if r.get('id')]
        reports_to_remove = instance.audit_reports.exclude(id__in=payload_report_ids)
        reports_to_remove.delete()

        for report_data in audit_reports_payload:
            report_id = report_data.pop('id', None)
            report_file = report_data.get('most_recent_audit_report')

            if report_id:
                report = instance.audit_reports.get(id=report_id)

                if report_file and report_file != report.most_recent_audit_report:
                    self.raise_error_if_file_is_already_referenced(report_file)

                instance.audit_reports.filter(id=report_id).update(**report_data)
            else:
                if report_file:
                    self.raise_error_if_file_is_already_referenced(report_file)

                report_data['created_by'] = self.context['request'].user
                instance.audit_reports.create(**report_data)

    def update_capacity_assessments(self, instance, capacity_assessments_payload):
        assessment_ids = [r['id'] for r in capacity_assessments_payload if r.get('id')]
        assessments_to_remove = instance.capacity_assessments.exclude(id__in=assessment_ids)
        assessments_to_remove.delete()

        for assessment_data in capacity_assessments_payload:
            assessment_id = assessment_data.pop('id', None)
            report_file = assessment_data.get('report_file')

            if assessment_id:
                assessment = instance.capacity_assessments.get(id=assessment_id)

                if report_file and report_file != assessment.report_file:
                    self.raise_error_if_file_is_already_referenced(report_file)

                instance.capacity_assessments.filter(id=assessment_id).update(**assessment_data)
            else:
                if report_file:
                    self.raise_error_if_file_is_already_referenced(report_file)

                assessment_data['created_by'] = self.context['request'].user
                instance.capacity_assessments.create(**assessment_data)

    @transaction.atomic
    def update(self, instance, validated_data):
        if 'audit_reports' in validated_data:
            self.update_audit_reports(instance, validated_data['audit_reports'])
        if 'capacity_assessments' in validated_data:
            self.update_capacity_assessments(instance, validated_data['capacity_assessments'])

        self.prevent_many_common_file_validator(self.initial_data)

        # std method does not support writable nested fields by default
        self.update_partner_related(instance, validated_data, related_names=self.related_names)

        return Partner.objects.get(id=instance.id)  # we want to refresh changes after update on related models


class PartnerProfileOtherInfoSerializer(
        MixinPreventManyCommonFile, MixinPartnerRelatedSerializer, serializers.ModelSerializer
):

    info_to_share = serializers.CharField(source="other_info.info_to_share", required=False,
                                          allow_blank=True)
    org_logo = CommonFileSerializer(source="other_info.org_logo", allow_null=True)
    org_logo_thumbnail = serializers.ImageField(source='other_info.org_logo_thumbnail', read_only=True)
    confirm_data_updated = serializers.BooleanField(source="other_info.confirm_data_updated")

    other_doc_1 = CommonFileSerializer(source='other_info.other_doc_1', allow_null=True)
    other_doc_2 = CommonFileSerializer(source='other_info.other_doc_2', allow_null=True)
    other_doc_3 = CommonFileSerializer(source='other_info.other_doc_3', allow_null=True)

    has_finished = serializers.BooleanField(read_only=True, source="profile.other_info_is_complete")

    class Meta:
        model = Partner
        fields = (
            'info_to_share',
            'org_logo',
            'org_logo_thumbnail',
            'confirm_data_updated',
            'other_doc_1',
            'other_doc_2',
            'other_doc_3',
            'has_finished',
        )

    related_names = [
        "other_info",
    ]

    prevent_keys = ["other_doc_1", "other_doc_2", "other_doc_3", 'org_logo']

    @transaction.atomic
    def update(self, instance, validated_data):
        self.prevent_many_common_file_validator(self.initial_data)
        self.update_partner_related(instance, validated_data, related_names=self.related_names)
        instance = super(PartnerProfileOtherInfoSerializer, self).update(instance, validated_data)
        return instance


class PartnerCountryProfileSerializer(serializers.ModelSerializer):

    countries_profile = serializers.SerializerMethodField(read_only=True)
    chosen_country_to_create = serializers.ListField(write_only=True)

    class Meta:
        model = Partner
        fields = (
            'id',
            'countries_profile',
            'chosen_country_to_create',
        )

    def validate(self, data):
        hq_id = self.context['request'].parser_context.get('kwargs', {}).get('pk')
        partner = Partner.objects.filter(pk=hq_id, hq=None)
        if not partner.exists():
            raise serializers.ValidationError("You can create profile only for HQ.")
        partner = partner.get()

        if not partner.has_finished:
            raise serializers.ValidationError(
                "You don't have the ability to create country profile if Your profile is not completed.")

        country_list = self.initial_data.get('chosen_country_to_create')
        if not type(country_list):
            raise serializers.ValidationError("Field 'chosen_country_to_create' should be a list of country codes")

        for country_code in country_list:
            if not (country_code in partner.country_presence):
                msg = "The country code {} is not defined in country_presence list."
                raise serializers.ValidationError(msg.format(country_code))
            if Partner.objects.filter(hq=partner, country_code=country_code).exists():
                msg = "The country with code {} is already created."
                raise serializers.ValidationError(msg.format(country_code))

        data['chosen_country_to_create'] = country_list
        return data

    def get_countries_profile(self, obj):
        choices = []
        for country_code in obj.country_presence:
            item = {
                "country_code": country_code,
                "country_name": COUNTRIES_ALPHA2_CODE_DICT.get(country_code),
                "exist": obj.children.filter(country_code=country_code).exists(),
            }
            choices.append(item)

        return choices

    @transaction.atomic
    def create(self, validated_data):
        hq: Partner = get_object_or_404(
            Partner,
            id=self.context['request'].parser_context.get('kwargs', {}).get('pk')
        )
        for country_code in validated_data['chosen_country_to_create']:
            partner = Partner.objects.create(
                hq=hq,
                legal_name=hq.legal_name,
                country_code=country_code,
                display_type=PARTNER_TYPES.international,
            )

            responsibilities = []
            for responsibility in list(FUNCTIONAL_RESPONSIBILITY_CHOICES._db_values):
                responsibilities.append(
                    PartnerInternalControl(partner=partner, functional_responsibility=responsibility)
                )
            PartnerInternalControl.objects.bulk_create(responsibilities)

            policy_areas = []
            for policy_area in list(POLICY_AREA_CHOICES._db_values):
                policy_areas.append(PartnerPolicyArea(partner=partner, area=policy_area))

            PartnerPolicyArea.objects.bulk_create(policy_areas)

        return hq

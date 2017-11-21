from django.db import transaction
from rest_framework import serializers

from common.consts import (
    FINANCIAL_CONTROL_SYSTEM_CHOICES,
    METHOD_ACC_ADOPTED_CHOICES,
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    PARTNER_TYPES,
    POLICY_AREA_CHOICES,
)
from common.models import Point
from common.countries import COUNTRIES_ALPHA2_CODE_DICT
from common.serializers import (CommonFileSerializer,
                                SpecializationSerializer,
                                MixinPartnerRelatedSerializer,
                                PointSerializer)
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
    PartnerCollaborationEvidence,
    PartnerOtherInfo,
    PartnerInternalControl,
    PartnerPolicyArea,
    PartnerAuditAssessment,
    PartnerReporting,
    PartnerMember,
)


class PartnerAdditionalSerializer(serializers.ModelSerializer):

    class Meta:
        model = Partner
        fields = (
            'id',
            'legal_name',
            'flagging_status',
            'is_verified',
            'has_finished',
        )


class PartnerSerializer(serializers.ModelSerializer):

    is_hq = serializers.BooleanField(read_only=True)
    logo = CommonFileSerializer(source='other_info.org_logo',
                                read_only=True)
    org_logo_thumbnail = serializers.ImageField(source='other_info.org_logo_thumbnail', read_only=True)
    partner_additional = PartnerAdditionalSerializer(source='*', read_only=True)

    class Meta:
        model = Partner
        fields = (
            'id',
            'is_hq',
            'logo',
            'legal_name',
            'country_code',
            'display_type',
            'partner_additional',
            'org_logo_thumbnail',
        )


class PartnerShortSerializer(serializers.ModelSerializer):

    partner_additional = PartnerAdditionalSerializer(source='*', read_only=True)

    class Meta:
        model = Partner
        fields = (
            'id',
            'legal_name',
            'partner_additional',
        )


class PartnerMemberSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerMember
        fields = (
            'id',
            'title',
            'role',
        )


class PartnerProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerProfile
        fields = (
            'id',
            'alias_name',
            'former_legal_name',
            'legal_name_change',
        )


class PartnerFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = Partner
        fields = "__all__"


class PartnerFullProfilesSerializer(serializers.ModelSerializer):

    gov_doc = CommonFileSerializer()
    registration_doc = CommonFileSerializer()

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

    mailing_telephone = serializers.CharField(source="telephone")
    mailing_fax = serializers.CharField(source="fax", allow_null=True)

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

    class Meta:
        model = PartnerExperience
        fields = "__all__"


class PartnerBudgetSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerBudget
        fields = "__all__"


class PartnerFundingSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerFunding
        fields = "__all__"


class PartnerCollaborationPartnershipSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerCollaborationPartnership
        fields = "__all__"
        read_only_fields = ('partner', 'agency')


class PartnerCollaborationEvidenceSerializer(serializers.ModelSerializer):

    evidence_file = CommonFileSerializer()

    class Meta:
        model = PartnerCollaborationEvidence
        fields = "__all__"


class PartnerOtherInfoSerializer(serializers.ModelSerializer):

    org_logo = CommonFileSerializer()
    other_doc_1 = CommonFileSerializer()
    other_doc_2 = CommonFileSerializer()
    other_doc_3 = CommonFileSerializer()

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


class PartnerAuditAssessmentSerializer(serializers.ModelSerializer):

    most_recent_audit_report = CommonFileSerializer()
    assessment_report = CommonFileSerializer()
    audit_link_report = serializers.URLField(source="link_report")

    class Meta:
        model = PartnerAuditAssessment
        exclude = ("link_report", )


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
    org_head = PartnerHeadOrganizationSerializer()
    mandate_mission = PartnerMandateMissionSerializer()
    experiences = PartnerExperienceSerializer(many=True)
    budgets = PartnerBudgetSerializer(many=True)
    fund = PartnerFundingSerializer()
    collaborations_partnership = PartnerCollaborationPartnershipSerializer(many=True)
    collaboration_evidences = PartnerCollaborationEvidenceSerializer(many=True)
    other_info = PartnerOtherInfoSerializer()
    internal_controls = PartnerInternalControlSerializer(many=True)
    area_policies = PartnerPolicyAreaSerializer(many=True)
    audit = PartnerAuditAssessmentSerializer()
    report = PartnerReportingSerializer(required=False)
    location_field_offices = PointSerializer(many=True)
    is_finished = serializers.BooleanField(read_only=True, source="has_finished")
    identification_is_complete = serializers.BooleanField(read_only=True, source="profile.identification_is_complete")
    contact_is_complete = serializers.BooleanField(read_only=True, source="profile.contact_is_complete")
    mandatemission_complete = serializers.BooleanField(read_only=True, source="profile.mandatemission_complete")
    funding_complete = serializers.BooleanField(read_only=True, source="profile.funding_complete")
    collaboration_complete = serializers.BooleanField(read_only=True, source="profile.collaboration_complete")
    proj_impl_is_complete = serializers.BooleanField(read_only=True, source="profile.proj_impl_is_complete")
    other_info_is_complete = serializers.BooleanField(read_only=True, source="profile.other_info_is_complete")

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
            "mandate_mission",
            "experiences",
            "budgets",
            "fund",
            "collaborations_partnership",
            "collaboration_evidences",
            "other_info",
            "internal_controls",
            "area_policies",
            "audit",
            "report",
            "is_finished",
            "identification_is_complete",
            "contact_is_complete",
            "mandatemission_complete",
            "funding_complete",
            "collaboration_complete",
            "proj_impl_is_complete",
            "other_info_is_complete",
        )


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


class PartnersListItemSerializer(serializers.ModelSerializer):
    mailing_address = PartnerMailingAddressSerializer()
    org_head = PartnerHeadOrganizationSerializer()
    working_languages = serializers.ListField(source="profile.working_languages")
    experiences = PartnerExperienceSerializer(many=True)

    class Meta:
        model = Partner
        fields = (
            "id",
            "mailing_address",
            "org_head",
            "working_languages",
            "experiences",
        )


class PartnerIdentificationSerializer(serializers.ModelSerializer):

    legal_name = serializers.CharField(source="partner.legal_name", read_only=True)
    partner_additional = PartnerAdditionalSerializer(source="partner", read_only=True)
    alias_name = serializers.CharField(read_only=True)
    acronym = serializers.CharField(read_only=True)
    former_legal_name = serializers.CharField(read_only=True)
    country_origin = serializers.CharField(read_only=True)
    type_org = serializers.CharField(source="partner.display_type", read_only=True)
    gov_doc = CommonFileSerializer()
    registration_doc = CommonFileSerializer()
    has_finished = serializers.BooleanField(read_only=True, source="profile.identification_is_complete")

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
            'have_gov_doc',
            'gov_doc',
            'registration_to_operate_in_country',
            'registration_doc',
            'registration_date',
            'registration_comment',
            'registration_number',
            'has_finished',
        )


class PartnerContactInformationSerializer(MixinPartnerRelatedSerializer, serializers.ModelSerializer):

    mailing_address = PartnerMailingAddressSerializer()
    have_board_directors = serializers.BooleanField(source="profile.have_board_directors")
    have_authorised_officers = serializers.BooleanField(source="profile.have_authorised_officers")
    directors = PartnerDirectorSerializer(many=True)
    authorised_officers = PartnerAuthorisedOfficerSerializer(many=True)
    org_head = PartnerHeadOrganizationSerializer(read_only=True)
    connectivity = serializers.BooleanField(source="profile.connectivity")
    connectivity_excuse = serializers.CharField(source="profile.connectivity_excuse", allow_null=True)
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
        )

    related_names = [
        "profile", "mailing_address", "directors", "authorised_officers"
    ]

    @transaction.atomic
    def update(self, instance, validated_data):
        # std method does not support writable nested fields by default
        self.update_partner_related(instance, validated_data, related_names=self.related_names)
        return Partner.objects.get(id=instance.id)  # we want to refresh changes after update on related models


class PartnerProfileMandateMissionSerializer(MixinPartnerRelatedSerializer, serializers.ModelSerializer):

    background_and_rationale = serializers.CharField(source="mandate_mission.background_and_rationale")
    mandate_and_mission = serializers.CharField(source="mandate_mission.mandate_and_mission")
    governance_structure = serializers.CharField(source="mandate_mission.governance_structure")
    governance_hq = serializers.CharField(source="mandate_mission.governance_hq")
    governance_organigram = CommonFileSerializer(source="mandate_mission.governance_organigram", allow_null=True)
    ethic_safeguard = serializers.BooleanField(source="mandate_mission.ethic_safeguard")
    ethic_safeguard_policy = CommonFileSerializer(source="mandate_mission.ethic_safeguard_policy", allow_null=True)
    ethic_safeguard_comment = serializers.CharField(source="mandate_mission.ethic_safeguard_comment")
    ethic_fraud = serializers.BooleanField(source="mandate_mission.ethic_fraud")
    ethic_fraud_policy = CommonFileSerializer(source="mandate_mission.ethic_fraud_policy", allow_null=True)
    ethic_fraud_comment = serializers.CharField(source="mandate_mission.ethic_fraud_comment")
    population_of_concern = serializers.BooleanField(source="mandate_mission.population_of_concern")
    concern_groups = serializers.ListField(source="mandate_mission.concern_groups")
    security_high_risk_locations = serializers.BooleanField(source="mandate_mission.security_high_risk_locations")
    security_high_risk_policy = serializers.BooleanField(source="mandate_mission.security_high_risk_policy")
    security_desc = serializers.CharField(source="mandate_mission.security_desc")

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
        # std method does not support writable nested fields by default

        location_field_offices = validated_data.get('location_field_offices', [])
        location_of_office = validated_data.get('location_of_office')
        instance.country_presence = validated_data.get('country_presence', instance.country_presence)
        instance.staff_globally = validated_data.get('staff_globally', instance.staff_globally)
        instance.more_office_in_country = validated_data.get('more_office_in_country', instance.more_office_in_country)
        instance.staff_in_country = validated_data.get('staff_in_country', instance.staff_in_country)
        instance.engagement_operate_desc = validated_data.get(
            'engagement_operate_desc', instance.engagement_operate_desc)

        if location_of_office:
            point, created = Point.objects.get_or_create(**location_of_office)
            instance.location_of_office_id = point

        self.instance.location_field_offices.clear()
        for location_of_office in location_field_offices:
            point, created = Point.objects.get_or_create(**location_of_office)
            self.instance.location_field_offices.add(point)

        instance.save()

        self.update_partner_related(instance, validated_data, related_names=self.related_names)

        return Partner.objects.get(id=instance.id)  # we want to refresh changes after update on related models


class PartnerProfileFundingSerializer(MixinPartnerRelatedSerializer, serializers.ModelSerializer):

    budgets = PartnerBudgetSerializer(many=True)
    major_donors = serializers.ListField(source="fund.major_donors")
    source_core_funding = serializers.CharField(source="fund.source_core_funding")
    main_donors_list = serializers.CharField(source="fund.main_donors_list")

    has_finished = serializers.BooleanField(read_only=True, source="profile.funding_complete")

    class Meta:
        model = Partner
        fields = (
            'budgets',
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


class PartnerProfileCollaborationSerializer(MixinPartnerRelatedSerializer, serializers.ModelSerializer):

    collaborations_partnership = PartnerCollaborationPartnershipSerializer(many=True)

    partnership_collaborate_institution = serializers.BooleanField(
        source="profile.partnership_collaborate_institution")
    partnership_collaborate_institution_desc = serializers.CharField(
        source="profile.partnership_collaborate_institution_desc",
        allow_null=True,
        allow_blank=True,
    )

    collaboration_evidences = PartnerCollaborationEvidenceSerializer(many=True)

    has_finished = serializers.BooleanField(read_only=True, source="profile.collaboration_complete")

    class Meta:
        model = Partner
        fields = (
            'collaborations_partnership',
            'partnership_collaborate_institution',
            'partnership_collaborate_institution_desc',
            'collaboration_evidences',
            'has_finished',
        )

    related_names = [
        "profile", "collaborations_partnership", "collaboration_evidences"
    ]

    @transaction.atomic
    def update(self, instance, validated_data):
        # std method does not support writable nested fields by default
        self.update_partner_related(instance, validated_data, related_names=self.related_names)

        return Partner.objects.get(id=instance.id)  # we want to refresh changes after update on related models


class PartnerProfileProjectImplementationSerializer(MixinPartnerRelatedSerializer, serializers.ModelSerializer):

    have_management_approach = serializers.BooleanField(source="profile.have_management_approach")
    management_approach_desc = serializers.CharField(source="profile.management_approach_desc")
    have_system_monitoring = serializers.BooleanField(source="profile.have_system_monitoring")
    system_monitoring_desc = serializers.CharField(source="profile.system_monitoring_desc")
    have_feedback_mechanism = serializers.BooleanField(source="profile.have_feedback_mechanism")
    feedback_mechanism_desc = serializers.CharField(source="profile.feedback_mechanism_desc")
    org_acc_system = serializers.ChoiceField(source="profile.org_acc_system", choices=FINANCIAL_CONTROL_SYSTEM_CHOICES)
    method_acc = serializers.ChoiceField(source="profile.method_acc", choices=METHOD_ACC_ADOPTED_CHOICES)
    have_system_track = serializers.BooleanField(source="profile.have_system_track")
    financial_control_system_desc = serializers.CharField(source="profile.financial_control_system_desc")
    internal_controls = PartnerInternalControlSerializer(many=True)
    experienced_staff = serializers.BooleanField(source="profile.experienced_staff")
    experienced_staff_desc = serializers.CharField(source="profile.experienced_staff_desc")
    area_policies = PartnerPolicyAreaSerializer(many=True)
    have_bank_account = serializers.BooleanField(source="profile.have_bank_account")
    have_separate_bank_account = serializers.BooleanField(source="profile.have_separate_bank_account")
    explain = serializers.CharField(source="profile.explain")

    regular_audited = serializers.BooleanField(source="audit.regular_audited")
    regular_audited_comment = serializers.CharField(source="audit.regular_audited_comment")
    org_audits = serializers.ListField(source="audit.org_audits")
    most_recent_audit_report = CommonFileSerializer(source="audit.most_recent_audit_report", required=False)
    audit_link_report = serializers.URLField(source="audit.link_report", required=False)
    major_accountability_issues_highlighted = serializers.BooleanField(
        source="audit.major_accountability_issues_highlighted")
    comment = serializers.CharField(source="audit.comment")
    capacity_assessment = serializers.BooleanField(source="audit.capacity_assessment")
    assessments = serializers.ListField(source="audit.assessments")
    assessment_report = CommonFileSerializer(source="audit.assessment_report")

    key_result = serializers.CharField(source="report.key_result")
    publish_annual_reports = serializers.BooleanField(source="report.publish_annual_reports")
    last_report = serializers.DateField(source="report.last_report")
    report = CommonFileSerializer(source="report.report", required=False)
    link_report = serializers.URLField(source="report.link_report", required=False)

    has_finished = serializers.BooleanField(read_only=True, source="profile.proj_impl_is_complete")

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
            'org_audits',
            'most_recent_audit_report',
            'audit_link_report',
            'major_accountability_issues_highlighted',
            'comment',
            'capacity_assessment',
            'assessments',
            'assessment_report',

            'key_result',
            'publish_annual_reports',
            'last_report',
            'report',
            'link_report',
            'has_finished',
        )

    related_names = [
        "profile", "audit", "report",
        "internal_controls", "area_policies",
    ]

    @transaction.atomic
    def update(self, instance, validated_data):
        # std method does not support writable nested fields by default
        self.update_partner_related(instance, validated_data, related_names=self.related_names)

        return Partner.objects.get(id=instance.id)  # we want to refresh changes after update on related models


class PartnerProfileOtherInfoSerializer(MixinPartnerRelatedSerializer, serializers.ModelSerializer):

    info_to_share = serializers.CharField(source="other_info.info_to_share", required=False,
                                          allow_blank=True)
    org_logo = CommonFileSerializer(source="other_info.org_logo")
    confirm_data_updated = serializers.BooleanField(source="other_info.confirm_data_updated")

    other_doc_1 = CommonFileSerializer(source='other_info.other_doc_1')
    other_doc_2 = CommonFileSerializer(source='other_info.other_doc_2')
    other_doc_3 = CommonFileSerializer(source='other_info.other_doc_3')

    has_finished = serializers.BooleanField(read_only=True, source="profile.other_info_is_complete")

    class Meta:
        model = Partner
        fields = (
            'info_to_share',
            'org_logo',
            'confirm_data_updated',
            'other_doc_1',
            'other_doc_2',
            'other_doc_3',
            'has_finished',
        )

    related_names = [
        "other_info",
    ]

    @transaction.atomic
    def update(self, instance, validated_data):
        # std method does not support writable nested fields by default
        self.update_partner_related(instance, validated_data, related_names=self.related_names)

        return Partner.objects.get(id=instance.id)  # we want to refresh changes after update on related models


class PartnerCountryProfileSerializer(serializers.ModelSerializer):

    countries_profile = serializers.SerializerMethodField(read_only=True)
    chosen_country_to_create = serializers.SerializerMethodField()

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
        choose = []
        for country_code in obj.country_presence:
            item = {
                "country_code": country_code,
                "country_name": COUNTRIES_ALPHA2_CODE_DICT.get(country_code),
                "exist": False,
            }
            if obj.country_profiles.filter(country_code=country_code).exists():
                item["exist"] = True
            choose.append(item)

        return choose

    def get_chosen_country_to_create(self, obj):
        # we need this data only to upload - post
        return []

    @transaction.atomic
    def create(self, validated_data):
        hq_id = self.context['request'].parser_context.get('kwargs', {}).get('pk')
        for country_code in validated_data['chosen_country_to_create']:
            partner = Partner.objects.create(
                hq_id=hq_id,
                country_code=country_code,
                display_type=PARTNER_TYPES.international,
            )
            # TODO - move this and partner create in account registration into one location
            PartnerProfile.objects.create(partner=partner)
            PartnerMailingAddress.objects.create(partner=partner)
            PartnerAuditAssessment.objects.create(partner=partner)
            PartnerReporting.objects.create(partner=partner)
            PartnerMandateMission.objects.create(partner=partner)
            PartnerFunding.objects.create(partner=partner)
            PartnerOtherInfo.objects.create(partner=partner)

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

        return Partner.objects.get(pk=hq_id)  # we want to refresh changes after creating related models

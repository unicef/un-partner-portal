from rest_framework import serializers

from agency.serializers import OtherAgencySerializer
from common.consts import (
    FINANCIAL_CONTROL_SYSTEM_CHOICES,
    METHOD_ACC_ADOPTED_CHOICES,
)
from common.countries import COUNTRIES_ALPHA2_CODE
from common.serializers import SpecializationSerializer
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
    PartnerCollaborationPartnershipOther,
    PartnerCollaborationEvidence,
    PartnerOtherInfo,
    PartnerOtherDocument,
    PartnerInternalControl,
    PartnerPolicyArea,
    PartnerAuditAssessment,
    PartnerReporting,
    PartnerMember,
)


class PartnerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Partner
        fields = (
            'id',
            'legal_name',
            'country_code',
        )


class PartnerShortSerializer(serializers.ModelSerializer):

    class Meta:
        model = Partner
        fields = (
            'id',
            'legal_name',
        )


class PartnerMemberSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerMember
        fields = (
            'id',
            'title',
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

    class Meta:
        model = PartnerProfile
        fields = "__all__"


class OrganizationProfileSerializer(serializers.ModelSerializer):

    country_profiles = PartnerSerializer(many=True)
    users = serializers.IntegerField(source='partner_members.count')

    class Meta:
        model = Partner
        fields = (
            'id',
            'legal_name',
            'country_code',
            'is_hq',
            'country_profiles',
            'country_presence',
            'users',
            'modified',
        )


class PartnerMailingAddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerMailingAddress
        fields = "__all__"


class PartnerHeadOrganizationRegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerHeadOrganization
        exclude = ("partner", )


class PartnerHeadOrganizationSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerHeadOrganization
        fields = "__all__"


class PartnerDirectorSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerDirector
        fields = "__all__"


class PartnerAuthorisedOfficerSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerAuthorisedOfficer
        fields = "__all__"


class PartnerMandateMissionSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerMandateMission
        fields = "__all__"


class PartnerExperienceSerializer(serializers.ModelSerializer):

    specialization = SpecializationSerializer()

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


class PartnerCollaborationPartnershipOtherSerializer(serializers.ModelSerializer):

    other_agency = OtherAgencySerializer()

    class Meta:
        model = PartnerCollaborationPartnershipOther
        fields = "__all__"


class PartnerCollaborationEvidenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerCollaborationEvidence
        fields = "__all__"


class PartnerOtherInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerOtherInfo
        fields = "__all__"


class PartnerOtherDocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerOtherDocument
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

    class Meta:
        model = PartnerAuditAssessment
        fields = "__all__"


class PartnerReportingSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerReporting
        fields = "__all__"


class OrganizationProfileDetailsSerializer(serializers.ModelSerializer):
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
    collaborations_partnership_others = PartnerCollaborationPartnershipOtherSerializer(many=True)
    collaboration_evidences = PartnerCollaborationEvidenceSerializer(many=True)
    other_info = PartnerOtherInfoSerializer()
    other_documents = PartnerOtherDocumentSerializer(many=True)
    internal_controls = PartnerInternalControlSerializer(many=True)
    area_policies = PartnerPolicyAreaSerializer(many=True)
    audit = PartnerAuditAssessmentSerializer()
    report = PartnerReportingSerializer()

    class Meta:
        model = Partner
        fields = (
            'legal_name',
            'display_type',
            'hq',
            'country_code',
            'is_active',
            'country_presence',
            'staff_globally',

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
            "collaborations_partnership_others",
            "collaboration_evidences",
            "other_info",
            "other_documents",
            "internal_controls",
            "area_policies",
            "audit",
            "report",
        )


class PartnersListSerializer(serializers.ModelSerializer):

    acronym = serializers.SerializerMethodField()
    experience_working = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = (
            'id',
            'legal_name',
            'acronym',
            'display_type',
            'country_code',
            'is_hq',
            'experience_working',
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
    alias_name = serializers.CharField(read_only=True)
    acronym = serializers.CharField(read_only=True)
    former_legal_name = serializers.CharField(read_only=True)
    country_origin = serializers.CharField(read_only=True)
    type_org = serializers.CharField(source="partner.display_type", read_only=True)

    class Meta:
        model = PartnerProfile
        fields = (
            'legal_name',
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
        )


class PartnerContactInformationSerializer(serializers.ModelSerializer):

    mailing_address = PartnerMailingAddressSerializer()
    have_board_directors = serializers.BooleanField(source="profile.have_board_directors")
    directors = PartnerDirectorSerializer(many=True)
    authorised_officers = PartnerAuthorisedOfficerSerializer(many=True)
    org_head = PartnerHeadOrganizationSerializer(read_only=True)
    connectivity = serializers.BooleanField(source="profile.connectivity")
    connectivity_excuse = serializers.CharField(source="profile.connectivity_excuse")
    working_languages = serializers.ListField(source="profile.working_languages")
    working_languages_other = serializers.ChoiceField(
        source="profile.working_languages_other", choices=COUNTRIES_ALPHA2_CODE)

    class Meta:
        model = Partner
        fields = (
            'mailing_address',
            'have_board_directors',
            'directors',
            'authorised_officers',
            'org_head',
            'connectivity',
            'connectivity_excuse',
            'working_languages',
            'working_languages_other',
        )

    def update(self, instance, validated_data):
        # std method does not support writable nested fields by default
        PartnerProfile.objects.filter(
            id=instance.profile.id).update(**validated_data["profile"])
        PartnerMailingAddress.objects.filter(
            id=instance.mailing_address.id).update(**validated_data["mailing_address"])

        for director in self.initial_data.get('directors', []):
            _id = director.get("id")
            if _id:
                instance.directors.filter(id=_id).update(**director)
            else:
                director['partner_id'] = instance.id
                PartnerDirector.objects.create(**director)

        for authorised_officer in self.initial_data.get('authorised_officers', []):
            _id = authorised_officer.get("id")
            if _id:
                instance.authorised_officers.filter(id=_id).update(**authorised_officer)
            else:
                authorised_officer['partner_id'] = instance.id
                PartnerAuthorisedOfficer.objects.create(**authorised_officer)

        return Partner.objects.get(id=instance.id)  # we want to refresh changes after update on related models


class PartnerProfileMandateMissionSerializer(serializers.ModelSerializer):

    background_and_rationale = serializers.CharField(source="mandate_mission.background_and_rationale")
    mandate_and_mission = serializers.CharField(source="mandate_mission.mandate_and_mission")
    governance_structure = serializers.CharField(source="mandate_mission.governance_structure")
    governance_hq = serializers.CharField(source="mandate_mission.governance_hq")
    governance_organigram = serializers.FileField(source="mandate_mission.governance_organigram")
    ethic_safeguard = serializers.BooleanField(source="mandate_mission.ethic_safeguard")
    ethic_safeguard_policy = serializers.FileField(source="mandate_mission.ethic_safeguard_policy")
    ethic_safeguard_comment = serializers.CharField(source="mandate_mission.ethic_safeguard_comment")
    ethic_fraud = serializers.BooleanField(source="mandate_mission.ethic_fraud")
    ethic_fraud_policy = serializers.FileField(source="mandate_mission.ethic_fraud_policy")
    ethic_fraud_comment = serializers.CharField(source="mandate_mission.ethic_fraud_comment")
    population_of_concern = serializers.BooleanField(source="mandate_mission.population_of_concern")
    concern_groups = serializers.ListField(source="mandate_mission.concern_groups")
    security_high_risk_locations = serializers.BooleanField(source="mandate_mission.security_high_risk_locations")
    security_high_risk_policy = serializers.BooleanField(source="mandate_mission.security_high_risk_policy")
    security_desc = serializers.CharField(source="mandate_mission.security_desc")

    experiences = PartnerExperienceSerializer(many=True)

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
        )

    def update(self, instance, validated_data):
        # std method does not support writable nested fields by default
        PartnerMandateMission.objects.filter(
            id=instance.mandate_mission.id).update(**validated_data["mandate_mission"])

        instance.country_presence = validated_data.get('country_presence', instance.country_presence)
        instance.staff_globally = validated_data.get('staff_globally', instance.staff_globally)
        instance.location_of_office = validated_data.get('location_of_office', instance.location_of_office)
        instance.more_office_in_country = validated_data.get('more_office_in_country', instance.more_office_in_country)
        instance.location_field_offices = validated_data.get('location_field_offices', instance.location_field_offices)
        instance.staff_in_country = validated_data.get('staff_in_country', instance.staff_in_country)
        instance.engagement_operate_desc = validated_data.get(
            'engagement_operate_desc', instance.engagement_operate_desc)

        instance.save()

        for experience in self.initial_data.get('experiences', []):
            _id = experience.get("id")
            if _id:
                instance.experiences.filter(id=_id).update(**experience)
            else:
                experience['partner_id'] = instance.id
                PartnerExperience.objects.create(**experience)

        return Partner.objects.get(id=instance.id)  # we want to refresh changes after update on related models


class PartnerProfileFundingSerializer(serializers.ModelSerializer):

    budgets = PartnerBudgetSerializer(many=True)
    major_donors = serializers.ListField(source="fund.major_donors")
    source_core_funding = serializers.CharField(source="fund.source_core_funding")
    main_donors_list = serializers.CharField(source="fund.main_donors_list")

    class Meta:
        model = Partner
        fields = (
            'budgets',
            'major_donors',
            'main_donors_list',
            'source_core_funding',
        )

    def update(self, instance, validated_data):
        fund_id = validated_data["fund"]["id"]
        PartnerFunding.objects.filter(id=fund_id).update(**validated_data["fund"])

        for budget in self.initial_data.get('budgets', []):
            _id = budget.get("id")
            if _id:
                instance.budgets.filter(id=_id).update(**budget)
            else:
                budget['partner_id'] = instance.id
                PartnerBudget.objects.create(**budget)

        return Partner.objects.get(id=instance.id)  # we want to refresh changes after update on related models


class PartnerProfileCollaborationSerializer(serializers.ModelSerializer):

    collaborations_partnership = PartnerCollaborationPartnershipSerializer(many=True)
    collaborations_partnership_others = PartnerCollaborationPartnershipOtherSerializer(many=True)

    partnership_collaborate_institution = serializers.BooleanField(
        source="profile.partnership_collaborate_institution")
    partnership_collaborate_institution_desc = serializers.CharField(
        source="profile.partnership_collaborate_institution_desc")

    collaboration_evidences = PartnerCollaborationEvidenceSerializer(many=True)

    class Meta:
        model = Partner
        fields = (
            'collaborations_partnership',
            'collaborations_partnership_others',

            'partnership_collaborate_institution',
            'partnership_collaborate_institution_desc',

            'collaboration_evidences',
        )

    def update(self, instance, validated_data):
        # std method does not support writable nested fields by default
        PartnerProfile.objects.filter(
            id=instance.profile.id).update(**validated_data["profile"])

        for partnership in self.initial_data.get('collaborations_partnership', []):
            _id = partnership.get("id")
            if _id:
                instance.collaborations_partnership.filter(id=_id).update(**partnership)
            else:
                partnership['partner_id'] = instance.id
                PartnerCollaborationPartnership.objects.create(**partnership)

        for partnership_other in self.initial_data.get('collaborations_partnership_others', []):
            _id = partnership_other.get("id")
            if _id:
                instance.collaborations_partnership_others.filter(id=_id).update(**partnership_other)
            else:
                partnership_other['partner_id'] = instance.id
                PartnerCollaborationPartnershipOther.objects.create(**partnership_other)

        for collaboration_evidence in self.initial_data.get('collaboration_evidences', []):
            _id = collaboration_evidence.get("id")
            if _id:
                instance.collaboration_evidences.filter(id=_id).update(**collaboration_evidence)
            else:
                collaboration_evidence['partner_id'] = instance.id
                PartnerCollaborationEvidence.objects.create(**collaboration_evidence)

        return Partner.objects.get(id=instance.id)  # we want to refresh changes after update on related models


class PartnerProfileProjectImplementationSerializer(serializers.ModelSerializer):

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
    most_recent_audit_report = serializers.FileField(source="audit.most_recent_audit_report")
    link_report = serializers.URLField(source="audit.link_report")
    major_accountability_issues_highlighted = serializers.BooleanField(
        source="audit.major_accountability_issues_highlighted")
    comment = serializers.CharField(source="audit.comment")
    capacity_assessment = serializers.BooleanField(source="audit.capacity_assessment")
    assessments = serializers.ListField(source="audit.assessments")
    assessment_report = serializers.FileField(source="audit.assessment_report")

    key_result = serializers.CharField(source="report.key_result")
    publish_annual_reports = serializers.BooleanField(source="report.publish_annual_reports")
    last_report = serializers.DateField(source="report.last_report")
    report = serializers.FileField(source="report.report")
    link_report = serializers.URLField(source="report.link_report")

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
            'link_report',
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
        )

    def update(self, instance, validated_data):
        # std method does not support writable nested fields by default
        PartnerProfile.objects.filter(
            id=instance.profile.id).update(**validated_data["profile"])
        PartnerAuditAssessment.objects.filter(
            id=instance.audit.id).update(**validated_data["audit"])
        PartnerReporting.objects.filter(
            id=instance.report.id).update(**validated_data["report"])

        for internal_control in self.initial_data.get('internal_controls', []):
            _id = internal_control.get("id")
            if _id:
                instance.internal_controls.filter(id=_id).update(**internal_control)
            else:
                internal_control['partner_id'] = instance.id
                PartnerInternalControl.objects.create(**internal_control)

        for area_policy in self.initial_data.get('area_policies', []):
            _id = area_policy.get("id")
            if _id:
                instance.area_policies.filter(id=_id).update(**area_policy)
            else:
                area_policy['partner_id'] = instance.id
                PartnerPolicyArea.objects.create(**area_policy)

        return Partner.objects.get(id=instance.id)  # we want to refresh changes after update on related models


class PartnerProfileOtherInfoSerializer(serializers.ModelSerializer):

    info_to_share = serializers.CharField(source="other_info.info_to_share")
    org_logo = serializers.FileField(source="other_info.org_logo")
    confirm_data_updated = serializers.BooleanField(source="other_info.confirm_data_updated")

    other_documents = PartnerOtherDocumentSerializer(many=True)

    class Meta:
        model = Partner
        fields = (
            'info_to_share',
            'org_logo',
            'confirm_data_updated',
            'other_documents',
        )

    def update(self, instance, validated_data):
        # std method does not support writable nested fields by default
        PartnerOtherInfo.objects.filter(
            id=instance.other_info.id).update(**validated_data["other_info"])

        for doc in self.initial_data.get('other_documents', []):
            _id = doc.get("id")
            if _id:
                instance.other_documents.filter(id=_id).update(**doc)
            else:
                doc['partner_id'] = instance.id
                PartnerInternalControl.objects.create(**doc)

        return Partner.objects.get(id=instance.id)  # we want to refresh changes after update on related models

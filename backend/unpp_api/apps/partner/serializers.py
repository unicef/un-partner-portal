from rest_framework import serializers

from agency.serializers import OtherAgencySerializer
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
        instance.profile.have_board_directors = validated_data.get("profile", {}).get(
            'have_board_directors', instance.profile.have_board_directors)
        instance.profile.connectivity = validated_data.get("profile", {}).get(
            'connectivity', instance.profile.connectivity)
        instance.profile.connectivity_excuse = validated_data.get("profile", {}).get(
            'connectivity_excuse', instance.profile.connectivity_excuse)
        instance.profile.working_languages = validated_data.get("profile", {}).get(
            'working_languages', instance.profile.working_languages)
        instance.profile.working_languages_other = validated_data.get("profile", {}).get(
            'working_languages_other', instance.profile.working_languages_other)
        instance.profile.save()

        instance.mailing_address.mailing_type = validated_data.get("mailing_address", {}).get(
            'mailing_type', instance.mailing_address.mailing_type)
        instance.mailing_address.street = validated_data.get("mailing_address", {}).get(
            'street', instance.mailing_address.street)
        instance.mailing_address.po_box = validated_data.get("mailing_address", {}).get(
            'po_box', instance.mailing_address.po_box)
        instance.mailing_address.city = validated_data.get("mailing_address", {}).get(
            'city', instance.mailing_address.city)
        instance.mailing_address.country = validated_data.get("mailing_address", {}).get(
            'country', instance.mailing_address.country)
        instance.mailing_address.zip_code = validated_data.get("mailing_address", {}).get(
            'zip_code', instance.mailing_address.zip_code)
        instance.mailing_address.telephone = validated_data.get("mailing_address", {}).get(
            'telephone', instance.mailing_address.telephone)
        instance.mailing_address.fax = validated_data.get("mailing_address", {}).get(
            'fax', instance.mailing_address.fax)
        instance.mailing_address.website = validated_data.get("mailing_address", {}).get(
            'website', instance.mailing_address.website)
        instance.mailing_address.org_email = validated_data.get("mailing_address", {}).get(
            'org_email', instance.mailing_address.org_email)
        instance.mailing_address.save()

        for director in self.initial_data.get('directors', []):
            _id = director.get("id")
            if _id:
                PartnerDirector.objects.filter(id=_id).update(**director)
            else:
                director['partner_id'] = instance.id
                PartnerDirector.objects.create(**director)

        for authorised_officer in self.initial_data.get('authorised_officers', []):
            _id = authorised_officer.get("id")
            if _id:
                PartnerAuthorisedOfficer.objects.filter(id=_id).update(**authorised_officer)
            else:
                authorised_officer['partner_id'] = instance.id
                PartnerAuthorisedOfficer.objects.create(**authorised_officer)

        return instance


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
        instance.mandate_mission.background_and_rationale = validated_data.get("mandate_mission", {}).get(
            'background_and_rationale', instance.mandate_mission.background_and_rationale)
        instance.mandate_mission.mandate_and_mission = validated_data.get("mandate_mission", {}).get(
            'mandate_and_mission', instance.mandate_mission.mandate_and_mission)
        instance.mandate_mission.governance_structure = validated_data.get("mandate_mission", {}).get(
            'governance_structure', instance.mandate_mission.governance_structure)
        instance.mandate_mission.governance_hq = validated_data.get("mandate_mission", {}).get(
            'governance_hq', instance.mandate_mission.governance_hq)
        instance.mandate_mission.governance_organigram = validated_data.get("mandate_mission", {}).get(
            'governance_organigram', instance.mandate_mission.governance_organigram)
        instance.mandate_mission.ethic_safeguard = validated_data.get("mandate_mission", {}).get(
            'ethic_safeguard', instance.mandate_mission.ethic_safeguard)
        instance.mandate_mission.ethic_safeguard_policy = validated_data.get("mandate_mission", {}).get(
            'ethic_safeguard_policy', instance.mandate_mission.ethic_safeguard_policy)
        instance.mandate_mission.ethic_safeguard_comment = validated_data.get("mandate_mission", {}).get(
            'ethic_safeguard_comment', instance.mandate_mission.ethic_safeguard_comment)
        instance.mandate_mission.ethic_fraud = validated_data.get("mandate_mission", {}).get(
            'ethic_fraud', instance.mandate_mission.ethic_fraud)
        instance.mandate_mission.ethic_fraud_policy = validated_data.get("mandate_mission", {}).get(
            'ethic_fraud_policy', instance.mandate_mission.ethic_fraud_policy)
        instance.mandate_mission.ethic_fraud_comment = validated_data.get("mandate_mission", {}).get(
            'ethic_fraud_comment', instance.mandate_mission.ethic_fraud_comment)
        instance.mandate_mission.population_of_concern = validated_data.get("mandate_mission", {}).get(
            'population_of_concern', instance.mandate_mission.population_of_concern)
        instance.mandate_mission.concern_groups = validated_data.get("mandate_mission", {}).get(
            'concern_groups', instance.mandate_mission.concern_groups)
        instance.mandate_mission.security_high_risk_locations = validated_data.get("mandate_mission", {}).get(
            'security_high_risk_locations', instance.mandate_mission.security_high_risk_locations)
        instance.mandate_mission.security_high_risk_policy = validated_data.get("mandate_mission", {}).get(
            'security_high_risk_policy', instance.mandate_mission.security_high_risk_policy)
        instance.mandate_mission.security_desc = validated_data.get("mandate_mission", {}).get(
            'security_desc', instance.mandate_mission.security_desc)

        instance.mandate_mission.save()

        instance.country_presence = validated_data.get("mandate_mission", {}).get(
            'country_presence', instance.country_presence)
        instance.staff_globally = validated_data.get("mandate_mission", {}).get(
            'staff_globally', instance.staff_globally)
        instance.location_of_office = validated_data.get("mandate_mission", {}).get(
            'location_of_office', instance.location_of_office)
        instance.more_office_in_country = validated_data.get("mandate_mission", {}).get(
            'more_office_in_country', instance.more_office_in_country)
        instance.location_field_offices = validated_data.get("mandate_mission", {}).get(
            'location_field_offices', instance.location_field_offices)
        instance.staff_in_country = validated_data.get("mandate_mission", {}).get(
            'staff_in_country', instance.staff_in_country)
        instance.engagement_operate_desc = validated_data.get("mandate_mission", {}).get(
            'engagement_operate_desc', instance.engagement_operate_desc)

        instance.save()

        for experience in self.initial_data.get('experiences', []):
            _id = experience.get("id")
            if _id:
                PartnerExperience.objects.filter(id=_id).update(**experience)
            else:
                experience['partner_id'] = instance.id
                PartnerExperience.objects.create(**experience)

        return instance

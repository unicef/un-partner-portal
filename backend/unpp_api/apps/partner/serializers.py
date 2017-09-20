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

    partner_id = serializers.CharField(source="partner.id", read_only=True)
    profile_id = serializers.CharField(source="id", read_only=True)
    legal_name = serializers.CharField(source="partner.legal_name", read_only=True)
    alias_name = serializers.CharField(read_only=True)
    acronym = serializers.CharField(read_only=True)
    former_legal_name = serializers.CharField(read_only=True)
    country_origin = serializers.CharField(read_only=True)
    type_org = serializers.CharField(source="partner.display_type", read_only=True)

    class Meta:
        model = PartnerProfile
        fields = (
            'partner_id',
            'profile_id',
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

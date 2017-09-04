from rest_framework import serializers

from agency.serializers import OtherAgencySerializer
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


class PartnerHeadOrganizationSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerHeadOrganization
        exclude = ('partner', )


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
    users = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = (
            'id',
            'legal_name',
            'country_code',
            'is_hq',
            'country_profiles',
            'country_presents',
            'users',
            'modified',
        )

    def get_users(self, obj):
        return PartnerMember.objects.filter(partner=obj).count()


class PartnerMailingAddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerMailingAddress
        fields = "__all__"


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


class OrganizationProfileDetailsSerializer(serializers.Serializer):

    partner = PartnerFullSerializer()
    profile = PartnerFullProfilesSerializer()
    mailing = PartnerMailingAddressSerializer()
    directors = PartnerDirectorSerializer(many=True)
    authorised_officers = PartnerAuthorisedOfficerSerializer(many=True)
    head_organization = PartnerHeadOrganizationSerializer()
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
    audit_assessment = PartnerAuditAssessmentSerializer()
    report = PartnerReportingSerializer()

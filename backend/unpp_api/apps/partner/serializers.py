from rest_framework import serializers

from partner.models import (
    Partner,
    PartnerProfile,
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
            'org_head_first_name',
            'org_head_last_name',
            'org_head_email',
        )


class PartnerFullProfilesSerializer(serializers.ModelSerializer):

    class Meta:
        model = PartnerProfile
        fields = "__all__"

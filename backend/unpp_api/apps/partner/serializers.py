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
            #'user',
            #'partner',
            'title',
            # 'role',
            # 'status',
        )


class PartnerProfileSerializer(serializers.ModelSerializer):

    # partner = PartnerSerializer(read_only=True)

    class Meta:
        model = PartnerProfile
        fields = (
            'id',
            # 'partner',
            'alias_name',
            'former_legal_name',
            'legal_name_change',
            'org_head_first_name',
            'org_head_last_name',
            'org_head_email',

        )

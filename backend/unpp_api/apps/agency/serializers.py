from rest_framework import serializers

from account.serializers import UserSerializer
from agency.models import Agency, OtherAgency, AgencyOffice, AgencyMember


class AgencySerializer(serializers.ModelSerializer):

    class Meta:
        model = Agency
        fields = (
            'id',
            'name',
        )


class OtherAgencySerializer(serializers.ModelSerializer):

    class Meta:
        model = OtherAgency
        fields = "__all__"


class AgencyOfficeSerializer(serializers.ModelSerializer):

    agency = AgencySerializer()

    class Meta:
        model = AgencyOffice
        fields = (
            'id',
            'name',
            'countries_code',
            'agency',
        )


class AgencyMemberSerializer(serializers.ModelSerializer):

    office = AgencyOfficeSerializer()
    status_display = serializers.CharField(source='get_status_display')
    role_display = serializers.CharField(source='get_role_display')
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = AgencyMember
        fields = (
            'id',
            'role',
            'role_display',
            'office',
            'telephone',
            'status',
            'status_display',
            'permissions',
        )

    def get_permissions(self, agency_member):
        return [
            p.name for p in agency_member.user_permissions
        ]


class AgencyUserSerializer(UserSerializer):

    office_memberships = AgencyMemberSerializer(many=True, source='agency_members')

    class Meta:
        model = UserSerializer.Meta.model
        fields = UserSerializer.Meta.fields + (
            'office_memberships',
        )

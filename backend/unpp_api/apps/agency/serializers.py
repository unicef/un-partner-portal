from django_countries.serializers import CountryFieldMixin
from rest_framework import serializers

from account.models import User
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


class AgencyOfficeSerializer(CountryFieldMixin, serializers.ModelSerializer):

    agency = AgencySerializer()

    class Meta:
        model = AgencyOffice
        fields = (
            'id',
            'name',
            'country',
            'agency',
        )


class AgencyMemberSerializer(serializers.ModelSerializer):

    office = AgencyOfficeSerializer(read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = AgencyMember
        fields = (
            'id',
            'role',
            'role_display',
            'office',
            'office_id',
            'telephone',
        )


class AgencyMemberFullSerializer(AgencyMemberSerializer):

    permissions = serializers.SerializerMethodField()

    class Meta(AgencyMemberSerializer.Meta):
        fields = AgencyMemberSerializer.Meta.fields + (
            'permissions',
        )

    def get_permissions(self, agency_member):
        return [p.name for p in agency_member.user_permissions]


class AgencyUserBasicSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='fullname', read_only=True)
    agency_name = serializers.CharField(source='agency.name', read_only=True)

    class Meta:
        model = User

        fields = (
            'id',
            'is_active',
            'name',
            'email',
            'status',
            'agency_name',
        )


class AgencyUserListSerializer(AgencyUserBasicSerializer):

    office_memberships = AgencyMemberSerializer(many=True, source='agency_members', allow_empty=False)

    class Meta(AgencyUserBasicSerializer.Meta):
        fields = AgencyUserBasicSerializer.Meta.fields + (
            'office_memberships',
        )


class AgencyUserSerializer(AgencyUserListSerializer):

    office_memberships = AgencyMemberFullSerializer(many=True, source='agency_members', allow_empty=False)

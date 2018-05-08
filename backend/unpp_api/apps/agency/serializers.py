from rest_framework import serializers

from account.models import User
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

    class Meta:
        model = AgencyOffice
        fields = ('id', 'name', 'countries_code',)


class AgencyMemberSerializer(serializers.ModelSerializer):

    office = AgencyOfficeSerializer()
    status_display = serializers.CharField(source='get_status_display')
    role_display = serializers.CharField(source='get_role_display')

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
        )


class AgencyUserOfficesSerializer(UserSerializer):

    office_memberships = AgencyMemberSerializer(many=True, source='agency_members')

    class Meta:
        model = UserSerializer.Meta.model
        fields = UserSerializer.Meta.fields + (
            'office_memberships',
        )


class AgencyUserSerializer(UserSerializer):

    agency_name = serializers.SerializerMethodField()
    agency_id = serializers.SerializerMethodField()
    office_name = serializers.SerializerMethodField()
    office_id = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = UserSerializer.Meta.fields + (
            'agency_name',
            'agency_id',
            'role',
            'status',
            'office_name',
            'office_id',
        )

    def _agency_member(self, obj):
        # This is a potential problem, it is possible for user to belong to multiple offices
        return obj.agency_members.first()

    def get_role(self, obj):
        return self._agency_member(obj).get_role_display()

    def get_status(self, obj):
        return self._agency_member(obj).get_status_display()

    def get_agency_name(self, obj):
        return self._agency_member(obj).office.agency.name

    def get_agency_id(self, obj):
        return self._agency_member(obj).office.agency.id

    def get_office_name(self, obj):
        return self._agency_member(obj).office.name

    def get_office_id(self, obj):
        return self._agency_member(obj).office.id

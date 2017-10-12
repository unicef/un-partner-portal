from rest_framework import serializers

from account.models import User
from .models import Agency, OtherAgency, AgencyOffice


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


class AgencyUserSerializer(serializers.ModelSerializer):

    agency_name = serializers.SerializerMethodField()
    office_name = serializers.SerializerMethodField()
    name = serializers.CharField(source='get_fullname')

    class Meta:
        model = User
        fields = ('id', 'agency_name', 'name', 'office_name',)

    def get_agency_name(self, obj):
        agency_member = obj.agency_members.get()
        return agency_member.office.agency.name

    def get_office_name(self, obj):
        agency_member = obj.agency_members.get()
        return agency_member.office.name

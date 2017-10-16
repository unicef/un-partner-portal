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

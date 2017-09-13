from rest_framework import serializers
from .models import Agency, OtherAgency


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

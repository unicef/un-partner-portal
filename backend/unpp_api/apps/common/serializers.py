from rest_framework import serializers
from .models import Point, Sector, Specialization


class SimpleSpecializationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Specialization
        fields = (
            'id',
            'name',
            'category'
        )


class ConfigSectorSerializer(serializers.ModelSerializer):

    specializations = SimpleSpecializationSerializer(many=True)

    class Meta:
        model = Sector
        fields = (
            'id',
            'name',
            'specializations',
        )


class PointSerializer(serializers.ModelSerializer):

    class Meta:
        model = Point
        fields = "__all__"

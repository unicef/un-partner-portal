from django.db.models.base import Model
from rest_framework import serializers
from .models import AdminLevel1, Point, Sector, Specialization, CommonFile


class MixinPartnerRelatedSerializer(serializers.ModelSerializer):

    def update_partner_related(self, instance, validated_data, related_names=[]):
        for related_name in related_names:
            if isinstance(getattr(instance, related_name), Model):
                if related_name not in validated_data:
                    continue  # for patch if we didn't patch some section in body
                # OneToOneField related to partner - Model object
                _id = getattr(instance, related_name).id
                getattr(instance, related_name).__class__.objects.filter(id=_id).update(**validated_data[related_name])
            else:
                # ForeignKey related to partner - RelatedManager object
                for data in self.initial_data.get(related_name, []):
                    _id = data.get("id")
                    if _id:
                        getattr(instance, related_name).filter(id=_id).update(**data)
                    else:
                        data['partner_id'] = instance.id
                        getattr(instance, related_name).create(**data)


class ShortSectorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Sector
        fields = (
            "id",
            'name',
        )


class SpecializationSerializer(serializers.ModelSerializer):

    category = ShortSectorSerializer()

    class Meta:
        model = Specialization
        fields = (
            'id',
            'name',
            'category'
        )


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


class AdminLevel1Serializer(serializers.ModelSerializer):

    class Meta:
        model = AdminLevel1
        fields = "__all__"


class AdminLevel1CountrySerializer(serializers.ModelSerializer):

    class Meta:
        model = AdminLevel1
        fields = ("country_code", )


class PointSerializer(serializers.ModelSerializer):

    admin_level_1 = AdminLevel1Serializer()

    class Meta:
        model = Point
        fields = "__all__"


class CommonFileSerializer(serializers.ModelSerializer):

    class Meta:
        model = CommonFile
        fields = "__all__"


class CountryPointSerializer(serializers.ModelSerializer):

    country_code = serializers.CharField(source="admin_level_1.country_code")

    class Meta:
        model = Point
        fields = ("country_code", )

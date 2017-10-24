from django.db.models.base import Model
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
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
                # ForeignKey related to partner - RelatedManager object - here we remove if we post/patch empty field
                related_items = self.initial_data.get(related_name)
                if related_items is None:
                    continue  # for patch if we didn't patch some related object in body
                # user can add and remove on update
                for related_item in getattr(instance, related_name).all():
                    if related_item.id not in map(lambda x: x.get("id"), related_items):
                        # here we remove related item that is not in list - so we don't need it!
                        related_item.delete()

                # ForeignKey related to partner - RelatedManager object - here we add or update if exist related item
                for data in self.initial_data.get(related_name, []):
                    _id = data.get("id")
                    if _id:
                        getattr(instance, related_name).filter(id=_id).update(**data)
                    else:
                        data['partner_id'] = instance.id
                        data['created_by'] = self.context['request'].user
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

    def to_representation(self, obj):
        rep = super(CommonFileSerializer, self).to_representation(obj)
        return rep['file_field']

    def to_internal_value(self, data):
        try:
            return CommonFile.objects.get(id=int(data))
        except:
            raise ValidationError('No File Exists with this ID')

    class Meta:
        model = CommonFile
        fields = (
            'id',
            'file_field',
        )


class CommonFileUploadSerializer(serializers.ModelSerializer):

    class Meta:
        model = CommonFile
        fields = (
            'id',
            'file_field',
        )


class CountryPointSerializer(serializers.ModelSerializer):

    country_code = serializers.CharField(source="admin_level_1.country_code")

    class Meta:
        model = Point
        fields = ("country_code", )

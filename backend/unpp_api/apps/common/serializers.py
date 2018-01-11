# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db.models.base import Model
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from common.models import AdminLevel1, Point, Sector, Specialization, CommonFile


class MixinPartnerRelatedSerializer(serializers.ModelSerializer):

    exclude_fields = {}

    def raise_error_if_file_is_already_referenced(self, field_name, cfile):
        if cfile.has_existing_reference:
            raise serializers.ValidationError({
                field_name: 'This given common file id {} can be used only once.'.format(cfile.id)
            })

    def update_partner_related(self, instance, validated_data, related_names=[]):
        for related_name in related_names:
            model_data = validated_data.pop(related_name, None)

            if isinstance(getattr(instance, related_name), Model):
                if not model_data:
                    continue
                related_model = getattr(instance, related_name)

                for field_name, value in model_data.items():
                    setattr(related_model, field_name, value)
                related_model.save()
            else:
                related_manager = getattr(instance, related_name)

                # ForeignKey related to partner - RelatedManager object - here
                # we remove if we post/patch empty field
                related_items = self.initial_data.get(related_name)
                if related_items is None:
                    continue  # for patch if we didn't patch some related object in body
                # user can add and remove on update
                for related_item in related_manager.all():
                    if related_item.id not in map(lambda x: x.get("id"), related_items):
                        # here we remove related item that is not in list - so we don't need it!
                        related_item.delete()

                # ForeignKey related to partner - RelatedManager object - here we add or update if exist related item
                for data in self.initial_data.get(related_name, []):
                    for field in self.exclude_fields.get(related_name, []):
                        field in data and data.pop(field)
                    _id = data.get("id")

                    # Check if data contains file that is already referenced
                    for field_name, value in data.items():
                        if isinstance(value, CommonFile):
                            self.raise_error_if_file_is_already_referenced(field_name, value)

                    if _id:
                        related_manager.filter(id=_id).update(**data)
                    else:
                        data['partner_id'] = instance.id
                        data['created_by'] = self.context['request'].user
                        related_manager.create(**data)


class MixinPreventManyCommonFile(object):
    """
    Prevents same CommonFile from being submitted twice by different partners
    """

    prevent_keys = []

    def prevent_many_common_file_validator(self, data):

        if self.prevent_keys:
            values = []
            for key in self.prevent_keys:
                val = data.get(key)
                if val:
                    if isinstance(val, CommonFile):
                        values.append(val.id)
                    else:
                        values.append(val)

            # can not be the same
            if len(list(set(values))) != len(values):
                raise ValidationError(
                    'Given related field common file id have to be unique.'
                )

            for value in values:
                cfile = get_object_or_404(CommonFile, pk=value)

                if cfile.has_existing_reference:
                    raise ValidationError(
                        'This given common file id {} can be used only once.'.format(value)
                    )


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
        validators = []  # Validation handled in custom get or create on point


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

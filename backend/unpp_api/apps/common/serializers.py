# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import base64
import mimetypes
import numbers

from django.core.files.uploadedfile import SimpleUploadedFile
from django.db.models.base import Model
from django.shortcuts import get_object_or_404
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from common.countries import LOCATION_OPTIONAL_COUNTRIES
from common.models import AdminLevel1, Point, Sector, Specialization, CommonFile


# This whole approach is way too hacky, if this behaviour causes any more bugs this should be removed alltogether
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
            if not hasattr(instance, related_name):
                continue

            if isinstance(getattr(instance, related_name), Model):
                if not model_data:
                    continue
                related_model = getattr(instance, related_name)

                for field_name, value in model_data.items():
                    setattr(related_model, field_name, value)
                related_model.save()
            else:
                model_data = self.initial_data.get(related_name)
                if model_data is None:
                    continue

                related_manager = getattr(instance, related_name)
                valid_ids = []

                related_serializer = self.fields[related_name].child.__class__
                for idx, object_data in enumerate(model_data):
                    save_kwargs = {}

                    for field in self.exclude_fields.get(related_name, []):
                        field in object_data and object_data.pop(field)

                    for field_name, value in object_data.items():
                        if isinstance(value, CommonFile):
                            self.raise_error_if_file_is_already_referenced(field_name, value)

                    _id = object_data.pop('id', None)
                    object_data['partner'] = instance.id
                    object_data['partner_id'] = instance.id

                    if not _id and hasattr(related_manager.model, 'created_by'):
                        save_kwargs['created_by'] = self.context['request'].user

                    serializer = related_serializer(
                        related_serializer.Meta.model.objects.filter(id=_id).first(),
                        data=object_data,
                        context=self.context
                    )
                    if not serializer.is_valid():
                        raise serializers.ValidationError({
                            related_name: {
                                idx: serializer.errors
                            }
                        })

                    valid_ids.append(serializer.save(**save_kwargs).id)

                if valid_ids:
                    to_be_removed = related_manager.exclude(id__in=valid_ids)
                    if hasattr(related_manager.model, 'editable'):
                        to_be_removed.exclude(editable=False)
                    to_be_removed.delete()


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
        fields = (
            'id',
            'name',
            'country_code',
            'country_name',
        )
        validators = []  # Validation handled in custom get or create on point

    def validate(self, data):
        if data['country_code'] not in LOCATION_OPTIONAL_COUNTRIES and not data.get('name'):
            raise ValidationError({
                'name': [
                    'this field is required for {}'.format(data['country_code'])
                ]
            })
        return super(AdminLevel1Serializer, self).validate(data)

    def create(self, validated_data):
        if 'id' in self.initial_data:
            return self.update(self.Meta.model.objects.get(id=self.initial_data['id']), validated_data)
        else:
            admin_level_1, _ = AdminLevel1.objects.get_or_create(
                name=validated_data.get('name'),
                country_code=validated_data['country_code'],
            )
            return admin_level_1


class AdminLevel1CountrySerializer(serializers.ModelSerializer):

    class Meta:
        model = AdminLevel1
        fields = ("country_code", )


class PointSerializer(serializers.ModelSerializer):

    admin_level_1 = AdminLevel1Serializer()

    class Meta:
        model = Point
        fields = "__all__"

    def validate(self, data):
        if 'admin_level_1' in data and data['admin_level_1']['country_code'] not in LOCATION_OPTIONAL_COUNTRIES:
            errors = {}
            for field in ('lat', 'lon'):
                if not isinstance(data.get(field), numbers.Number):
                    errors[field] = [
                        'this field is required for {}'.format(data['admin_level_1']['country_code'])
                    ]
            if errors:
                raise ValidationError(errors)

        return super(PointSerializer, self).validate(data)

    def create(self, validated_data):
        validated_data.pop('admin_level_1', None)
        admin_level_serializer = AdminLevel1Serializer(data=self.initial_data.get('admin_level_1'))
        admin_level_serializer.is_valid(raise_exception=True)
        validated_data['admin_level_1'] = admin_level_serializer.save()
        if 'id' in self.initial_data:
            return self.update(self.Meta.model.objects.get(id=self.initial_data['id']), validated_data)
        else:
            return super(PointSerializer, self).create(validated_data)


class CommonFileSerializer(serializers.ModelSerializer):

    def to_representation(self, obj):
        rep = super(CommonFileSerializer, self).to_representation(obj)
        return rep['file_field']

    def to_internal_value(self, data):
        try:
            return CommonFile.objects.get(id=int(data))
        except CommonFile.DoesNotExist:
            raise ValidationError('No File Exists with this ID')
        except Exception:
            raise ValidationError(f'Invalid file ID specified {data}')

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


class CommonFileBase64UploadSerializer(CommonFileSerializer):

    content = serializers.CharField(write_only=True)
    filename = serializers.CharField(write_only=True)

    class Meta:
        model = CommonFile
        fields = (
            'id',
            'content',
            'filename',
            'file_field',
        )
        extra_kwargs = {
            'file_field': {
                'read_only': True
            }
        }

    def to_internal_value(self, data):
        if type(data) is not dict:
            return super(CommonFileBase64UploadSerializer, self).to_internal_value(data)
        else:
            uploaded_file = SimpleUploadedFile(
                data['filename'],
                base64.b64decode(data['content']),
                mimetypes.guess_type(data['filename'])
            )
            return CommonFile.objects.create(file_field=uploaded_file)


class CountryPointSerializer(serializers.ModelSerializer):

    country_code = serializers.CharField(source="admin_level_1.country_code")

    class Meta:
        model = Point
        fields = ("country_code", )

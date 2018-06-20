# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import serializers

from agency.permissions import AgencyPermission
from common.consts import USER_CREATED_FLAG_TYPES, INTERNAL_FLAG_TYPES
from common.permissions import current_user_has_permission
from common.serializers import CommonFileSerializer
from agency.serializers import AgencyUserBasicSerializer
from review.models import PartnerFlag, PartnerVerification
from sanctionslist.serializers import SanctionedNameMatchSerializer


class PartnerFlagSerializer(serializers.ModelSerializer):

    submitter = AgencyUserBasicSerializer(read_only=True)
    attachment = CommonFileSerializer(required=False)
    is_valid = serializers.BooleanField(required=False)
    flag_type_display = serializers.CharField(source='get_flag_type_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    sanctions_match = SanctionedNameMatchSerializer(read_only=True)

    class Meta:
        model = PartnerFlag
        read_only_fields = (
            'submitter',
            'partner',
            'comment',
            'attachment',
            'sanctions_match',
        )
        exclude = (
            'type_history',
        )
        extra_kwargs = {
            'flag_type': {
                'choices': USER_CREATED_FLAG_TYPES
            },
            'comment': {
                'required': True
            },
            'contact_email': {
                'required': True
            },
        }

    def get_extra_kwargs(self):
        extra_kwargs = super(PartnerFlagSerializer, self).get_extra_kwargs()
        if self.instance and self.instance.flag_type not in USER_CREATED_FLAG_TYPES:
            extra_kwargs['flag_type']['read_only'] = True
        return extra_kwargs

    def get_fields(self):
        fields = super(PartnerFlagSerializer, self).get_fields()
        request = self.context.get('request')
        if not request or not current_user_has_permission(request, agency_permissions=[
            AgencyPermission.VIEW_PROFILE_OBSERVATION_FLAG_COMMENTS
        ]):
            fields.pop('comment')
        if not request and not request.method == 'GET':
            fields.pop('sanctions_match')

        return fields

    def update(self, instance, validated_data):
        new_flag_type = validated_data.get('flag_type')
        old_flag_type = instance.flag_type

        instance = super(PartnerFlagSerializer, self).update(instance, validated_data)
        if new_flag_type and not old_flag_type == new_flag_type:
            instance.type_history.append(old_flag_type)
            instance.save()

        if instance.flag_type == INTERNAL_FLAG_TYPES.sanctions_match and instance.sanctions_match:
            if instance.is_valid is not None:
                instance.sanctions_match.can_ignore = not instance.is_valid
                instance.sanctions_match.save()
                instance.sanctions_match.partner.is_locked = instance.is_valid
                instance.sanctions_match.partner.children.update(is_locked=instance.is_valid)
                instance.sanctions_match.partner.save()

        return instance


class PartnerVerificationSerializer(serializers.ModelSerializer):

    submitter = AgencyUserBasicSerializer(read_only=True)

    class Meta:
        model = PartnerVerification
        read_only_fields = (
            'submitter',
            'is_verified',
        )
        exclude = (
            'partner',
        )

    def get_fields(self):
        fields = super(PartnerVerificationSerializer, self).get_fields()
        request = self.context.get('request')
        if not request or not current_user_has_permission(request, agency_permissions=[
            AgencyPermission.VERIFY_SEE_COMMENTS
        ]):
            comment_fields = filter(lambda fn: fn.endswith('comment'), fields.keys())
            for field_name in list(comment_fields):
                fields.pop(field_name)

        return fields

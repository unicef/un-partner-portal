# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import transaction
from rest_framework import serializers

from agency.permissions import AgencyPermission
from common.consts import USER_CREATED_FLAG_CATEGORIES, INTERNAL_FLAG_CATEGORIES, FLAG_TYPES
from common.permissions import current_user_has_permission
from common.serializers import CommonFileSerializer
from agency.serializers import AgencyUserBasicSerializer
from notification.helpers import send_new_escalated_flag_email
from partner.utilities import lock_partner_for_deactivation
from review.models import PartnerFlag, PartnerVerification
from sanctionslist.serializers import SanctionedNameMatchSerializer


class PartnerFlagSerializer(serializers.ModelSerializer):

    submitter = AgencyUserBasicSerializer(read_only=True)
    attachment = CommonFileSerializer(required=False)
    is_valid = serializers.BooleanField(required=False)
    flag_type_display = serializers.CharField(source='get_flag_type_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    sanctions_match = SanctionedNameMatchSerializer(read_only=True)
    can_be_escalated = serializers.SerializerMethodField()

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
            'category': {
                'choices': USER_CREATED_FLAG_CATEGORIES
            },
            'comment': {
                'required': True
            },
            'contact_email': {
                'required': True
            },
        }

    def get_can_be_escalated(self, flag):
        return flag.flag_type == FLAG_TYPES.yellow and FLAG_TYPES.escalated not in flag.type_history

    def get_extra_kwargs(self):
        extra_kwargs = super(PartnerFlagSerializer, self).get_extra_kwargs()
        if isinstance(self.instance, PartnerFlag):
            if self.instance.category not in USER_CREATED_FLAG_CATEGORIES:
                extra_kwargs['category']['read_only'] = True

            if self.instance.flag_type == FLAG_TYPES.escalated:
                # Escalated flags can only be changed through validating / invalidating
                extra_kwargs['flag_type'] = {
                    'read_only': True
                }

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

    @transaction.atomic
    def update(self, instance: PartnerFlag, validated_data):
        new_flag_type = validated_data.get('flag_type')
        old_flag_type = instance.flag_type

        if new_flag_type == FLAG_TYPES.red:
            request = self.context.get('request')
            current_user_has_permission(
                request,
                agency_permissions=[
                    AgencyPermission.ADD_RED_FLAG_ALL_CSO_PROFILES,
                ],
                raise_exception=True
            )

        if validated_data.get('is_valid') is False and not validated_data.get('invalidation_comment'):
            raise serializers.ValidationError({
                'invalidation_comment': 'This field is required.'
            })

        if new_flag_type and not old_flag_type == new_flag_type:
            instance.type_history.append(old_flag_type)
            instance.save()

            if new_flag_type == FLAG_TYPES.escalated:
                if FLAG_TYPES.escalated in instance.type_history:
                    raise serializers.ValidationError({
                        'flag_type': 'This risk flag has already been escalated in the past.'
                    })
                validated_data['is_valid'] = None
                send_new_escalated_flag_email(instance)

        instance = super(PartnerFlagSerializer, self).update(instance, validated_data)

        if instance.flag_type == FLAG_TYPES.red and instance.is_valid:
            lock_partner_for_deactivation(instance.partner)
        elif instance.category == INTERNAL_FLAG_CATEGORIES.sanctions_match and instance.sanctions_match:
            if instance.is_valid is not None:
                instance.sanctions_match.can_ignore = not instance.is_valid
                instance.sanctions_match.save()
                instance.sanctions_match.partner.is_locked = instance.is_valid
                instance.sanctions_match.partner.children.update(is_locked=instance.is_valid)
                instance.sanctions_match.partner.save()

                if instance.is_valid:
                    lock_partner_for_deactivation(instance.partner)

        if instance.flag_type == FLAG_TYPES.escalated and instance.is_valid is not None:
            instance = self.update(instance, {
                'flag_type': FLAG_TYPES.red if instance.is_valid else FLAG_TYPES.yellow
            })

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

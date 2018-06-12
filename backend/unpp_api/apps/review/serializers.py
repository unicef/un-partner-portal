# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import serializers

from agency.permissions import AgencyPermission
from common.consts import USER_CREATED_FLAG_TYPES
from common.permissions import current_user_has_permission
from common.serializers import CommonFileSerializer
from agency.serializers import AgencyUserBasicSerializer
from review.models import PartnerFlag, PartnerVerification


class PartnerFlagSerializer(serializers.ModelSerializer):

    submitter = AgencyUserBasicSerializer(read_only=True)
    attachment = CommonFileSerializer(required=False)
    is_valid = serializers.BooleanField(required=False)
    flag_type_display = serializers.CharField(source='get_flag_type_display')

    class Meta:
        model = PartnerFlag
        read_only_fields = (
            'submitter',
            'partner',
            'comment',
            'attachment',
        )
        exclude = (
            'partner',
        )
        extra_kwargs = {
            'flag_type': {
                'choices': USER_CREATED_FLAG_TYPES
            }
        }

    def get_fields(self):
        fields = super(PartnerFlagSerializer, self).get_fields()
        request = self.context.get('request')
        if not request or not current_user_has_permission(request, agency_permissions=[
            AgencyPermission.VIEW_PROFILE_OBSERVATION_FLAG_COMMENTS
        ]):
            fields.pop('comment')
        return fields


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

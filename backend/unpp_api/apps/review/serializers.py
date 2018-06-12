# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import serializers

from agency.permissions import AgencyPermission
from common.permissions import current_user_has_permission
from common.serializers import CommonFileSerializer
from agency.serializers import AgencyUserBasicSerializer
from review.models import PartnerFlag, PartnerVerification


class PartnerFlagSerializer(serializers.ModelSerializer):

    submitter = AgencyUserBasicSerializer(read_only=True)
    attachment = CommonFileSerializer(required=False)

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

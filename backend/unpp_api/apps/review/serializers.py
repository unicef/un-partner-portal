# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import serializers

from common.serializers import CommonFileSerializer
from agency.serializers import AgencyUserListSerializer
from .models import PartnerFlag, PartnerVerification


class PartnerFlagSerializer(serializers.ModelSerializer):

    submitter = AgencyUserListSerializer(read_only=True)
    attachment = CommonFileSerializer(required=False)

    class Meta:
        model = PartnerFlag
        read_only_fields = ('submitter', )
        exclude = ('partner', )


class PartnerVerificationSerializer(serializers.ModelSerializer):

    submitter = AgencyUserListSerializer(read_only=True)

    class Meta:
        model = PartnerVerification
        read_only_fields = ('submitter', 'is_verified', )
        exclude = ('partner', )

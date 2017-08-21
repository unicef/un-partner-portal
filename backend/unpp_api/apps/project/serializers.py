# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from rest_framework import serializers
from agency.serializers import AgencySerializer
from common.serializers import ConfigSectorSerializer
from common.models import Sector
from .models import EOI


class BaseProjectSerializer(serializers.ModelSerializer):

    sectors = serializers.SerializerMethodField()
    agency = AgencySerializer()
    pinned = serializers.SerializerMethodField()

    class Meta:
        model = EOI
        fields = (
            'id',
            'title',
            'country_code',
            'sectors',
            'agency',
            'start_date',
            'end_date',
            'deadline_date',
            'status',
            'pinned',
        )

    def get_sectors(self, obj):
        specializations = obj.specializations.all()
        categories = specializations.values_list('category_id', flat=True)
        qs = Sector.objects.filter(id__in=categories, specializations__in=specializations).distinct()
        return ConfigSectorSerializer(qs, many=True).data

    def get_pinned(self, obj):
        return obj.pinned.exists()

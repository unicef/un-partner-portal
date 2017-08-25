# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import transaction
from rest_framework import serializers
from agency.serializers import AgencySerializer
from common.serializers import ConfigSectorSerializer, PointSerializer
from common.models import Sector, Point
from .models import EOI, AssessmentCriteria


class AssessmentCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentCriteria
        exclude = ('eoi', )


class BaseProjectSerializer(serializers.ModelSerializer):

    sectors = serializers.SerializerMethodField()
    agency = AgencySerializer()

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
        )

    def get_sectors(self, obj):
        specializations = obj.specializations.all()
        categories = specializations.values_list('category_id', flat=True)
        qs = Sector.objects.filter(id__in=categories, specializations__in=specializations).distinct()
        return ConfigSectorSerializer(qs, many=True).data


class CreateEOISerializer(serializers.ModelSerializer):

    locations = PointSerializer(many=True)

    class Meta:
        model = EOI
        exclude = ('cn_template', 'invited_partners', 'reviewers')


class CreateProjectSerializer(serializers.Serializer):

    eoi = CreateEOISerializer()
    assessment_criterias = AssessmentCriteriaSerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        locations = validated_data['eoi']['locations']
        del validated_data['eoi']['locations']
        specializations = validated_data['eoi']['specializations']
        del validated_data['eoi']['specializations']
        assessment_criterias = validated_data['assessment_criterias']
        del validated_data['assessment_criterias']

        eoi = EOI.objects.create(**validated_data['eoi'])

        for location in locations:
            point, created = Point.objects.get_or_create(**location)
            eoi.locations.add(point)

        for specialization in specializations:
            eoi.specializations.add(specialization)

        created_ac = []
        for assessment_criteria in assessment_criterias:
            assessment_criteria['eoi'] = eoi
            created_ac.append(AssessmentCriteria.objects.create(**assessment_criteria))

        return {
            'eoi': eoi,
            'assessment_criterias': created_ac,
        }

# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import transaction
from rest_framework import serializers
from agency.serializers import AgencySerializer
from common.serializers import SimpleSpecializationSerializer, PointSerializer
from common.models import Point, AdminLevel1
from partner.serializers import PartnerSelectedSerializer
from .models import EOI, AssessmentCriteria


class AssessmentCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentCriteria
        exclude = ('eoi', )


class BaseProjectSerializer(serializers.ModelSerializer):

    specializations = SimpleSpecializationSerializer(many=True)
    agency = AgencySerializer()
    created = serializers.SerializerMethodField()

    class Meta:
        model = EOI
        fields = (
            'id',
            'title',
            'created',
            'country_code',
            'specializations',
            'agency',
            'start_date',
            'end_date',
            'deadline_date',
            'status',
        )

    def get_created(self, obj):
        return obj.created.date()


class DirectProjectSerializer(BaseProjectSerializer):

    selected_partners = PartnerSelectedSerializer(many=True)

    class Meta:
        model = EOI
        fields = (
            'id',
            'title',
            'created',
            'country_code',
            'sectors',
            'agency',
            'start_date',
            'end_date',
            'deadline_date',
            'status',
            'selected_partners',
            'selected_source',
        )


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
            location['admin_level_1'], created = AdminLevel1.objects.get_or_create(**location['admin_level_1'])
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

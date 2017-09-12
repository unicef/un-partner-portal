# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import transaction
from rest_framework import serializers
from agency.serializers import AgencySerializer
from common.consts import APPLICATION_STATUSES
from common.serializers import ConfigSectorSerializer, PointSerializer
from common.models import Sector, Point, AdminLevel1
from .models import EOI, Application, AssessmentCriteria


class AssessmentCriteriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = AssessmentCriteria
        exclude = ('eoi', )


class BaseProjectSerializer(serializers.ModelSerializer):

    sectors = serializers.SerializerMethodField()
    agency = AgencySerializer()
    created = serializers.SerializerMethodField()

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
        )

    def get_created(self, obj):
        return obj.created.date()

    def get_sectors(self, obj):
        specializations = obj.specializations.all()
        categories = specializations.values_list('category_id', flat=True)
        qs = Sector.objects.filter(id__in=categories, specializations__in=specializations).distinct()
        return ConfigSectorSerializer(qs, many=True).data


class DirectProjectSerializer(BaseProjectSerializer):

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
            'selected_source',
        )


class CreateEOISerializer(serializers.ModelSerializer):

    locations = PointSerializer(many=True)

    class Meta:
        model = EOI
        exclude = ('cn_template', )


class CreateDirectEOISerializer(serializers.ModelSerializer):

    locations = PointSerializer(many=True)

    class Meta:
        model = EOI
        exclude = ('cn_template', 'deadline_date')


class ApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        exclude = ("cn", )


class CreateDirectProjectSerializer(serializers.Serializer):

    eoi = CreateDirectEOISerializer()
    applications = ApplicationSerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        locations = validated_data['eoi']['locations']
        del validated_data['eoi']['locations']
        specializations = validated_data['eoi']['specializations']
        del validated_data['eoi']['specializations']

        eoi = EOI.objects.create(**validated_data['eoi'])
        for location in locations:
            location['admin_level_1'], created = AdminLevel1.objects.get_or_create(**location['admin_level_1'])
            point, created = Point.objects.get_or_create(**location)
            eoi.locations.add(point)

        for specialization in specializations:
            eoi.specializations.add(specialization)

        apps = []
        for app in validated_data['applications']:
            _app = Application.objects.create(
                partner=app['partner'],
                eoi=eoi,
                submitter=app['submitter'],
                agency=eoi.agency,
                status=APPLICATION_STATUSES.pending,
                did_win=True,
                did_accept=False,
                ds_justification_select=app['ds_justification_select'],
                ds_justification_reason=app['ds_justification_reason'],
            )
            apps.append(_app)
        return {
            "eoi": eoi,
            "applications": apps,
        }


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

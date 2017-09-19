# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import transaction
from rest_framework import serializers
from agency.serializers import AgencySerializer
from common.consts import APPLICATION_STATUSES
from common.serializers import SimpleSpecializationSerializer, PointSerializer
from common.models import Point, AdminLevel1
from partner.serializers import PartnerSerializer
from partner.models import Partner
from .models import EOI, Application, AssessmentCriteria


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


class CreateDirectApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        exclude = ("cn", "eoi", "submitter")


class CreateDirectApplicationNoCNSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        exclude = ("cn", )


class ApplicationFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        fields = '__all__'


class CreateDirectProjectSerializer(serializers.Serializer):

    eoi = CreateDirectEOISerializer()
    applications = CreateDirectApplicationSerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        locations = validated_data['eoi']['locations']
        del validated_data['eoi']['locations']
        specializations = validated_data['eoi']['specializations']
        del validated_data['eoi']['specializations']
        focal_points = validated_data['eoi']['focal_points']
        del validated_data['eoi']['focal_points']
        # import pdb; pdb.set_trace()

        eoi = EOI.objects.create(**validated_data['eoi'])
        for location in locations:
            location['admin_level_1'], created = AdminLevel1.objects.get_or_create(**location['admin_level_1'])
            point, created = Point.objects.get_or_create(**location)
            eoi.locations.add(point)

        for specialization in specializations:
            eoi.specializations.add(specialization)

        for focal_point in focal_points:
            eoi.focal_points.add(focal_point)

        apps = []
        for app in validated_data['applications']:
            _app = Application.objects.create(
                partner=app['partner'],
                eoi=eoi,
                submitter=validated_data['eoi']['created_by'],
                status=APPLICATION_STATUSES.pending,
                did_win=True,
                did_accept=False,
                ds_justification_select=app['ds_justification_select'],
                justification_reason=app['justification_reason'],
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
        focal_points = validated_data['eoi']['focal_points']
        del validated_data['eoi']['focal_points']
        assessment_criterias = validated_data['assessment_criterias']
        del validated_data['assessment_criterias']

        validated_data['eoi']['cn_template'] = validated_data['eoi']['agency'].profile.eoi_template
        eoi = EOI.objects.create(**validated_data['eoi'])

        for location in locations:
            location['admin_level_1'], created = AdminLevel1.objects.get_or_create(**location['admin_level_1'])
            point, created = Point.objects.get_or_create(**location)
            eoi.locations.add(point)

        for specialization in specializations:
            eoi.specializations.add(specialization)

        for focal_point in focal_points:
            eoi.focal_points.add(focal_point)

        created_ac = []
        for assessment_criteria in assessment_criterias:
            assessment_criteria['eoi'] = eoi
            created_ac.append(AssessmentCriteria.objects.create(**assessment_criteria))

        return {
            'eoi': eoi,
            'assessment_criterias': created_ac,
        }


class ProjectUpdateSerializer(serializers.ModelSerializer):

    specializations = SimpleSpecializationSerializer(many=True)
    invited_partners = PartnerSerializer(many=True)
    locations = PointSerializer(many=True)
    assessments_criteria = AssessmentCriteriaSerializer(many=True)

    class Meta:
        model = EOI
        fields = (
            'id',
            'specializations',
            'invited_partners',
            'locations',
            'assessments_criteria',
            'start_date',
            'end_date',
            'deadline_date',
            'notif_results_date',
            'justification',
            'completed_reason',
        )

    def update(self, instance, validated_data):
        if 'invited_partners' in validated_data:
            del validated_data['invited_partners']
            # user can add and remove on update - here we remove partners that are not in list
            for partner in instance.invited_partners.all():
                if partner.id not in map(lambda x: x['id'], self.initial_data.get('invited_partners', [])):
                    instance.invited_partners.remove(partner)

        instance = super(ProjectUpdateSerializer, self).update(instance, validated_data)
        for invited_partner in self.initial_data.get('invited_partners', []):
            instance.invited_partners.add(Partner.objects.get(id=invited_partner['id']))
        instance.save()

        return instance


class ApplicationsListSerializer(serializers.ModelSerializer):

    legal_name = serializers.CharField(source="partner.legal_name")
    type_org = serializers.CharField(source="partner.display_type")

    class Meta:
        model = Application
        fields = (
            'id',
            'legal_name',
            'type_org',
            'status',
        )

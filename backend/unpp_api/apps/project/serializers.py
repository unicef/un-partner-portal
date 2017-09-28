# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import transaction
from rest_framework import serializers
from account.models import User
from agency.serializers import AgencySerializer
from common.consts import APPLICATION_STATUSES
from common.serializers import SimpleSpecializationSerializer, PointSerializer
from common.models import Point, AdminLevel1
from partner.serializers import PartnerSerializer
from partner.models import Partner
from .models import EOI, Application, AssessmentCriteria, Assessment


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
    assessment_criterias = AssessmentCriteriaSerializer()

    @transaction.atomic
    def create(self, validated_data):
        locations = validated_data['eoi']['locations']
        del validated_data['eoi']['locations']
        specializations = validated_data['eoi']['specializations']
        del validated_data['eoi']['specializations']
        focal_points = validated_data['eoi']['focal_points']
        del validated_data['eoi']['focal_points']
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

        ac = AssessmentCriteria(**self.initial_data.get("assessment_criterias"))
        ac.eoi = eoi
        ac.save()

        return {
            'eoi': eoi,
            'assessment_criterias': ac,
        }


class ProjectUpdateSerializer(serializers.ModelSerializer):

    specializations = SimpleSpecializationSerializer(many=True)
    invited_partners = PartnerSerializer(many=True)
    locations = PointSerializer(many=True)
    assessments_criteria = AssessmentCriteriaSerializer()

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

            'display_type',
            'status',
            'title',
            'country_code',
            'agency',
            'created_by',
            'focal_points',
            'agency_office',
            'cn_template',
            'description',
            'goal',
            'other_information',
            'has_weighting',
            'reviewers',
            'selected_source',
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
            'cn',
        )


class ReviewersApplicationSerializer(serializers.ModelSerializer):

    assessment = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'last_name',
            'assessment',
        )

    def get_assessment(self, obj):
        application_id = self.context['request'].parser_context['kwargs']['application_id']
        assessment = Assessment.objects.filter(application=application_id, reviewer=obj)
        if assessment.exists():
            return {
                'exists': True,
                'total_score': assessment.get().total_score
            }
        else:
            return {'exists': False, 'total_score': 0}


class ReviewerAssessmentsSerializer(serializers.ModelSerializer):

    total_score = serializers.IntegerField(read_only=True)

    class Meta:
        model = Assessment
        fields = (
            'id',
            'criteria',
            'reviewer',
            'application',
            'scores',
            'total_score',
            'date_reviewed',
            'note',
        )

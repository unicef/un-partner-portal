# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import transaction
from rest_framework import serializers
from account.models import User
from agency.serializers import AgencySerializer
from common.consts import APPLICATION_STATUSES, EOI_TYPES
from common.utils import get_countries_code_from_locations
from common.serializers import SimpleSpecializationSerializer, PointSerializer, CountryPointSerializer
from common.models import Point, AdminLevel1
from partner.serializers import PartnerSerializer

from partner.models import Partner, PartnerMember
from .models import EOI, Application, Assessment


class BaseProjectSerializer(serializers.ModelSerializer):

    specializations = SimpleSpecializationSerializer(many=True)
    agency = AgencySerializer()
    created = serializers.SerializerMethodField()
    country_code = serializers.SerializerMethodField()

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

    def get_country_code(self, obj):
        return get_countries_code_from_locations(obj.locations)


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
        exclude = ("cn", "eoi", "agency", "submitter")


class CreateDirectApplicationNoCNSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        exclude = ("cn", )


class ApplicationFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        fields = '__all__'


class CreateUnsolicitedProjectSerializer(serializers.Serializer):

    id = serializers.CharField(source="pk", read_only=True)
    locations = serializers.ListField(source="eoi.locations")
    title = serializers.CharField(source="eoi.title")
    agency = serializers.CharField()
    specializations = serializers.ListField(source="eoi.specializations")
    cn = serializers.FileField()

    @transaction.atomic
    def create(self, validated_data):
        # TODO: Will need to get the current partner from the header (since it can be switched as HQ user)
        partner = PartnerMember.objects.get(user=self.context['request'].user).partner
        app = Application.objects.create(
            is_unsolicited=True,
            partner=partner,
            eoi=None,
            agency_id=validated_data['agency'],
            submitter=self.context['request'].user,
            status=APPLICATION_STATUSES.pending,
            proposal_of_eoi_details=validated_data['eoi'],
            cn=validated_data['cn'],
        )
        return app


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

        validated_data['eoi']['display_type'] = EOI_TYPES.direct
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
                agency=eoi.agency,
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


class CreateProjectSerializer(CreateEOISerializer):

    class Meta:
        model = EOI
        exclude = ('cn_template', 'created_by')

    @transaction.atomic
    def create(self, validated_data):
        locations = validated_data['locations']
        del validated_data['locations']
        specializations = validated_data['specializations']
        del validated_data['specializations']
        focal_points = validated_data['focal_points']
        del validated_data['focal_points']

        validated_data['cn_template'] = validated_data['agency'].profile.eoi_template
        validated_data['created_by'] = self.context['request'].user
        self.instance = EOI.objects.create(**validated_data)

        for location in locations:
            location['admin_level_1'], created = AdminLevel1.objects.get_or_create(**location['admin_level_1'])
            point, created = Point.objects.get_or_create(**location)
            self.instance.locations.add(point)

        for specialization in specializations:
            self.instance.specializations.add(specialization)

        for focal_point in focal_points:
            self.instance.focal_points.add(focal_point)

        return self.instance


class ProjectUpdateSerializer(serializers.ModelSerializer):

    specializations = SimpleSpecializationSerializer(many=True)
    invited_partners = PartnerSerializer(many=True)
    locations = PointSerializer(many=True)

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
        return ReviewerAssessmentsSerializer(assessment, many=True).data


class ReviewerAssessmentsSerializer(serializers.ModelSerializer):
    created_by = serializers.IntegerField(source="created_by_id", required=False)
    modified_by = serializers.IntegerField(source="modified_by_id", required=False)
    total_score = serializers.IntegerField(read_only=True)

    class Meta:
        model = Assessment
        fields = (
            'id',
            'reviewer',
            'created_by',
            'modified_by',
            'application',
            'scores',
            'total_score',
            'date_reviewed',
            'note',
        )


class ApplicationPartnerOpenSerializer(serializers.ModelSerializer):

    project_title = serializers.CharField(source="eoi.title")
    eoi_id = serializers.CharField(source="eoi.id")
    agency_name = serializers.CharField(source="agency.name")
    country = serializers.SerializerMethodField()
    specializations = SimpleSpecializationSerializer(source='eoi.specializations', many=True)
    application_date = serializers.CharField(source="created")

    class Meta:
        model = Application
        fields = (
            'id',
            'project_title',
            'eoi_id',
            'agency_name',
            'country',
            'specializations',
            'application_date',
            'status',
        )

    def get_country(self, obj):
        return get_countries_code_from_locations(obj.locations)


class ApplicationPartnerUnsolicitedDirectSerializer(serializers.ModelSerializer):

    project_title = serializers.SerializerMethodField()
    agency_name = serializers.CharField(source="agency.name")
    country = serializers.SerializerMethodField()
    specializations = serializers.SerializerMethodField()
    submission_date = serializers.CharField(source="created")
    is_direct = serializers.BooleanField(source="eoi.is_direct")
    partner_name = serializers.CharField(source="partner.legal_name")
    has_yellow_flag = serializers.CharField(source="partner.has_yellow_flag")
    has_red_flag = serializers.CharField(source="partner.has_red_flag")

    class Meta:
        model = Application
        fields = (
            'id',
            'project_title',
            'eoi_id',
            'agency_name',
            'country',
            'specializations',
            'submission_date',
            'status',
            'is_direct',
            'partner_name',
            'partner_is_verified',
            'has_yellow_flag',
            'has_red_flag,'
        )

    def get_project_title(self, obj):
        if obj.eoi:
            # has been updated to direct selected
            return obj.eoi.title
        return obj.proposal_of_eoi_details.get('title')

    def get_country(self, obj):
        if obj.eoi:
            # has been updated to direct selected
            country = obj.eoi.locations
        else:
            country = obj.locations_proposal_of_eoi
        if country:
            # we expecting here few countries
            return get_countries_code_from_locations(obj.locations)
        return None

    def get_specializations(self, obj):
        if obj.eoi:
            # has been updated to direct selected
            return obj.eoi.specializations.all().values_list('id', flat=True)
        return obj.proposal_of_eoi_details.get('specializations')

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import datetime

from django.db import transaction

from rest_framework import serializers

from account.models import User
from account.serializers import AgencyUserSerializer
from agency.serializers import AgencySerializer
from common.consts import APPLICATION_STATUSES, EOI_TYPES, EOI_STATUSES
from common.utils import get_countries_code_from_queryset, get_partners_name_from_queryset
from common.serializers import SimpleSpecializationSerializer, PointSerializer
from common.models import Point, AdminLevel1
from partner.serializers import PartnerSerializer

from partner.models import Partner, PartnerMember
from .models import EOI, Application, Assessment, ApplicationFeedback


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
            'completed_date',
        )

    def get_created(self, obj):
        return obj.created.date()

    def get_country_code(self, obj):
        return get_countries_code_from_queryset(obj.locations)


class ApplicationsPartnerStatusSerializer(serializers.ModelSerializer):

    legal_name = serializers.CharField(source="partner.legal_name")

    class Meta:
        model = Application
        fields = (
            'legal_name',
            'offer_status',
        )


class DirectProjectSerializer(BaseProjectSerializer):

    invited_partners = serializers.SerializerMethodField()
    partner_offer_status = serializers.SerializerMethodField()

    class Meta:
        model = EOI
        fields = (
            'id',
            'title',
            'created',
            'country_code',
            'specializations',
            'agency',
            'invited_partners',
            'start_date',
            'end_date',
            'deadline_date',
            'status',
            'selected_source',
            'partner_offer_status',
        )

    def get_invited_partners(self, obj):
        return get_partners_name_from_queryset(obj.invited_partners)

    def get_partner_offer_status(self, obj):
        queryset = Application.objects.filter(eoi=obj)
        return ApplicationsPartnerStatusSerializer(queryset, many=True).data


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
            point, created = Point.objects.get_or_create(**location)
            self.instance.locations.add(point)

        for specialization in specializations:
            self.instance.specializations.add(specialization)

        for focal_point in focal_points:
            self.instance.focal_points.add(focal_point)

        return self.instance


class ProjectUpdateSerializer(serializers.ModelSerializer):

    specializations = SimpleSpecializationSerializer(many=True)
    locations = PointSerializer(many=True)

    class Meta:
        model = EOI
        fields = (
            'id',
            'specializations',
            'invited_partners',
            'locations',
            'assessments_criteria',
            'created',
            'start_date',
            'end_date',
            'deadline_date',
            'notif_results_date',
            'justification',
            'completed_reason',
            'completed_date',
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
        read_only_fields = ('created', 'completed_date',)

    def update(self, instance, validated_data):
        if 'invited_partners' in validated_data:
            del validated_data['invited_partners']
            # user can add and remove on update - here we remove partners that are not in list
            for partner in instance.invited_partners.all():
                if partner.id not in self.initial_data.get('invited_partners', []):
                    instance.invited_partners.remove(partner)

        instance = super(ProjectUpdateSerializer, self).update(instance, validated_data)
        for invited_partner in self.initial_data.get('invited_partners', []):
            instance.invited_partners.add(Partner.objects.get(id=invited_partner))

        if instance.status == EOI_STATUSES.completed:
            instance.completed_date = datetime.datetime.now()

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
    specializations = serializers.SerializerMethodField()
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
        return get_countries_code_from_queryset(obj.eoi.locations)

    def get_specializations(self, obj):
        return obj.eoi.specializations.all().values_list('id', flat=True)


class ApplicationPartnerUnsolicitedDirectSerializer(serializers.ModelSerializer):

    project_title = serializers.SerializerMethodField()
    agency_name = serializers.CharField(source="agency.name")
    country = serializers.SerializerMethodField()
    specializations = serializers.SerializerMethodField()
    submission_date = serializers.CharField(source="created")
    is_direct = serializers.BooleanField(source="eoi.is_direct")
    partner_name = serializers.CharField(source="partner.legal_name")
    selected_source = serializers.CharField(source="eoi.selected_source")


    class Meta:
        model = Application
        fields = (
            'id',
            'project_title',
            'selected_source',
            'eoi_id',
            'agency_name',
            'country',
            'specializations',
            'submission_date',
            'status',
            'is_direct',
            'partner_name',
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
            return get_countries_code_from_queryset(country)
        return None

    def get_specializations(self, obj):
        if obj.eoi:
            # has been updated to direct selected
            return obj.eoi.specializations.all().values_list('id', flat=True)
        return obj.proposal_of_eoi_details.get('specializations')


class AgencyUnsolicitedApplicationSerializer(ApplicationPartnerUnsolicitedDirectSerializer):

    has_yellow_flag = serializers.BooleanField(source="partner.has_yellow_flag")
    has_red_flag = serializers.BooleanField(source="partner.has_red_flag")

    class Meta:
        model = Application
        fields = ApplicationPartnerUnsolicitedDirectSerializer.Meta.fields + ('has_red_flag',
                                                                              'has_yellow_flag',
                                                                              'partner_is_verified',)

class ApplicationFeedbackSerializer(serializers.ModelSerializer):
    provider = AgencyUserSerializer(read_only=True)

    class Meta:
        model = ApplicationFeedback
        fields = ('id', 'feedback', 'provider', 'created')

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import datetime

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import serializers

from account.models import User
from account.serializers import AgencyUserSerializer, IDUserSerializer, UserSerializer
from agency.serializers import AgencySerializer
from common.consts import APPLICATION_STATUSES, EOI_TYPES, EOI_STATUSES, DIRECT_SELECTION_SOURCE
from common.utils import get_countries_code_from_queryset, get_partners_name_from_queryset
from common.serializers import SimpleSpecializationSerializer, PointSerializer, CommonFileSerializer
from common.models import Point, Specialization
from partner.serializers import PartnerSerializer
from partner.models import Partner
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
        read_only_fields = ('submitter', 'eoi', 'agency',)


class ApplicationPartnerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        fields = ('id', 'cn', 'created')


class ProposalEOIDetailsSerializer(serializers.Serializer):
    specializations = serializers.SerializerMethodField()
    title = serializers.CharField()

    def get_specializations(self, obj):
        return SimpleSpecializationSerializer(Specialization.objects.filter(id__in=obj.get('specializations')),
                                              many=True).data


# TODO - break this up into different serializers for different purposes
class ApplicationFullSerializer(serializers.ModelSerializer):

    cn = CommonFileSerializer()
    partner = PartnerSerializer(read_only=True)
    agency = AgencySerializer(read_only=True)
    proposal_of_eoi_details = ProposalEOIDetailsSerializer(read_only=True)
    locations_proposal_of_eoi = PointSerializer(many=True, read_only=True)
    submitter = UserSerializer(read_only=True)
    is_direct = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('eoi',)

    def get_is_direct(self, obj):
        return obj.eoi_converted is not None


class CreateUnsolicitedProjectSerializer(serializers.Serializer):

    id = serializers.CharField(source="pk", read_only=True)
    locations = serializers.ListField(source="eoi.locations")
    title = serializers.CharField(source="eoi.title")
    agency = serializers.CharField()
    specializations = serializers.ListField(source="eoi.specializations")
    cn = CommonFileSerializer()

    @transaction.atomic
    def create(self, validated_data):
        partner = self.context['request'].active_partner
        app = Application.objects.create(
            is_unsolicited=True,
            partner_id=partner.id,
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


class PartnerProjectSerializer(serializers.ModelSerializer):

    agency = serializers.CharField(source='agency.name')
    specializations = SimpleSpecializationSerializer(many=True)
    locations = PointSerializer(many=True)
    is_pinned = serializers.SerializerMethodField()
    application = serializers.SerializerMethodField()

    # TODO - cut down on some of these fields. partners should not get back this data
    # Frontend currently breaks if doesn't receive all
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
            'is_pinned',
            'application',
        )
        read_only_fields = fields

    def get_is_pinned(self, obj):
        return obj.pins.filter(partner=self.context['request'].active_partner.id).exists()

    def get_application(self, obj):
        qs = obj.applications.filter(partner=self.context['request'].active_partner.id)
        if qs.exists():
            return ApplicationPartnerSerializer(qs.get()).data
        return None


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
    cn = CommonFileSerializer()
    your_score = serializers.SerializerMethodField()
    review_progress = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = (
            'id',
            'legal_name',
            'type_org',
            'status',
            'cn',
            'average_total_score',
            'your_score',
            'review_progress',
        )

    def get_your_score(self, obj):
        assess_qs = obj.assessments.filter(reviewer=self.context['request'].user)
        if assess_qs.exists():
            assessment = assess_qs.first()
            return assessment.total_score
        return None

    def get_review_progress(self, obj):
        return "{}/{}".format(obj.assessments.count(), obj.eoi.reviewers.count())


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
    is_direct = serializers.SerializerMethodField()
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

    # TODO - need to make field names between here and application details the same
    # application details uses nested under proposal_of_eoi_details
    def get_specializations(self, obj):
        return SimpleSpecializationSerializer(Specialization.objects.filter(id__in=obj.proposal_of_eoi_details.get('specializations')),
                                              many=True).data

    def get_is_direct(self, obj):
        return obj.eoi_converted is not None


class AgencyUnsolicitedApplicationSerializer(ApplicationPartnerUnsolicitedDirectSerializer):

    has_yellow_flag = serializers.BooleanField(source="partner.has_yellow_flag")
    has_red_flag = serializers.BooleanField(source="partner.has_red_flag")
    is_ds_converted = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = ApplicationPartnerUnsolicitedDirectSerializer.Meta.fields + ('has_red_flag',
                                                                              'has_yellow_flag',
                                                                              'partner_is_verified',
                                                                              'is_ds_converted')

    def get_is_ds_converted(self, obj):
        return obj.eoi_converted is not None


class ApplicationFeedbackSerializer(serializers.ModelSerializer):
    provider = AgencyUserSerializer(read_only=True)

    class Meta:
        model = ApplicationFeedback
        fields = ('id', 'feedback', 'provider', 'created')


class ConvertUnsolicitedSerializer(serializers.Serializer):
    RESTRICTION_MSG = 'Unsolicited concept note already converted to a direct selection project.'

    ds_justification_select = serializers.ListField()
    justification = serializers.CharField(source="eoi.justification")
    focal_points = IDUserSerializer(many=True, source="eoi.focal_points")
    description = serializers.CharField(source="eoi.description")
    other_information = serializers.CharField(source="eoi.other_information")
    start_date = serializers.DateField(source="eoi.start_date")
    end_date = serializers.DateField(source="eoi.end_date")

    class Meta:
        model = Application

    def validate(self, data):
        id = self.context['request'].parser_context.get('kwargs', {}).get('pk')
        if Application.objects.get(id=id).eoi_converted is not None:
            raise serializers.ValidationError(self.RESTRICTION_MSG)
        return super(ConvertUnsolicitedSerializer, self).validate(data)

    @transaction.atomic
    def create(self, validated_data):
        ds_justification_select = validated_data.pop('ds_justification_select')
        focal_points = self.initial_data.get('focal_points', [])
        del validated_data['eoi']['focal_points']
        submitter = self.context['request'].user
        app_id = self.context['request'].parser_context['kwargs']['pk']
        app = get_object_or_404(
            Application,
            id=app_id,
            is_unsolicited=True,
            eoi_converted__isnull=True
        )

        eoi = EOI(**validated_data['eoi'])
        eoi.created_by = submitter
        eoi.display_type = EOI_TYPES.direct
        eoi.status = EOI_STATUSES.open
        eoi.title = app.proposal_of_eoi_details.get('title')
        eoi.agency = app.agency
        # we can use get direct because agent have one agency office
        eoi.agency_office = submitter.agency_members.get().office
        eoi.selected_source = DIRECT_SELECTION_SOURCE.cso

        eoi.save()
        for focal_point in focal_points:
            eoi.focal_points.add(focal_point['id'])
        for specialization in app.proposal_of_eoi_details.get('specializations', []):
            eoi.specializations.add(specialization)
        for location in app.locations_proposal_of_eoi.all():
            eoi.locations.add(location)

        app.ds_justification_select = ds_justification_select
        app.eoi_converted = eoi
        app.save()

        ds_app = Application.objects.create(
            partner=app.partner,
            eoi=eoi,
            agency=eoi.agency,
            submitter=app.submitter,
            status=APPLICATION_STATUSES.pending,
            did_win=True,
            did_accept=False,
            ds_justification_select=ds_justification_select,
            justification_reason=app.justification_reason
        )

        return ds_app


class ReviewSummarySerializer(serializers.ModelSerializer):

    review_summary_attachment = CommonFileSerializer()

    class Meta:
        model = EOI
        fields = (
            'review_summary_comment', 'review_summary_attachment'
        )


class EOIReviewersAssessmentsSerializer(serializers.ModelSerializer):
    __apps_count = None
    user_id = serializers.CharField(source='id')
    user_name = serializers.CharField(source='get_user_name')
    assessments = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'user_id',
            'user_name',
            'assessments',
        )

    def get_assessments(self, obj):
        lookup_field = self.context['view'].lookup_field
        eoi_id = self.context['request'].parser_context['kwargs'][lookup_field]
        if self.__apps_count is None:
            eoi = get_object_or_404(EOI, id=eoi_id)
            self.__apps_count = eoi.applications.filter(status=APPLICATION_STATUSES.preselected).count()

        obj.assessments.filter()
        asses_count = Assessment.objects.filter(reviewer=obj, application__eoi_id=eoi_id).count()

        return {
            'counts': "{}/{}".format(asses_count, self.__apps_count),
            'send_reminder': not (self.__apps_count == asses_count),
            'eoi_id': eoi_id,  # use full for front-end to easier construct send reminder url
        }


class AwardedPartnersSerializer(serializers.ModelSerializer):

    partner_id = serializers.CharField(source='partner.id')
    partner_name = serializers.CharField(source='partner.legal_name')

    partner_notified = serializers.SerializerMethodField()
    partner_accepted_date = serializers.SerializerMethodField()

    body = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = (
            'partner_id',
            'partner_name',
            'partner_notified',
            'partner_accepted_date',
            'body',
        )

    def get_body(self, obj):
        assessments_count = obj.assessments.count()
        assessments = obj.assessments.all()
        notes = []
        for assessment in assessments:
            notes.append({
                'note': assessment.note,
                'reviewer': assessment.reviewer.get_user_name(),
            })


        return {
            'criteria': obj.get_scores_by_selection_criteria(),
            'notes': notes,
            'avg_total_score': obj.average_total_score,
            'assessment_count': assessments_count,

        }

    def get_partner_notified(self, obj):
        return obj.accept_notification and obj.accept_notification.created

    def get_partner_accepted_date(self, obj):
        return obj.did_accept_date and obj.did_accept_date

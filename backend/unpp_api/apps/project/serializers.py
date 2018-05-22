# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from datetime import datetime

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueTogetherValidator

from account.models import User
from account.serializers import IDUserSerializer, UserSerializer
from agency.serializers import AgencySerializer, AgencyUserSerializer
from common.consts import APPLICATION_STATUSES, CFEI_TYPES, CFEI_STATUSES, DIRECT_SELECTION_SOURCE
from common.utils import get_countries_code_from_queryset, get_partners_name_from_queryset
from common.serializers import (
    SimpleSpecializationSerializer,
    PointSerializer,
    CommonFileSerializer,
    MixinPreventManyCommonFile,
)
from common.models import Point, Specialization
from notification.consts import NotificationType
from notification.helpers import user_received_notification_recently, send_notification_application_created, \
    send_notification_to_cfei_focal_points
from partner.serializers import PartnerSerializer, PartnerAdditionalSerializer, PartnerShortSerializer
from partner.models import Partner
from project.models import EOI, Application, Assessment, ApplicationFeedback


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
    partner_additional = PartnerAdditionalSerializer(source="partner", read_only=True)

    class Meta:
        model = Application
        fields = (
            'legal_name',
            'partner_additional',
            'application_status',
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

    def validate_partner(self, partner):
        if not partner.is_verified:
            raise ValidationError('Only verified partners are eligible for Direct Selections.')
        if partner.is_hq:
            raise ValidationError('HQs of International partners are not eligible for Direct Selections.')
        return partner


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
class ApplicationFullSerializer(MixinPreventManyCommonFile, serializers.ModelSerializer):

    cn = CommonFileSerializer()
    partner = PartnerSerializer(read_only=True)
    agency = AgencySerializer(read_only=True)
    proposal_of_eoi_details = ProposalEOIDetailsSerializer(read_only=True)
    locations_proposal_of_eoi = PointSerializer(many=True, read_only=True)
    submitter = UserSerializer(read_only=True)
    is_direct = serializers.SerializerMethodField()
    cfei_type = serializers.CharField(read_only=True)
    application_status = serializers.CharField(read_only=True)
    assessments_is_completed = serializers.NullBooleanField(read_only=True)

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('eoi',)
        validators = [
            UniqueTogetherValidator(
                queryset=Application.objects.all(),
                fields=('eoi', 'partner')
            )
        ]

    prevent_keys = ["cn"]

    def get_is_direct(self, obj):
        return obj.eoi_converted is not None

    def validate(self, data):

        self.prevent_many_common_file_validator(data)

        if self.context['request'].method in ['PATCH', 'PUT']:
            kwargs = self.context['request'].parser_context.get('kwargs', {})
            application_id = kwargs.get(self.context['view'].lookup_field)
            app = get_object_or_404(Application.objects.select_related('eoi'), pk=application_id)

            allowed_to_modify_status = \
                list(app.eoi.focal_points.values_list('id', flat=True)) + [app.eoi.created_by_id]
            if data.get("status") and self.context['request'].user.id not in allowed_to_modify_status:
                raise serializers.ValidationError(
                    "Only Focal Point/Creator is allowed to pre-select/reject an application.")

            if data.get("status") == APPLICATION_STATUSES.rejected and \
                    Assessment.objects.filter(application=app).exists():
                raise serializers.ValidationError("Since assessment has begun, application can't be rejected.")

            if app.eoi.is_completed:
                raise serializers.ValidationError("Since CFEI is completed, modification is forbidden.")

            if data.get("did_win") and not app.partner.is_verified:
                raise serializers.ValidationError(
                    "You cannot award an application if the profile has not been verified yet.")
            if data.get("did_win") and app.partner.has_red_flag:
                raise serializers.ValidationError(
                    "You cannot award an application if the profile has red flag.")
            if data.get("did_win") and not app.assessments_is_completed:
                raise serializers.ValidationError(
                    "You cannot award an application if all assessments have not been added for the application."
                )

        return super(ApplicationFullSerializer, self).validate(data)


class ApplicationFullEOISerializer(ApplicationFullSerializer):
    eoi = BaseProjectSerializer(read_only=True)
    eoi_applications_count = serializers.SerializerMethodField(allow_null=True, read_only=True)

    def get_eoi_applications_count(self, application):
        return application.eoi and application.eoi.applications.count()


class CreateUnsolicitedProjectSerializer(MixinPreventManyCommonFile, serializers.Serializer):

    id = serializers.CharField(source="pk", read_only=True)
    locations = PointSerializer(many=True, source='locations_proposal_of_eoi')
    title = serializers.CharField(source='proposal_of_eoi_details.title')
    agency = serializers.CharField(source='agency.id')
    specializations = serializers.ListField(source='proposal_of_eoi_details.specializations')
    cn = CommonFileSerializer()

    prevent_keys = ["cn"]

    @transaction.atomic
    def create(self, validated_data):

        self.prevent_many_common_file_validator(validated_data)

        partner = self.context['request'].active_partner
        locations = validated_data.pop('locations_proposal_of_eoi', [])
        agency = validated_data.pop('agency')

        app = Application.objects.create(
            is_unsolicited=True,
            partner_id=partner.id,
            eoi=None,
            agency_id=agency['id'],
            submitter=self.context['request'].user,
            status=APPLICATION_STATUSES.pending,
            proposal_of_eoi_details=validated_data['proposal_of_eoi_details'],
            cn=validated_data['cn'],
        )

        for location in locations:
            point = Point.objects.get_point(**location)
            app.locations_proposal_of_eoi.add(point)

        return app


class CreateDirectProjectSerializer(serializers.Serializer):

    eoi = CreateDirectEOISerializer()
    applications = CreateDirectApplicationSerializer(many=True)

    @transaction.atomic
    def create(self, validated_data):
        locations = validated_data['eoi'].pop('locations')
        specializations = validated_data['eoi'].pop('specializations')
        focal_points = validated_data['eoi'].pop('focal_points')

        validated_data['eoi']['display_type'] = CFEI_TYPES.direct
        eoi = EOI.objects.create(**validated_data['eoi'])
        for location in locations:
            point = Point.objects.get_point(**location)
            eoi.locations.add(point)

        for specialization in specializations:
            eoi.specializations.add(specialization)

        for focal_point in focal_points:
            eoi.focal_points.add(focal_point)

        applications = []
        for application in validated_data['applications']:
            _application = Application.objects.create(
                partner=application['partner'],
                eoi=eoi,
                agency=eoi.agency,
                submitter=validated_data['eoi']['created_by'],
                status=APPLICATION_STATUSES.pending,
                did_win=True,
                did_accept=False,
                ds_justification_select=application['ds_justification_select'],
                justification_reason=application['justification_reason'],
            )
            applications.append(_application)
            send_notification_application_created(_application)

        send_notification_to_cfei_focal_points(eoi)
        return {
            "eoi": eoi,
            "applications": applications,
        }


class CreateProjectSerializer(CreateEOISerializer):

    class Meta:
        model = EOI
        exclude = ('cn_template', 'created_by')

    @transaction.atomic
    def create(self, validated_data):
        locations = validated_data.pop('locations')
        specializations = validated_data.pop('specializations')
        focal_points = validated_data.pop('focal_points')

        validated_data['cn_template'] = validated_data['agency'].profile.eoi_template
        validated_data['created_by'] = self.context['request'].user
        self.instance = EOI.objects.create(**validated_data)

        for location in locations:
            point = Point.objects.get_point(**location)
            self.instance.locations.add(point)

        for specialization in specializations:
            self.instance.specializations.add(specialization)

        for focal_point in focal_points:
            self.instance.focal_points.add(focal_point)
        send_notification_to_cfei_focal_points(self.instance)
        return self.instance


class SelectedPartnersSerializer(serializers.ModelSerializer):
    partner_id = serializers.CharField(source="partner.id")
    partner_name = serializers.CharField(source="partner.legal_name")

    class Meta:
        model = Application
        fields = (
            'id',
            'partner_id',
            'partner_name',
            'application_status',
        )


class PartnerProjectSerializer(serializers.ModelSerializer):

    agency = serializers.CharField(source='agency.name')
    specializations = SimpleSpecializationSerializer(many=True)
    locations = PointSerializer(many=True)
    is_pinned = serializers.SerializerMethodField()
    application = serializers.SerializerMethodField()
    focal_points_detail = UserSerializer(source='focal_points', read_only=True, many=True)
    reviewers_detail = UserSerializer(source='reviewers', read_only=True, many=True)

    # TODO - cut down on some of these fields. partners should not get back this data
    # Frontend currently breaks if doesn't receive all
    class Meta:
        model = EOI
        fields = (
            'id',
            'specializations',
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
            'is_completed',
            'display_type',
            'status',
            'title',
            'agency',
            'created_by',
            'focal_points',
            'focal_points_detail',
            'agency_office',
            'cn_template',
            'description',
            'goal',
            'other_information',
            'has_weighting',
            'reviewers',
            'reviewers_detail',
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


class AgencyProjectSerializer(serializers.ModelSerializer):

    specializations = SimpleSpecializationSerializer(many=True, read_only=True)
    locations = PointSerializer(many=True, read_only=True)
    direct_selected_partners = serializers.SerializerMethodField()
    focal_points_detail = UserSerializer(source='focal_points', read_only=True, many=True)
    reviewers_detail = UserSerializer(source='reviewers', read_only=True, many=True)
    invited_partners = PartnerShortSerializer(many=True, read_only=True)
    applications_count = serializers.SerializerMethodField(allow_null=True, read_only=True)

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
            'is_completed',
            'display_type',
            'status',
            'title',
            'agency',
            'created_by',
            'focal_points',
            'focal_points_detail',
            'agency_office',
            'cn_template',
            'description',
            'goal',
            'other_information',
            'has_weighting',
            'reviewers',
            'reviewers_detail',
            'selected_source',
            'direct_selected_partners',
            'created',
            'completed_date',
            'contains_partner_accepted',
            'applications_count',
            'is_published',
        )
        read_only_fields = ('created', 'completed_date', 'is_published')

    def get_direct_selected_partners(self, obj):
        if obj.is_direct:
            # this is used by agency
            return SelectedPartnersSerializer(obj.applications.all(), many=True).data

    def get_applications_count(self, eoi):
        return eoi.applications.count()

    def update(self, instance, validated_data):
        if instance.completed_reason is None and validated_data.get('completed_reason') is not None and \
                instance.completed_date is None and instance.is_completed is False:
            instance.completed_date = datetime.now()
            instance.is_completed = True

        instance = super(AgencyProjectSerializer, self).update(instance, validated_data)

        invited_partners = self.initial_data.get('invited_partners', [])
        if invited_partners:
            invited_partner_ids = [p['id'] for p in invited_partners]
            instance.invited_partners.through.objects.exclude(partner_id__in=invited_partner_ids).delete()
            instance.invited_partners.add(*Partner.objects.filter(id__in=invited_partner_ids))
        elif 'invited_partners' in self.initial_data:
            instance.invited_partners.clear()

        reviewers = self.initial_data.get('reviewers', [])
        if reviewers:
            Assessment.objects.filter(
                application__eoi=instance
            ).exclude(reviewer_id__in=reviewers).update(archived=True)
            instance.reviewers.through.objects.exclude(user_id__in=reviewers).delete()
            instance.reviewers.add(*User.objects.filter(id__in=reviewers))
            Assessment.all_objects.filter(application__eoi=instance, reviewer_id__in=reviewers).update(archived=False)
        elif 'reviewers' in self.initial_data:
            Assessment.objects.filter(application__eoi=instance).update(archived=True)
            instance.reviewers.clear()

        focal_points = self.initial_data.get('focal_points', [])
        if focal_points:
            instance.focal_points.through.objects.exclude(user_id__in=focal_points).delete()
            instance.focal_points.add(*User.objects.filter(id__in=focal_points))
            send_notification_to_cfei_focal_points(instance)
        elif 'focal_points' in self.initial_data:
            instance.focal_points.clear()

        return instance

    def validate(self, data):
        assessments_criteria = data.get('assessments_criteria', [])
        has_weighting = data.get('has_weighting', False)

        if has_weighting is True and all(map(lambda x: 'weight' in x, assessments_criteria)) is False:
            raise serializers.ValidationError(
                "Weight criteria must be provided since `has_weighting` is selected.")
        elif has_weighting is False and any(map(lambda x: 'weight' in x, assessments_criteria)) is True:
            raise serializers.ValidationError(
                "Weight criteria should not be provided since `has_weighting` is unselected.")

        if self.context['request'].method in ['PATCH', 'PUT']:
            allowed_to_modify = \
                list(self.instance.focal_points.values_list('id', flat=True)) + [self.instance.created_by_id]
            if self.context['request'].user.id in allowed_to_modify:
                pass
            else:
                if self.instance.status == CFEI_STATUSES.closed and \
                        not all(map(lambda x: True if x in ['reviewers', 'focal_points'] else False, data.keys())):
                    raise serializers.ValidationError(
                        "Since CFEI deadline is passed, You can modify only reviewer(s) and/or focal point(s).")
                elif self.instance.is_completed:
                    raise serializers.ValidationError(
                        "CFEI is completed. Modify is forbidden.")

                if self.context['request'].user.id not in allowed_to_modify:
                    raise serializers.ValidationError(
                        "Only Focal Point/Creator is allowed to modify a CFEI.")

        return super(AgencyProjectSerializer, self).validate(data)


class ApplicationsListSerializer(serializers.ModelSerializer):

    legal_name = serializers.CharField(source="partner.legal_name")
    partner_additional = PartnerAdditionalSerializer(source="partner", read_only=True)
    type_org = serializers.CharField(source="partner.display_type")
    cn = CommonFileSerializer()
    your_score = serializers.SerializerMethodField()
    your_score_breakdown = serializers.SerializerMethodField()
    review_progress = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = (
            'id',
            'legal_name',
            'partner_additional',
            'type_org',
            'status',
            'cn',
            'average_total_score',
            'your_score',
            'your_score_breakdown',
            'review_progress',
            'application_status',
        )

    def _get_my_assessment(self, obj):
        assess_qs = obj.assessments.filter(reviewer=self.context['request'].user)
        if assess_qs.exists():
            return assess_qs.first()
        return None

    def get_your_score(self, obj):
        my_assessment = self._get_my_assessment(obj)
        return my_assessment.total_score if my_assessment else None

    def get_your_score_breakdown(self, obj):
        my_assessment = self._get_my_assessment(obj)
        return my_assessment.get_scores_as_dict() if my_assessment else None

    def get_review_progress(self, obj):
        review_count = obj.assessments.count()
        reviewers_count = obj.eoi.reviewers.count()

        return '{}/{}'.format(review_count, reviewers_count)


class ReviewersApplicationSerializer(serializers.ModelSerializer):

    assessment = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'fullname',
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

    def validate(self, data):
        kwargs = self.context['request'].parser_context.get('kwargs', {})
        application_id = kwargs.get(self.context['view'].lookup_url_kwarg)
        app = get_object_or_404(Application.objects.select_related('eoi'), pk=application_id)
        if app.eoi.status != CFEI_STATUSES.closed:
            raise serializers.ValidationError("Assessment allowed once deadline is passed.")
        scores = data.get('scores')
        application = self.instance and self.instance.application or data.get('application')
        assessments_criteria = application.eoi.assessments_criteria

        if scores and not set(map(lambda x: x['selection_criteria'], scores)).__eq__(
                set(map(lambda x: x['selection_criteria'], assessments_criteria))):
            raise serializers.ValidationError(
                "You can score only selection criteria defined in CFEI.")

        if scores and application.eoi.has_weighting:
            for score in scores:
                key = score.get('selection_criteria')
                val = score.get('score')
                criterion = list(filter(lambda x: x.get('selection_criteria') == key, assessments_criteria))
                if len(criterion) == 1 and val > criterion[0].get('weight'):
                    raise serializers.ValidationError(
                        "The maximum score is equal to the value entered for the weight.")
                elif len(criterion) != 1:
                    raise serializers.ValidationError(
                        "Selection criterion '{}' defined improper.".format(key))

        return super(ReviewerAssessmentsSerializer, self).validate(data)


class ApplicationPartnerOpenSerializer(serializers.ModelSerializer):

    project_title = serializers.CharField(source="eoi.title")
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
            'application_status',
        )

    def get_country(self, obj):
        return get_countries_code_from_queryset(obj.eoi.locations)

    def get_specializations(self, obj):
        return SimpleSpecializationSerializer(obj.eoi.specializations.all(), many=True).data


class ApplicationPartnerUnsolicitedDirectSerializer(serializers.ModelSerializer):

    project_title = serializers.SerializerMethodField()
    agency_name = serializers.CharField(source="agency.name")
    country = serializers.SerializerMethodField()
    specializations = serializers.SerializerMethodField()
    submission_date = serializers.CharField(source="created")
    is_direct = serializers.SerializerMethodField()
    partner_name = serializers.CharField(source="partner.legal_name")
    partner_additional = PartnerAdditionalSerializer(source="partner", read_only=True)
    selected_source = serializers.CharField(source="eoi.selected_source", allow_null=True)

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
            'partner_additional',
            'application_status',
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
        return SimpleSpecializationSerializer(
            Specialization.objects.filter(id__in=obj.proposal_of_eoi_details.get('specializations')), many=True).data

    def get_is_direct(self, obj):
        return obj.eoi_converted is not None


class ApplicationPartnerDirectSerializer(ApplicationPartnerUnsolicitedDirectSerializer):

    project_title = serializers.CharField(source="eoi.title")
    specializations = serializers.SerializerMethodField()

    def get_specializations(self, obj):
        return SimpleSpecializationSerializer(obj.eoi.specializations.all(), many=True).data


class AgencyUnsolicitedApplicationSerializer(ApplicationPartnerUnsolicitedDirectSerializer):

    has_yellow_flag = serializers.BooleanField(source="partner.has_yellow_flag")
    has_red_flag = serializers.BooleanField(source="partner.has_red_flag")
    is_ds_converted = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = ApplicationPartnerUnsolicitedDirectSerializer.Meta.fields + (
            'has_red_flag',
            'has_yellow_flag',
            'partner_is_verified',
            'is_ds_converted',
        )

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
    focal_points = IDUserSerializer(many=True, source="eoi.focal_points", read_only=True)
    description = serializers.CharField(source="eoi.description")
    other_information = serializers.CharField(
        source="eoi.other_information", required=False, allow_blank=True, allow_null=True)
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
        eoi.display_type = CFEI_TYPES.direct
        eoi.title = app.proposal_of_eoi_details.get('title')
        eoi.agency = app.agency
        # we can use get direct because agent have one agency office
        eoi.agency_office = submitter.agency_members.get().office
        eoi.selected_source = DIRECT_SELECTION_SOURCE.ucn
        eoi.is_published = True

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

        send_notification_to_cfei_focal_points(eoi)

        return ds_app


class ReviewSummarySerializer(MixinPreventManyCommonFile, serializers.ModelSerializer):

    review_summary_attachment = CommonFileSerializer()

    class Meta:
        model = EOI
        fields = (
            'review_summary_comment', 'review_summary_attachment'
        )

    prevent_keys = ['review_summary_attachment']

    def update(self, instance, validated_data):

        self.prevent_many_common_file_validator(self.initial_data)

        return super(ReviewSummarySerializer, self).update(instance, validated_data)


class EOIReviewersAssessmentsSerializer(serializers.ModelSerializer):
    __apps_count = None
    user_id = serializers.CharField(source='id')
    user_name = serializers.CharField(source='get_fullname')
    assessments = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'user_id',
            'user_name',
            'assessments',
        )

    def get_assessments(self, user):
        lookup_field = self.context['view'].lookup_field
        eoi_id = self.context['request'].parser_context['kwargs'][lookup_field]
        eoi = get_object_or_404(EOI, id=eoi_id)
        if self.__apps_count is None:
            self.__apps_count = eoi.applications.filter(status=APPLICATION_STATUSES.preselected).count()

        assessments_count = Assessment.objects.filter(reviewer=user, application__eoi_id=eoi_id).count()
        reminder_sent_recently = user_received_notification_recently(user, eoi, NotificationType.CFEI_REVIEW_REQUIRED)

        return {
            'counts': "{}/{}".format(assessments_count, self.__apps_count),
            'send_reminder': not (self.__apps_count == assessments_count) and not reminder_sent_recently,
            'eoi_id': eoi_id,  # use full for front-end to easier construct send reminder url
        }


class AwardedPartnersSerializer(serializers.ModelSerializer):

    partner_id = serializers.CharField(source='partner.id')
    partner_name = serializers.CharField(source='partner.legal_name')
    partner_additional = PartnerAdditionalSerializer(source="partner", read_only=True)
    application_id = serializers.CharField(source='id')

    cn = CommonFileSerializer()
    partner_notified = serializers.SerializerMethodField()
    partner_decision_date = serializers.DateField(source='decision_date', allow_null=True, read_only=True)

    body = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = (
            'partner_id',
            'partner_name',
            'partner_additional',
            'application_id',
            'did_win',
            'did_withdraw',
            'withdraw_reason',
            'did_decline',
            'did_accept',
            'cn',
            'partner_notified',
            'partner_decision_date',
            'body',
        )

    def get_body(self, obj):
        assessments_count = obj.assessments.count()
        assessments = obj.assessments.all()
        notes = []
        for assessment in assessments:
            notes.append({
                'note': assessment.note,
                'reviewer': assessment.reviewer.get_fullname(),
            })

        return {
            'criteria': obj.get_scores_by_selection_criteria(),
            'notes': notes,
            'avg_total_score': obj.average_total_score,
            'assessment_count': assessments_count,
        }

    def get_partner_notified(self, obj):
        return obj.accept_notification and obj.accept_notification.created


class CompareSelectedSerializer(serializers.ModelSerializer):

    partner_id = serializers.IntegerField(source='partner.id')
    partner_name = serializers.CharField(source='partner.legal_name')
    partner_additional = PartnerAdditionalSerializer(source="partner", read_only=True)
    year_establishment = serializers.IntegerField(source='partner.profile.year_establishment')
    total_assessment_score = serializers.IntegerField(source='average_total_score')
    verification_status = serializers.BooleanField(source="partner.is_verified")
    flagging_status = serializers.JSONField(source="partner.flagging_status")
    annual_budget = serializers.SerializerMethodField()
    un_exp = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = (
            'partner_id',
            'partner_name',
            'partner_additional',
            'year_establishment',
            'eoi_id',
            'total_assessment_score',
            'verification_status',
            'flagging_status',
            'un_exp',
            'annual_budget',
            'verification_status',
            'flagging_status',
            'did_win',
            'did_withdraw',
            'assessments_is_completed',
        )

    def get_annual_budget(self, obj):
        return obj.partner.profile.annual_budget

    def get_un_exp(self, obj):
        return ", ".join(obj.partner.collaborations_partnership.all().values_list('agency__name', flat=True))


class SubmittedCNSerializer(serializers.ModelSerializer):
    cn_id = serializers.IntegerField(source='id')
    agency_name = serializers.CharField(source="agency.name")
    specializations = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = (
            'cn_id',
            'project_title',
            'cfei_type',
            'agency_name',
            'countries',
            'specializations',
            'application_status',
            'eoi_id'
        )

    def get_specializations(self, obj):
        if obj.is_unsolicited:
            query = Specialization.objects.filter(id__in=obj.proposal_of_eoi_details.get('specializations'))
        else:
            query = obj.eoi.specializations.all()
        return SimpleSpecializationSerializer(query, many=True).data


class PendingOffersSerializer(SubmittedCNSerializer):
    class Meta:
        model = Application
        fields = (
            'cn_id',
            'project_title',
            'cfei_type',
            'agency_name',
            'countries',
            'specializations',
            'eoi_id'
        )

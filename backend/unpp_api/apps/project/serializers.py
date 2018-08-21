# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from collections import defaultdict
from datetime import datetime, date

from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.fields import CurrentUserDefault
from rest_framework.validators import UniqueTogetherValidator

from account.models import User
from account.serializers import IDUserSerializer, BasicUserSerializer
from agency.agencies import UNHCR

from agency.serializers import AgencySerializer, AgencyUserListSerializer
from common.consts import (
    APPLICATION_STATUSES,
    CFEI_TYPES,
    CFEI_STATUSES,
    DIRECT_SELECTION_SOURCE,
    COMPLETED_REASON,
    ALL_COMPLETED_REASONS,
    OTHER_AGENCIES_DSR_COMPLETED_REASONS,
    UNHCR_DSR_COMPLETED_REASONS,
)
from common.utils import get_countries_code_from_queryset
from common.serializers import (
    SimpleSpecializationSerializer,
    PointSerializer,
    CommonFileSerializer,
    MixinPreventManyCommonFile,
)
from common.models import Point, Specialization
from notification.consts import NotificationType
from notification.helpers import user_received_notification_recently, send_notification_to_cfei_focal_points
from partner.serializers import PartnerSerializer, PartnerAdditionalSerializer, PartnerShortSerializer
from partner.models import Partner
from project.identifiers import get_eoi_display_identifier
from project.models import EOI, Application, Assessment, ApplicationFeedback, EOIAttachment
from project.utilities import update_cfei_focal_points, update_cfei_reviewers


class EOIAttachmentSerializer(serializers.ModelSerializer):
    created_by = serializers.HiddenField(default=serializers.CreateOnlyDefault(CurrentUserDefault()))
    file = CommonFileSerializer()

    class Meta:
        model = EOIAttachment
        fields = (
            'created_by',
            'description',
            'file',
        )


class BaseProjectSerializer(serializers.ModelSerializer):

    specializations = SimpleSpecializationSerializer(many=True)
    agency = AgencySerializer()
    created = serializers.SerializerMethodField()
    country_code = serializers.SerializerMethodField()
    focal_points = BasicUserSerializer(read_only=True, many=True)

    class Meta:
        model = EOI
        fields = (
            'id',
            'displayID',
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
            'focal_points',
        )

    def get_created(self, obj):
        return obj.created.date()

    def get_country_code(self, obj):
        return get_countries_code_from_queryset(obj.locations)


class ApplicationsPartnerStatusSerializer(serializers.ModelSerializer):

    legal_name = serializers.CharField(source="partner.legal_name")
    partner_additional = PartnerAdditionalSerializer(source="partner", read_only=True)
    application_status_display = serializers.CharField(read_only=True)

    class Meta:
        model = Application
        fields = (
            'legal_name',
            'partner_additional',
            'application_status',
            'application_status_display',
        )


class DirectProjectSerializer(BaseProjectSerializer):

    invited_partners = serializers.SerializerMethodField()
    partner_offer_status = serializers.SerializerMethodField()
    selected_source_display = serializers.CharField(source='get_selected_source_display', read_only=True)

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
            'selected_source_display',
            'partner_offer_status',
        )

    def get_invited_partners(self, obj):
        return obj.invited_partners.values_list('legal_name', flat=True)

    def get_partner_offer_status(self, obj):
        queryset = Application.objects.filter(eoi=obj)
        return ApplicationsPartnerStatusSerializer(queryset, many=True).data


class CreateEOISerializer(serializers.ModelSerializer):

    locations = PointSerializer(many=True)
    attachments = EOIAttachmentSerializer(many=True, required=False)

    def validate(self, attrs):
        validated_data = super(CreateEOISerializer, self).validate(attrs)
        date_field_names_that_should_be_in_this_order = [
            'deadline_date', 'notif_results_date', 'start_date', 'end_date'
        ]
        dates = []
        for field_name in date_field_names_that_should_be_in_this_order:
            dates.append(validated_data.get(field_name))

        dates = list(filter(None, dates))
        if not dates == sorted(dates):
            raise serializers.ValidationError('Dates for the project are invalid.')

        today = date.today()
        if not all([d >= today for d in dates]):
            raise serializers.ValidationError('Dates for the project cannot be set in the past.')

        validated_data['displayID'] = get_eoi_display_identifier(
            validated_data['agency'].name, validated_data['locations'][0]['admin_level_1']['country_code']
        )

        if len(validated_data.get('attachments', [])) > 5:
            raise serializers.ValidationError({
                'attachments': 'Maximum of 5 attachments is allowed.'
            })

        return validated_data

    class Meta:
        model = EOI
        exclude = ('cn_template', )


class CreateDirectEOISerializer(CreateEOISerializer):

    class Meta:
        model = EOI
        exclude = ('cn_template', 'deadline_date')


class CreateDirectApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        exclude = ("cn", "eoi", "agency", "submitter")

    def validate_partner(self, partner):
        if partner.is_hq:
            raise ValidationError('HQs of International partners are not eligible for Direct Selections / Retention.')
        if partner.is_locked:
            raise ValidationError('Partner account has been locked and is no longer eligible for selection.')
        return partner


class CreateDirectApplicationNoCNSerializer(CreateDirectApplicationSerializer):

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
        return SimpleSpecializationSerializer(
            Specialization.objects.filter(id__in=obj.get('specializations')), many=True
        ).data


# TODO - break this up into different serializers for different purposes
class ApplicationFullSerializer(MixinPreventManyCommonFile, serializers.ModelSerializer):

    cn = CommonFileSerializer()
    eoi_id = serializers.IntegerField(write_only=True)
    partner = PartnerSerializer(read_only=True)
    partner_id = serializers.IntegerField(write_only=True)
    agency = AgencySerializer(read_only=True)
    agency_id = serializers.IntegerField(write_only=True)
    proposal_of_eoi_details = ProposalEOIDetailsSerializer(read_only=True)
    locations_proposal_of_eoi = PointSerializer(many=True, read_only=True)
    submitter = BasicUserSerializer(read_only=True, default=serializers.CurrentUserDefault())
    is_direct = serializers.SerializerMethodField()
    cfei_type = serializers.CharField(read_only=True)
    application_status = serializers.CharField(read_only=True)
    application_status_display = serializers.CharField(read_only=True)
    assessments_is_completed = serializers.NullBooleanField(read_only=True)
    assessments_marked_as_completed = serializers.NullBooleanField(read_only=True)
    decision_date = serializers.DateField(source='partner_decision_date', read_only=True)

    class Meta:
        model = Application
        exclude = (
            'accept_notification',
        )
        read_only_fields = (
            'eoi',
            'agency_decision_date',
            'agency_decision_maker',
            'partner_decision_date',
            'partner_decision_maker',
        )
        validators = [
            UniqueTogetherValidator(
                queryset=Application.objects.all(),
                fields=('eoi_id', 'partner_id'),
                message='Project application already exists for this partner.'
            )
        ]

    prevent_keys = ["cn"]

    def get_extra_kwargs(self):
        extra_kwargs = super(ApplicationFullSerializer, self).get_extra_kwargs()
        request = self.context['request']
        if request.agency_member:
            extra_kwargs['did_accept'] = {
                'read_only': True
            }
            extra_kwargs['did_decline'] = {
                'read_only': True
            }
        elif request.active_partner:
            extra_kwargs['did_win'] = {
                'read_only': True
            }

        return extra_kwargs

    def get_is_direct(self, obj):
        return obj.eoi_converted is not None

    def validate(self, data):
        self.prevent_many_common_file_validator(data)

        if isinstance(self.instance, Application):
            app = self.instance
            allowed_to_modify_status = list(app.eoi.focal_points.values_list('id', flat=True)) + [app.eoi.created_by_id]
            if data.get("status") and self.context['request'].user.id not in allowed_to_modify_status:
                raise serializers.ValidationError(
                    "Only Focal Point/Creator is allowed to pre-select/reject an application."
                )

            if data.get("status") == APPLICATION_STATUSES.rejected and \
                    Assessment.objects.filter(application=app).exists():
                raise serializers.ValidationError("Since assessment has begun, application can't be rejected.")

            if data.get("status") == APPLICATION_STATUSES.recommended:
                if not app.status == APPLICATION_STATUSES.preselected:
                    raise serializers.ValidationError('Only Preselected applications can be recommended.')

                if not app.assessments_is_completed:
                    raise serializers.ValidationError(
                        'Cannot recommend application before all assessments have been completed.'
                    )

            if app.eoi.is_completed:
                raise serializers.ValidationError("Since CFEI is completed, modification is forbidden.")

            if data.get("did_win"):
                if not app.partner.is_verified:
                    raise serializers.ValidationError(
                        "You cannot award an application if the profile has not been verified yet."
                    )

                if app.partner.has_red_flag:
                    raise serializers.ValidationError("You cannot award an application if the profile has red flag.")

                if not app.assessments_is_completed:
                    raise serializers.ValidationError(
                        "You cannot award an application if all assessments have not been added for the application."
                    )

        return super(ApplicationFullSerializer, self).validate(data)


class ApplicationFullEOISerializer(ApplicationFullSerializer):
    eoi = BaseProjectSerializer(read_only=True)
    eoi_applications_count = serializers.SerializerMethodField(allow_null=True, read_only=True)

    def get_eoi_applications_count(self, application):
        return application.eoi and application.eoi.applications.count()


class ManageUCNSerializer(MixinPreventManyCommonFile, serializers.Serializer):

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
            is_published=False,
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

    @transaction.atomic
    def update(self, instance, validated_data):
        self.prevent_many_common_file_validator(validated_data)

        instance.agency_id = validated_data.get('agency', {}).get('id') or instance.agency_id
        instance.proposal_of_eoi_details = validated_data.get(
            'proposal_of_eoi_details'
        ) or instance.proposal_of_eoi_details

        instance.cn = validated_data.get('cn') or instance.cn

        locations_data = self.initial_data.get('locations', [])
        if locations_data:
            instance.locations_proposal_of_eoi.clear()
            for location_data in locations_data:
                location_serializer = PointSerializer(data=location_data)
                location_serializer.is_valid(raise_exception=True)
                instance.locations_proposal_of_eoi.add(location_serializer.save())

        instance.save()
        return instance


class CreateDirectProjectSerializer(serializers.Serializer):

    eoi = CreateDirectEOISerializer()
    applications = CreateDirectApplicationNoCNSerializer(many=True)

    def validate(self, attrs):
        validated_data = super(CreateDirectProjectSerializer, self).validate(attrs)
        if len(validated_data['applications']) > 1:
            raise serializers.ValidationError({
                'applications': 'Only one application is allowed for DSR'
            })
        return validated_data

    @transaction.atomic
    def create(self, validated_data):
        locations = validated_data['eoi'].pop('locations')
        specializations = validated_data['eoi'].pop('specializations')
        focal_points = validated_data['eoi'].pop('focal_points')
        attachments = validated_data['eoi'].pop('attachments', [])

        validated_data['eoi']['display_type'] = CFEI_TYPES.direct
        eoi = EOI.objects.create(**validated_data['eoi'])
        for location in locations:
            point = Point.objects.get_point(**location)
            eoi.locations.add(point)

        for specialization in specializations:
            eoi.specializations.add(specialization)

        for attachment_data in attachments:
            attachment_data['eoi'] = eoi
            EOIAttachment.objects.create(**attachment_data)

        applications = []
        for application_data in validated_data['applications']:
            application = Application.objects.create(
                partner=application_data['partner'],
                eoi=eoi,
                agency=eoi.agency,
                submitter=validated_data['eoi']['created_by'],
                status=APPLICATION_STATUSES.pending,
                did_win=True,
                ds_justification_select=application_data['ds_justification_select'],
                justification_reason=application_data['justification_reason'],
                ds_attachment=application_data.get('ds_attachment'),
            )
            applications.append(application)

        update_cfei_focal_points(eoi, [f.id for f in focal_points])
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
        attachments = validated_data.pop('attachments', [])

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

        for attachment_data in attachments:
            attachment_data['eoi'] = self.instance
            EOIAttachment.objects.create(**attachment_data)

        send_notification_to_cfei_focal_points(self.instance)
        return self.instance


class SelectedPartnersSerializer(serializers.ModelSerializer):
    partner_id = serializers.CharField(source="partner.id")
    partner_name = serializers.CharField(source="partner.legal_name")
    partner_is_verified = serializers.NullBooleanField(source="partner.is_verified")
    application_status_display = serializers.CharField(read_only=True)

    class Meta:
        model = Application
        fields = (
            'id',
            'partner_id',
            'partner_name',
            'partner_is_verified',
            'application_status',
            'application_status_display',
        )


class SelectedPartnersJustificationSerializer(SelectedPartnersSerializer):
    ds_attachment = CommonFileSerializer(read_only=True)

    class Meta(SelectedPartnersSerializer.Meta):
        fields = SelectedPartnersSerializer.Meta.fields + (
            'ds_justification_select',
            'justification_reason',
            'ds_attachment',
        )


class PartnerProjectSerializer(serializers.ModelSerializer):

    agency = serializers.CharField(source='agency.name')
    specializations = SimpleSpecializationSerializer(many=True)
    locations = PointSerializer(many=True)
    is_pinned = serializers.SerializerMethodField()
    application = serializers.SerializerMethodField()
    focal_points_detail = BasicUserSerializer(source='focal_points', read_only=True, many=True)
    reviewers_detail = BasicUserSerializer(source='reviewers', read_only=True, many=True)
    attachments = EOIAttachmentSerializer(many=True, read_only=True)

    # TODO - cut down on some of these fields. partners should not get back this data
    # Frontend currently breaks if doesn't receive all
    class Meta:
        model = EOI
        fields = (
            'id',
            'displayID',
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
            'published_timestamp',
            'deadline_passed',
            'attachments',
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
    focal_points_detail = BasicUserSerializer(source='focal_points', read_only=True, many=True)
    reviewers_detail = BasicUserSerializer(source='reviewers', read_only=True, many=True)
    invited_partners = PartnerShortSerializer(many=True, read_only=True)
    applications_count = serializers.SerializerMethodField(allow_null=True, read_only=True)
    attachments = EOIAttachmentSerializer(many=True, read_only=True)
    current_user_finished_reviews = serializers.SerializerMethodField(allow_null=True, read_only=True)
    current_user_marked_reviews_completed = serializers.SerializerMethodField(allow_null=True, read_only=True)

    class Meta:
        model = EOI
        fields = (
            'id',
            'displayID',
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
            'completed_reason_display',
            'completed_retention',
            'completed_comment',
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
            'contains_partner_accepted',
            'applications_count',
            'is_published',
            'deadline_passed',
            'published_timestamp',
            'attachments',
            'sent_for_decision',
            'current_user_finished_reviews',
            'current_user_marked_reviews_completed',
            'assessments_marked_as_completed',
        )
        read_only_fields = (
            'created',
            'completed_date',
            'is_published',
            'published_timestamp',
            'displayID',
            'sent_for_decision',
        )

    def get_extra_kwargs(self):
        extra_kwargs = super(AgencyProjectSerializer, self).get_extra_kwargs()
        if self.instance and isinstance(self.instance, EOI):
            if not self.instance.is_direct:
                completed_reason_choices = COMPLETED_REASON
            elif self.instance.agency.name == UNHCR.name:
                completed_reason_choices = UNHCR_DSR_COMPLETED_REASONS
            else:
                completed_reason_choices = OTHER_AGENCIES_DSR_COMPLETED_REASONS

            extra_kwargs['completed_reason'] = {
                'choices': completed_reason_choices
            }

        return extra_kwargs

    def get_direct_selected_partners(self, obj):
        if obj.is_direct:
            request = self.context.get('request')
            if obj.is_completed or request and request.agency_member.office.agency == obj.agency:
                serializer_class = SelectedPartnersJustificationSerializer
            else:
                serializer_class = SelectedPartnersSerializer

            return serializer_class(obj.applications.all(), many=True).data

    def get_applications_count(self, eoi):
        return eoi.applications.count()

    def get_current_user_finished_reviews(self, eoi):
        request = self.context.get('request')
        user = request and request.user
        if user and eoi.reviewers.filter(id=user.id).exists():
            applications = eoi.applications.filter(status=APPLICATION_STATUSES.preselected)

            return applications.count() == user.assessments.filter(application__in=applications).count()

    def get_current_user_marked_reviews_completed(self, eoi):
        request = self.context.get('request')
        user = request and request.user
        if user and eoi.reviewers.filter(id=user.id).exists():
            applications = eoi.applications.filter(status=APPLICATION_STATUSES.preselected)
            return applications.count() == user.assessments.filter(application__in=applications, completed=True).count()

    @transaction.atomic
    def update(self, instance, validated_data):
        if instance.status == CFEI_STATUSES.closed and not set(validated_data.keys()).issubset(
            {'reviewers', 'focal_points'}
        ):
            raise serializers.ValidationError(
                "Since CFEI deadline is passed, You can only modify reviewer(s) and/or focal point(s)."
            )

        completed_reason = validated_data.get('completed_reason')

        if completed_reason:
            if not validated_data.get('justification'):
                raise serializers.ValidationError({
                    'justification': 'This field is required'
                })

            if completed_reason == ALL_COMPLETED_REASONS.accepted_retention and not validated_data.get(
                'completed_retention'
            ):
                raise serializers.ValidationError({
                    'completed_retention': 'This field is required'
                })

            if completed_reason in {
                COMPLETED_REASON.partners,
                ALL_COMPLETED_REASONS.accepted,
                ALL_COMPLETED_REASONS.accepted_retention,
            } and not instance.contains_partner_accepted:
                raise serializers.ValidationError({
                    'completed_reason': f"You've selected '{ALL_COMPLETED_REASONS[completed_reason]}' as "
                                        f"finalize resolution, but no partners have accepted."
                })

        has_just_been_completed = all([
            instance.completed_reason is None,
            validated_data.get('completed_reason'),
            instance.completed_date is None,
            instance.is_completed is False
        ])

        if has_just_been_completed:
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

        specialization_ids = self.initial_data.get('specializations', [])
        if specialization_ids:
            instance.specializations.through.objects.exclude(specialization_id__in=specialization_ids).delete()
            instance.specializations.add(*Specialization.objects.filter(id__in=specialization_ids))

        locations_data = self.initial_data.get('locations', [])
        if locations_data:
            instance.locations.clear()
            for location_data in locations_data:
                location_serializer = PointSerializer(data=location_data)
                location_serializer.is_valid(raise_exception=True)
                instance.locations.add(location_serializer.save())

        update_cfei_reviewers(instance, self.initial_data.get('reviewers'))
        update_cfei_focal_points(instance, self.initial_data.get('focal_points'))

        if instance.is_direct and self.initial_data.get('applications'):
            # DSRs should only have 1 application
            application_data = self.initial_data.get('applications')[0]
            serializer = CreateDirectApplicationNoCNSerializer(
                instance=instance.applications.first(),
                data=application_data,
                partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()

        return instance

    def validate(self, data):
        assessments_criteria = data.get('assessments_criteria', [])
        has_weighting = data.get('has_weighting', False)

        if has_weighting is True and all(map(lambda x: 'weight' in x, assessments_criteria)) is False:
            raise serializers.ValidationError(
                "Weight criteria must be provided since `has_weighting` is selected."
            )
        elif has_weighting is False and any(map(lambda x: 'weight' in x, assessments_criteria)) is True:
            raise serializers.ValidationError(
                "Weight criteria should not be provided since `has_weighting` is unselected."
            )

        return super(AgencyProjectSerializer, self).validate(data)


class SimpleAssessmentSerializer(serializers.ModelSerializer):
    reviewer_fullname = serializers.CharField(source='reviewer.fullname')
    total_score = serializers.IntegerField()

    class Meta:
        model = Assessment
        fields = (
            'reviewer_fullname',
            'note',
            'total_score',
        )
        read_only_fields = fields


class ApplicationsListSerializer(serializers.ModelSerializer):

    legal_name = serializers.CharField(source="partner.legal_name")
    partner_additional = PartnerAdditionalSerializer(source="partner", read_only=True)
    type_org = serializers.CharField(source="partner.display_type")
    cn = CommonFileSerializer()
    your_score = serializers.SerializerMethodField()
    your_score_breakdown = serializers.SerializerMethodField()
    review_progress = serializers.SerializerMethodField()
    assessments_completed = serializers.SerializerMethodField()
    application_status_display = serializers.CharField(read_only=True)
    assessments = SimpleAssessmentSerializer(many=True, read_only=True)
    completed_assessments_count = serializers.SerializerMethodField()
    average_scores = serializers.SerializerMethodField()

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
            'application_status_display',
            'assessments',
            'completed_assessments_count',
            'average_scores',
            'did_win',
            'assessments_completed',
        )

    def _get_review_reviewers_count(self, app):
        return app.assessments.count(), app.eoi.reviewers.count()

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
        return '{}/{}'.format(*self._get_review_reviewers_count(obj))

    def get_assessments_completed(self, obj):
        return obj.eoi.reviewers.count() == self.get_completed_assessments_count(obj)

    def get_completed_assessments_count(self, obj):
        return obj.assessments.filter(completed=True).count()

    def get_average_scores(self, obj):
        scores = defaultdict(int)
        total = 0

        for assessment in obj.assessments.filter(completed=True):
            for score in assessment.scores:
                scores[score['selection_criteria']] += score['score']

            total += 1

        if not total:
            return {}

        return {
            k: v / total for k, v in scores.items()
        }


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
    total_score = serializers.IntegerField(read_only=True)
    reviewer = serializers.HiddenField(default=serializers.CreateOnlyDefault(CurrentUserDefault()))
    created_by = serializers.HiddenField(default=serializers.CreateOnlyDefault(CurrentUserDefault()))
    modified_by = serializers.HiddenField(default=serializers.CreateOnlyDefault(CurrentUserDefault()))

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
            'is_a_committee_score',
            'note',
            'completed',
            'completed_date',
        )
        read_only_fields = (
            'created_by', 'modified_by', 'completed', 'completed_date',
        )

    def get_extra_kwargs(self):
        extra_kwargs = super(ReviewerAssessmentsSerializer, self).get_extra_kwargs()

        if self.instance:
            extra_kwargs['application'] = {
                'read_only': True
            }
        return extra_kwargs

    def validate(self, data):
        kwargs = self.context['request'].parser_context.get('kwargs', {})
        application_id = kwargs.get(self.context['view'].application_url_kwarg)
        app = get_object_or_404(Application.objects.select_related('eoi'), pk=application_id)
        if app.eoi.status != CFEI_STATUSES.closed:
            raise serializers.ValidationError("Assessment allowed once deadline is passed.")

        if data.get('is_a_committee_score', False) and app.eoi.reviewers.count() > 1:
            raise serializers.ValidationError({
                'is_a_committee_score': 'Committee scores are only allowed on projects with one reviewer.'
            })

        scores = data.get('scores')
        application = self.instance and self.instance.application or app
        assessments_criteria = application.eoi.assessments_criteria

        if scores and not {s['selection_criteria'] for s in scores} == {
            ac['selection_criteria'] for ac in assessments_criteria
        }:
            raise serializers.ValidationError("You can score only selection criteria defined in CFEI.")

        if scores and application.eoi.has_weighting:
            for score in scores:
                key = score.get('selection_criteria')
                val = score.get('score')
                criterion = list(filter(lambda x: x.get('selection_criteria') == key, assessments_criteria))
                if len(criterion) == 1 and val > criterion[0].get('weight'):
                    raise serializers.ValidationError("The maximum score is equal to the value entered for the weight.")
                elif len(criterion) != 1:
                    raise serializers.ValidationError("Selection criterion '{}' defined improper.".format(key))

        return super(ReviewerAssessmentsSerializer, self).validate(data)


class ApplicationPartnerOpenSerializer(serializers.ModelSerializer):

    project_title = serializers.CharField(source="eoi.title")
    agency_name = serializers.CharField(source="agency.name")
    country = serializers.SerializerMethodField()
    specializations = serializers.SerializerMethodField()
    application_date = serializers.CharField(source="created")
    application_status_display = serializers.CharField(read_only=True)

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
            'application_status_display',
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
    submission_date = serializers.DateTimeField(source="published_timestamp")
    is_direct = serializers.SerializerMethodField()
    partner_name = serializers.CharField(source="partner.legal_name")
    partner_additional = PartnerAdditionalSerializer(source="partner", read_only=True)
    selected_source = serializers.CharField(source="eoi.selected_source", allow_null=True)
    application_status_display = serializers.CharField(read_only=True)

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
            'application_status_display',
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

    provider = AgencyUserListSerializer(read_only=True)

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
        update_cfei_focal_points(eoi, focal_points)

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
        applications = eoi.applications.filter(status=APPLICATION_STATUSES.preselected)
        applications_count = applications.count()

        assessments_count = Assessment.objects.filter(reviewer=user, application__in=applications).count()
        reminder_sent_recently = user_received_notification_recently(user, eoi, NotificationType.CFEI_REVIEW_REQUIRED)

        return {
            'counts': "{}/{}".format(assessments_count, applications_count),
            'send_reminder': not (applications_count == assessments_count) and not reminder_sent_recently,
            'eoi_id': eoi_id,  # use full for front-end to easier construct send reminder url
        }


class AwardedPartnersSerializer(serializers.ModelSerializer):

    partner_id = serializers.CharField(source='partner.id')
    partner_name = serializers.CharField(source='partner.legal_name')
    partner_additional = PartnerAdditionalSerializer(source="partner", read_only=True)
    application_id = serializers.CharField(source='id')

    cn = CommonFileSerializer()
    partner_notified = serializers.SerializerMethodField()
    agency_decision_maker = BasicUserSerializer(read_only=True)
    partner_decision_maker = BasicUserSerializer(read_only=True)

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
            'agency_decision_date',
            'agency_decision_maker',
            'partner_decision_date',
            'partner_decision_maker',
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
            'assessments_marked_as_completed',
        )

    def get_annual_budget(self, obj):
        return obj.partner.profile.annual_budget

    def get_un_exp(self, obj):
        return ", ".join(obj.partner.collaborations_partnership.all().values_list('agency__name', flat=True))


class SubmittedCNSerializer(serializers.ModelSerializer):
    cn_id = serializers.IntegerField(source='id')
    agency_name = serializers.CharField(source="agency.name")
    specializations = serializers.SerializerMethodField()
    application_status_display = serializers.CharField(read_only=True)

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
            'application_status_display',
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

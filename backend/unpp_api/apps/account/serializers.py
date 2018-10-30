from datetime import date

from django.db import transaction

from rest_framework import serializers
from rest_auth.serializers import LoginSerializer, PasswordResetSerializer
from rest_framework.validators import UniqueValidator

from account.declaration import PartnerDeclarationPDFCreator
from account.forms import CustomPasswordResetForm
from common.consts import (
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    POLICY_AREA_CHOICES,
    COLLABORATION_EVIDENCE_MODES,
)
from common.serializers import CommonFileBase64UploadSerializer
from partner.models import (
    Partner,
    PartnerProfile,
    PartnerHeadOrganization,
    PartnerInternalControl,
    PartnerMember,
    PartnerBudget,
    PartnerPolicyArea,
    PartnerRegistrationDocument,
    PartnerGoverningDocument,
    PartnerCollaborationEvidence,
)
from partner.roles import PartnerRole

from partner.serializers import (
    PartnerSerializer,
    PartnerProfileSerializer,
    PartnerHeadOrganizationRegisterSerializer,
    PartnerGoverningDocumentSerializer,
    PartnerRegistrationDocumentSerializer,
    PartnerCollaborationEvidenceSerializer,
)
from account.models import User, UserProfile
from sanctionslist.scans import sanctions_scan_partner


class SimpleAccountSerializer(serializers.ModelSerializer):

    date_joined = serializers.DateTimeField(required=False, read_only=True)
    fullname = serializers.CharField(required=False)
    email = serializers.EmailField(validators=[
        UniqueValidator(queryset=User.objects.all(), lookup='iexact')
    ])

    class Meta:
        model = User
        fields = (
            'id',
            'fullname',
            'email',
            'password',
            'date_joined',
        )
        extra_kwargs = {'password': {'write_only': True}}

    def save(self):
        user = super(SimpleAccountSerializer, self).save()
        if 'password' in self.validated_data:
            user.set_password(self.validated_data['password'])
            user.save()
        return user


class PartnerRecommendationDocumentSerializer(PartnerCollaborationEvidenceSerializer):

    evidence_file = CommonFileBase64UploadSerializer()

    class Meta(PartnerCollaborationEvidenceSerializer.Meta):
        extra_kwargs = {
            'organization_name': {
                'required': True
            },
            'date_received': {
                'required': True
            },
            'partner': {
                'required': False
            },
        }


class PartnerDeclarationSerializer(serializers.Serializer):
    question = serializers.CharField()
    answer = serializers.CharField()


class PartnerRegistrationSerializer(serializers.Serializer):

    user = serializers.HiddenField(default=serializers.CreateOnlyDefault(serializers.CurrentUserDefault()))

    partner = PartnerSerializer()
    partner_profile = PartnerProfileSerializer()
    partner_head_organization = PartnerHeadOrganizationRegisterSerializer()

    governing_document = PartnerGoverningDocumentSerializer(required=False)
    registration_document = PartnerRegistrationDocumentSerializer(required=False)
    recommendation_document = PartnerRecommendationDocumentSerializer(required=False)

    declaration = PartnerDeclarationSerializer(many=True, write_only=True)

    def validate(self, attrs):
        validated_data = super(PartnerRegistrationSerializer, self).validate(attrs)
        governing_document = validated_data.get('governing_document')
        registration_document = validated_data.get('registration_document')
        recommendation_document = validated_data.get('recommendation_document')

        if not any([governing_document, recommendation_document, registration_document]):
            raise serializers.ValidationError('At least one document needs to be provided.')

        profile = validated_data.get('partner_profile', {})

        if profile.get('have_governing_document'):
            if not governing_document:
                raise serializers.ValidationError({
                    'governing_document': 'This field is required'
                })
        elif not profile.get('missing_governing_document_comment'):
            raise serializers.ValidationError({
                'missing_governing_document_comment': 'This field is required'
            })

        if profile.get('registered_to_operate_in_country'):
            if not registration_document:
                raise serializers.ValidationError({
                    'registration_document': 'This field is required'
                })
        elif not profile.get('missing_registration_document_comment'):
            raise serializers.ValidationError({
                'missing_registration_document_comment': 'This field is required'
            })

        return validated_data

    def save_documents(self, validated_data, user):
        governing_document = validated_data.get('governing_document')
        registration_document = validated_data.get('registration_document')
        recommendation_document = validated_data.get('recommendation_document')

        if governing_document:
            governing_document['created_by'] = user
            governing_document['profile'] = self.partner.profile
            PartnerGoverningDocument.objects.create(editable=False, **governing_document)

        if registration_document:
            registration_document['created_by'] = user
            registration_document['profile'] = self.partner.profile
            PartnerRegistrationDocument.objects.create(editable=False, **registration_document)

        if recommendation_document:
            recommendation_document['created_by'] = user
            recommendation_document['partner'] = self.partner
            recommendation_document['mode'] = COLLABORATION_EVIDENCE_MODES.reference
            PartnerCollaborationEvidence.objects.create(editable=False, **recommendation_document)
            self.partner.profile.any_reference = True
            self.partner.profile.save()

    @transaction.atomic
    def create(self, validated_data):
        user = validated_data.pop('user')

        self.partner = Partner.objects.create(**validated_data['partner'])
        self.save_documents(validated_data, user)

        PartnerProfile.objects.filter(partner=self.partner).update(**validated_data['partner_profile'])

        partner_head_org = validated_data['partner_head_organization']
        partner_head_org['partner_id'] = self.partner.pk
        PartnerHeadOrganization.objects.create(**partner_head_org)

        responsibilities = []
        for responsibility in list(FUNCTIONAL_RESPONSIBILITY_CHOICES._db_values):
            responsibilities.append(
                PartnerInternalControl(partner=self.partner, functional_responsibility=responsibility)
            )
        PartnerInternalControl.objects.bulk_create(responsibilities)

        policy_areas = []
        for policy_area in list(POLICY_AREA_CHOICES._db_values):
            policy_areas.append(PartnerPolicyArea(partner=self.partner, area=policy_area))

        PartnerPolicyArea.objects.bulk_create(policy_areas)

        budgets = []
        for year in [date.today().year, date.today().year-1, date.today().year-2]:
            budgets.append(PartnerBudget(partner=self.partner, year=year))
        PartnerBudget.objects.bulk_create(budgets)

        partner_member, _ = PartnerMember.objects.get_or_create(
            partner=self.partner,
            user=user,
            defaults={
                'role': PartnerRole.ADMIN.name,
                'title': 'Administrator'
            }
        )

        self.partner.save()
        self.partner = Partner.objects.get(pk=self.partner.pk)

        Partner.objects.filter(pk=self.partner.pk).update(
            declaration=PartnerDeclarationPDFCreator(
                validated_data['declaration'], self.partner, user
            ).get_as_common_file()
        )

        sanctions_scan_partner(self.partner)
        from partner.serializers import PartnerMemberSerializer
        return {
            "partner": PartnerSerializer(instance=self.partner).data,
            "partner_profile": PartnerProfileSerializer(instance=self.partner.profile).data,
            "partner_head_organization": PartnerHeadOrganizationRegisterSerializer(instance=self.partner.org_head).data,
            "partner_member": PartnerMemberSerializer(instance=partner_member).data,
        }


class UserProfileSerializer(serializers.ModelSerializer):
    notification_frequency_display = serializers.CharField(source='get_notification_frequency_display')

    class Meta:
        model = UserProfile
        fields = (
            'id',
            'notification_frequency',
            'notification_frequency_display',
            'accepted_tos',
        )


class UserSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='fullname', read_only=True)
    profile = UserProfileSerializer(read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'is_active',
            'name',
            'email',
            'status',
            'profile',
        )


class BasicUserSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='fullname', read_only=True)

    class Meta:
        model = User
        fields = (
            'id',
            'name',
            'email',
        )


class IDUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', )


class PartnerUserSerializer(UserSerializer):

    partners = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    permissions = serializers.SerializerMethodField()

    def _partner_member(self, user):
        request = self.context.get('request')
        if request and request.partner_member:
            return request.partner_member

        return user.partner_members.first()

    def get_role(self, user):
        return self._partner_member(user).get_role_display()

    class Meta:
        model = User
        fields = UserSerializer.Meta.fields + (
            'partners',
            'role',
            'permissions',
        )

    def get_partners(self, obj):
        partner_ids = obj.get_partner_ids_i_can_access()
        return PartnerSerializer(Partner.objects.filter(id__in=partner_ids), many=True).data

    def get_permissions(self, user):
        return [
            p.name for p in self._partner_member(user).user_permissions
        ]


class UserFullnameSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'fullname', 'email', )


class PartnerMemberSerializer(serializers.ModelSerializer):

    user = UserFullnameSerializer()

    class Meta:
        model = PartnerMember
        fields = "__all__"


class CustomLoginSerializer(LoginSerializer):

    def validate(self, attrs):
        attrs = super(CustomLoginSerializer, self).validate(attrs)
        user = attrs['user']
        if user.is_partner_user:
            if not user.partner_members.filter(partner__is_locked=False).exists():
                raise serializers.ValidationError('Account is Locked')
        return attrs


class CustomPasswordResetSerializer(PasswordResetSerializer):

    password_reset_form_class = CustomPasswordResetForm

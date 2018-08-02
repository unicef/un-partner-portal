from datetime import date

from django.db import transaction

from rest_framework import serializers
from rest_auth.serializers import LoginSerializer, PasswordResetSerializer
from rest_framework.validators import UniqueValidator

from account.forms import CustomPasswordResetForm
from common.consts import (
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    POLICY_AREA_CHOICES,
)
from partner.models import (
    Partner,
    PartnerProfile,
    PartnerHeadOrganization,
    PartnerInternalControl,
    PartnerMember,
    PartnerBudget,
    PartnerPolicyArea,
)
from partner.roles import PartnerRole

from partner.serializers import (
    PartnerSerializer,
    PartnerProfileSerializer,
    PartnerHeadOrganizationRegisterSerializer,
    PartnerMemberSerializer,
)
from partner.validators import PartnerRegistrationValidator
from account.models import User, UserProfile


class RegisterSimpleAccountSerializer(serializers.ModelSerializer):

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
        user = super(RegisterSimpleAccountSerializer, self).save()
        if 'password' in self.validated_data:
            user.set_password(self.validated_data['password'])
            user.save()
        return user


class PartnerRegistrationSerializer(serializers.Serializer):

    user = RegisterSimpleAccountSerializer()
    partner = PartnerSerializer()
    partner_profile = PartnerProfileSerializer()
    partner_head_organization = PartnerHeadOrganizationRegisterSerializer()
    partner_member = PartnerMemberSerializer()

    class Meta:
        validators = (
            PartnerRegistrationValidator(),
        )

    @transaction.atomic
    def create(self, validated_data):
        user_serializer = RegisterSimpleAccountSerializer(data=validated_data.pop('user'))
        user_serializer.is_valid()
        user_serializer.save()

        self.partner = Partner.objects.create(**validated_data['partner'])

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

        partner_member = validated_data['partner_member']
        partner_member['partner_id'] = self.partner.id
        partner_member['user'] = user_serializer.instance
        partner_member['role'] = PartnerRole.ADMIN.name
        self.partner_member = PartnerMember.objects.create(**validated_data['partner_member'])

        self.partner = Partner.objects.get(pk=self.partner.pk)
        return {
            "partner": PartnerSerializer(instance=self.partner).data,
            "user": user_serializer.data,
            "partner_profile": PartnerProfileSerializer(instance=self.partner.profile).data,
            "partner_head_organization": PartnerHeadOrganizationRegisterSerializer(instance=self.partner.org_head).data,
            "partner_member": PartnerMemberSerializer(instance=self.partner_member).data,
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
                raise serializers.ValidationError('Account is Currently Locked')
        return attrs


class CustomPasswordResetSerializer(PasswordResetSerializer):

    password_reset_form_class = CustomPasswordResetForm

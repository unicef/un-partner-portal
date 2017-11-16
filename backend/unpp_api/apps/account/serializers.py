from datetime import date

from django.db import transaction

from rest_framework import serializers
from rest_auth.serializers import LoginSerializer
from rest_framework.validators import UniqueValidator

from common.consts import (
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    MEMBER_ROLES,
    MEMBER_STATUSES,
    POLICY_AREA_CHOICES,
)
from partner.models import (
    Partner,
    PartnerProfile,
    PartnerMailingAddress,
    PartnerHeadOrganization,
    PartnerAuditAssessment,
    PartnerReporting,
    PartnerMandateMission,
    PartnerFunding,
    PartnerOtherInfo,
    PartnerInternalControl,
    PartnerMember,
    PartnerBudget,
    PartnerPolicyArea,
)

from partner.serializers import (
    PartnerSerializer,
    PartnerProfileSerializer,
    PartnerHeadOrganizationRegisterSerializer,
    PartnerMemberSerializer,
)
from .models import User


class RegisterSimpleAccountSerializer(serializers.ModelSerializer):

    date_joined = serializers.DateTimeField(required=False, read_only=True)
    username = serializers.CharField(required=False, read_only=True)
    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all())])

    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'last_name',
            'username',
            'email',
            'password',
            'date_joined',
        )


class PartnerRegistrationSerializer(serializers.Serializer):

    user = RegisterSimpleAccountSerializer()
    partner = PartnerSerializer()
    partner_profile = PartnerProfileSerializer()
    partner_head_organization = PartnerHeadOrganizationRegisterSerializer()
    partner_member = PartnerMemberSerializer()

    @transaction.atomic
    def create(self, validated_data):
        validated_data['user']['username'] = validated_data['user']['email']
        self.user = User.objects.create(**validated_data['user'])
        self.user.set_password(validated_data['user']['password'])
        self.user.save()

        self.partner = Partner.objects.create(**validated_data['partner'])

        partner_profile = validated_data['partner_profile']
        partner_profile['partner_id'] = self.partner.id
        self.partner_profile = PartnerProfile.objects.create(**partner_profile)

        partner_head_orge = validated_data['partner_head_organization']
        partner_head_orge['partner_id'] = self.partner.id
        self.partner_head_organization = PartnerHeadOrganization.objects.create(**partner_head_orge)

        PartnerMailingAddress.objects.create(partner=self.partner)
        PartnerAuditAssessment.objects.create(partner=self.partner)
        PartnerReporting.objects.create(partner=self.partner)
        PartnerMandateMission.objects.create(partner=self.partner)
        PartnerFunding.objects.create(partner=self.partner)
        PartnerOtherInfo.objects.create(partner=self.partner)

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
        partner_member['user_id'] = self.user.id
        partner_member['role'] = MEMBER_ROLES.admin
        partner_member['status'] = MEMBER_STATUSES.active
        self.partner_member = PartnerMember.objects.create(**validated_data['partner_member'])

        user_data = RegisterSimpleAccountSerializer(instance=self.user).data
        user_data.pop('password')
        self.instance_json = {
            "partner": PartnerSerializer(instance=self.partner).data,
            "user": user_data,
            "partner_profile": PartnerProfileSerializer(instance=self.partner_profile).data,
            "partner_head_organization": PartnerHeadOrganizationRegisterSerializer(self.partner_head_organization).data,
            "partner_member": PartnerMemberSerializer(instance=self.partner_member).data,
        }
        return self.instance_json


class UserSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='get_fullname')

    class Meta:
        model = User
        fields = ('id', 'name', 'email',)


class IDUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', )


class AgencyUserSerializer(UserSerializer):

    agency_name = serializers.SerializerMethodField()
    agency_id = serializers.SerializerMethodField()
    office_name = serializers.SerializerMethodField()
    office_id = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = UserSerializer.Meta.fields + ('agency_name',
                                               'agency_id',
                                               'role',
                                               'office_name',
                                               'office_id',)

    def _agency_member(self, obj):
        return obj.agency_members.get()

    def get_role(self, obj):
        return self._agency_member(obj).get_role_display()

    def get_agency_name(self, obj):
        return self._agency_member(obj).office.agency.name

    def get_agency_id(self, obj):
        return self._agency_member(obj).office.agency.id

    def get_office_name(self, obj):
        return self._agency_member(obj).office.name

    def get_office_id(self, obj):
        return self._agency_member(obj).office.id


class PartnerUserSerializer(UserSerializer):

    partners = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = UserSerializer.Meta.fields + ('partners', 'is_account_locked',)

    def get_partners(self, obj):
        partner_ids = obj.get_partner_ids_i_can_access()
        return PartnerSerializer(Partner.objects.filter(id__in=partner_ids),
                                 many=True).data


class UserFullnameSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', )


class PartnerMemberSerializer(serializers.ModelSerializer):

    user = UserFullnameSerializer()

    class Meta:
        model = PartnerMember
        fields = "__all__"


class CustomLoginSerializer(LoginSerializer):

    def validate(self, attrs):
        sup_attrs = super(CustomLoginSerializer, self).validate(attrs)
        user = sup_attrs['user']
        if user.is_partner_user:
            if user.is_account_locked:
                raise serializers.ValidationError('Account is Currently Locked')
        return sup_attrs

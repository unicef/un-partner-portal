from django.db import transaction
from rest_framework import serializers

from account.models import User
from management.fields import CurrentAgencyFilteredPKField, CurrentPartnerFilteredPKField
from agency.models import AgencyMember, AgencyOffice
from management.invites import send_partner_user_invite, send_agency_user_invite
from partner.models import PartnerMember, Partner


class AgencyOfficeManagementSerializer(serializers.ModelSerializer):

    class Meta:
        model = AgencyOffice
        fields = (
            'id',
            'name',
        )


class AgencyMemberManagementSerializer(serializers.ModelSerializer):

    office = AgencyOfficeManagementSerializer(read_only=True)
    office_id = CurrentAgencyFilteredPKField(queryset=AgencyOffice.objects.all(), write_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = AgencyMember
        fields = (
            'id',
            'role',
            'role_display',
            'office',
            'office_id',
        )


class AgencyUserManagementSerializer(serializers.ModelSerializer):

    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    office_memberships = AgencyMemberManagementSerializer(many=True, source='agency_members', allow_empty=False)

    class Meta:
        model = User

        fields = (
            'id',
            'is_active',
            'first_name',
            'last_name',
            'fullname',
            'email',
            'status',
            'office_memberships',
        )
        extra_kwargs = {'fullname': {'read_only': True}}

    def validate(self, attrs):
        validated_data = super(AgencyUserManagementSerializer, self).validate(attrs)
        self.context['agency_members'] = validated_data.pop('agency_members')
        validated_data['fullname'] = f'{validated_data.pop("first_name")} {validated_data.pop("last_name")}'
        return validated_data

    @transaction.atomic
    def save(self):
        update = bool(self.instance)
        user = super(AgencyUserManagementSerializer, self).save()

        memberships = []
        for member_data in self.context['agency_members']:
            memberships.append(AgencyMember.objects.update_or_create(
                user=user,
                office=member_data.pop('office_id'),
                defaults=member_data
            )[0].pk)

        if update:
            AgencyMember.objects.filter(user=user).exclude(pk__in=memberships).delete()
        else:
            user.set_unusable_password()
            user.save()
            send_agency_user_invite(user, self.context['request'].user)

        return user


class PartnerOfficeManagementSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='legal_name')

    class Meta:
        model = Partner
        fields = (
            'id',
            'name',
        )


class PartnerMemberManagementSerializer(serializers.ModelSerializer):

    office = PartnerOfficeManagementSerializer(read_only=True, source='partner')
    office_id = CurrentPartnerFilteredPKField(queryset=Partner.objects.all(), write_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = PartnerMember
        fields = (
            'id',
            'role',
            'role_display',
            'office',
            'office_id',
        )


class PartnerUserManagementSerializer(serializers.ModelSerializer):

    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    office_memberships = PartnerMemberManagementSerializer(many=True, source='partner_members', allow_empty=False)

    class Meta:
        model = User

        fields = (
            'id',
            'is_active',
            'first_name',
            'last_name',
            'fullname',
            'email',
            'status',
            'office_memberships',
        )
        extra_kwargs = {'fullname': {'read_only': True}}

    def validate(self, attrs):
        validated_data = super(PartnerUserManagementSerializer, self).validate(attrs)
        self.context['partner_members'] = validated_data.pop('partner_members')
        validated_data['fullname'] = f'{validated_data.pop("first_name")} {validated_data.pop("last_name")}'
        return validated_data

    @transaction.atomic
    def save(self):
        update = bool(self.instance)
        user = super(PartnerUserManagementSerializer, self).save()

        memberships = []
        for member_data in self.context['partner_members']:
            memberships.append(PartnerMember.objects.update_or_create(
                user=user,
                partner=member_data.pop('office_id'),
                defaults=member_data
            )[0].pk)

        if update:
            PartnerMember.objects.filter(user=user).exclude(pk__in=memberships).delete()
        else:
            user.set_random_password()
            user.save()
            send_partner_user_invite(user, self.context['request'].user)

        return user

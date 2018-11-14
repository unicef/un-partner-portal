from django.db import transaction
from rest_framework import serializers

from account.models import User
from agency.roles import AgencyRole
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

    def get_extra_kwargs(self):
        extra_kwargs = super(AgencyMemberManagementSerializer, self).get_extra_kwargs()
        request = self.context.get('request')
        extra_kwargs['role'] = {
            'choices': AgencyRole.get_choices(request.user.agency) if request else ()
        }

        return extra_kwargs


class AgencyUserManagementSerializer(serializers.ModelSerializer):

    office_memberships = AgencyMemberManagementSerializer(many=True, source='agency_members', allow_empty=False)

    class Meta:
        model = User

        fields = (
            'id',
            'is_active',
            'fullname',
            'email',
            'status',
            'office_memberships',
        )
        extra_kwargs = {'fullname': {'required': True}}

    def validate(self, attrs):
        validated_data = super(AgencyUserManagementSerializer, self).validate(attrs)
        self.context['agency_members'] = validated_data.pop('agency_members', None)
        return validated_data

    @transaction.atomic
    def save(self):
        update = bool(self.instance)
        user = super(AgencyUserManagementSerializer, self).save()

        if self.context['agency_members'] is not None:
            memberships = []
            for member_data in self.context['agency_members']:
                memberships.append(AgencyMember.objects.update_or_create(
                    user=user,
                    office=member_data.pop('office_id'),
                    defaults=member_data
                )[0].pk)
            AgencyMember.objects.filter(user=user).exclude(pk__in=memberships).delete()

        if not update:
            user.profile.accepted_tos = True
            user.profile.save()
            user.set_unusable_password()
            user.save()
            send_agency_user_invite(user, self.context['request'].user)

        return user


class PartnerOfficeManagementSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='get_country_code_display')

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
    current_user_can_edit = serializers.SerializerMethodField()

    class Meta:
        model = PartnerMember
        fields = (
            'id',
            'role',
            'role_display',
            'office',
            'office_id',
            'current_user_can_edit',
        )

    def get_current_user_can_edit(self, member: PartnerMember):
        request = self.context.get('request')
        if not request:
            return False

        return member.partner == request.active_partner or member.partner.hq == request.active_partner


class PartnerUserManagementSerializer(serializers.ModelSerializer):

    office_memberships = PartnerMemberManagementSerializer(many=True, source='partner_members', allow_empty=False)

    class Meta:
        model = User

        fields = (
            'id',
            'is_active',
            'fullname',
            'email',
            'status',
            'office_memberships',
        )
        extra_kwargs = {'fullname': {'required': True}}

    def validate(self, attrs):
        validated_data = super(PartnerUserManagementSerializer, self).validate(attrs)
        self.context['partner_members'] = validated_data.pop('partner_members', None)
        return validated_data

    @transaction.atomic
    def save(self):
        update = bool(self.instance)
        user = super(PartnerUserManagementSerializer, self).save()

        if self.context['partner_members'] is not None:
            memberships = []
            for member_data in self.context['partner_members']:
                memberships.append(PartnerMember.objects.update_or_create(
                    user=user,
                    partner=member_data.pop('office_id'),
                    defaults=member_data
                )[0].pk)
            PartnerMember.objects.filter(user=user).exclude(pk__in=memberships).delete()

        if not update:
            user.profile.accepted_tos = True
            user.profile.save()
            user.set_random_password()
            user.save()
            send_partner_user_invite(
                user,
                self.context['request'].user,
                partner=getattr(self.context.get('request'), 'active_partner', None)
            )

        return user

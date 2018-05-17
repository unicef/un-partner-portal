from django.db import transaction
from rest_framework import serializers

from account.models import User
from agency.fields import CurrentAgencyFilteredPKField
from agency.models import AgencyMember, AgencyOffice


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

    name = serializers.CharField(source='fullname', read_only=True)
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
            'name',
            'email',
            'status',
            'office_memberships',
        )

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
            pass
            # TODO: Invite email

        return user

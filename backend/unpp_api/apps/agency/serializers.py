from django.db import transaction
from rest_framework import serializers

from account.models import User
from agency.fields import CurrentAgencyFilteredPKField
from agency.models import Agency, OtherAgency, AgencyOffice, AgencyMember


class AgencySerializer(serializers.ModelSerializer):

    class Meta:
        model = Agency
        fields = (
            'id',
            'name',
        )


class OtherAgencySerializer(serializers.ModelSerializer):

    class Meta:
        model = OtherAgency
        fields = "__all__"


class AgencyOfficeSerializer(serializers.ModelSerializer):

    agency = AgencySerializer()

    class Meta:
        model = AgencyOffice
        fields = (
            'id',
            'name',
            'countries_code',
            'agency',
        )


class AgencyMemberSerializer(serializers.ModelSerializer):

    office = AgencyOfficeSerializer(read_only=True)
    office_id = CurrentAgencyFilteredPKField(queryset=AgencyOffice.objects.all(), write_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    permissions = serializers.SerializerMethodField()

    class Meta:
        model = AgencyMember
        fields = (
            'id',
            'role',
            'role_display',
            'office',
            'office_id',
            'telephone',
            'permissions',
        )

    def get_permissions(self, agency_member):
        return [
            p.name for p in agency_member.user_permissions
        ]


class AgencyUserSerializer(serializers.ModelSerializer):

    name = serializers.CharField(source='fullname', read_only=True)
    first_name = serializers.CharField(write_only=True)
    last_name = serializers.CharField(write_only=True)
    office_memberships = AgencyMemberSerializer(many=True, source='agency_members', allow_empty=False)

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
        validated_data = super(AgencyUserSerializer, self).validate(attrs)
        self.context['agency_members'] = validated_data.pop('agency_members')
        validated_data['fullname'] = f'{validated_data.pop("first_name")} {validated_data.pop("last_name")}'
        return validated_data

    @transaction.atomic
    def save(self):
        update = bool(self.instance)
        user = super(AgencyUserSerializer, self).save()

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

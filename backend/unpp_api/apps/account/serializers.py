from django.db import transaction
from rest_framework import serializers

from partner.models import (
    Partner,
    PartnerProfile,
    PartnerHeadOrganization,
    PartnerMember,
)

from partner.serializers import (
    PartnerSerializer,
    PartnerProfileSerializer,
    PartnerHeadOrganizationSerializer,
    PartnerMemberSerializer,
)
from .models import User


class RegisterSimpleAccountSerializer(serializers.ModelSerializer):

    date_joined = serializers.DateTimeField(required=False, read_only=True)
    username = serializers.CharField(required=False, read_only=True)

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
    partner_head_organization = PartnerHeadOrganizationSerializer()
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

        partner_member = validated_data['partner_member']
        partner_member['partner_id'] = self.partner.id
        partner_member['user_id'] = self.user.id
        self.partner_member = PartnerMember.objects.create(**validated_data['partner_member'])

        user_data = RegisterSimpleAccountSerializer(instance=self.user).data
        user_data.pop('password')
        self.instance_json = {
            "partner": PartnerSerializer(instance=self.partner).data,
            "user": user_data,
            "partner_profile": PartnerProfileSerializer(instance=self.partner_profile).data,
            "partner_head_organization": PartnerHeadOrganizationSerializer(self.partner_head_organization).data,
            "partner_member": PartnerMemberSerializer(instance=self.partner_member).data,
        }
        return self.instance_json

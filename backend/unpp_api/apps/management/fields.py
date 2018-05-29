from django.db.models import Q
from rest_framework import serializers

from agency.roles import AgencyRole


class CurrentAgencyFilteredPKField(serializers.PrimaryKeyRelatedField):

    def get_queryset(self):
        queryset = super(CurrentAgencyFilteredPKField, self).get_queryset()
        request = self.context.get('request')

        if request and queryset:
            queryset = queryset.filter(agency=request.user.agency)
            if not request.agency_member.role == AgencyRole.HQ_EDITOR.name:
                # Only HQ_EDITOR users can assign users freely between all offices
                queryset = queryset.filter(agency_members__user=request.user)
            return queryset

        return queryset.none()


class CurrentPartnerFilteredPKField(serializers.PrimaryKeyRelatedField):

    def get_queryset(self):
        queryset = super(CurrentPartnerFilteredPKField, self).get_queryset()
        request = self.context.get('request')
        if queryset and request and request.partner_member:
            query = Q(id=request.partner_member.partner_id)
            if request.partner_member.partner.is_hq:
                query |= Q(hq=request.partner_member.partner)
            return queryset.filter(query)

        return queryset.none()

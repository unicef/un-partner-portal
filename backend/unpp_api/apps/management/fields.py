from django.db.models import Q
from rest_framework import serializers


class CurrentAgencyFilteredPKField(serializers.PrimaryKeyRelatedField):

    def get_queryset(self):
        queryset = super(CurrentAgencyFilteredPKField, self).get_queryset()
        request = self.context.get('request')
        if request and queryset:
            queryset = queryset.filter(agency=request.user.agency)
        return queryset


class CurrentPartnerFilteredPKField(serializers.PrimaryKeyRelatedField):

    def get_queryset(self):
        queryset = super(CurrentPartnerFilteredPKField, self).get_queryset()
        request = self.context.get('request')
        if queryset and request and request.partner_member:
            query = Q(id=request.partner_member.partner_id)
            if request.partner_member.partner.is_hq:
                query |= Q(hq=request.partner_member.partner)
            queryset = queryset.filter(query)
        return queryset

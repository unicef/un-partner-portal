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
                # frontend send in PATCH request all offices and it get error
                # queryset = queryset.filter(agency_members__user=request.user)
                pass
            return queryset

        return queryset.none()


class CurrentPartnerFilteredPKField(serializers.PrimaryKeyRelatedField):

    def get_queryset(self):
        queryset = super(CurrentPartnerFilteredPKField, self).get_queryset()
        request = self.context.get('request')

        if queryset and request and request.active_partner:
            return queryset.filter(id__in=request.user.partner_ids)

        return queryset.none()

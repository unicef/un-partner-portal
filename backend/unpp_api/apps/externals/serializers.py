from rest_framework import serializers

from common.defaults import CurrentUserAgencyDefault
from common.mixins import CreateOnlyFieldsMixin
from externals.models import PartnerVendorNumber
from partner.models import Partner


class PartnerVendorNumberSerializer(CreateOnlyFieldsMixin, serializers.ModelSerializer):

    agency = serializers.HiddenField(default=serializers.CreateOnlyDefault(CurrentUserAgencyDefault()))
    partner = serializers.PrimaryKeyRelatedField(queryset=Partner.objects.all())
    business_area_display = serializers.CharField(source='get_business_area_display', read_only=True)
    agency_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = PartnerVendorNumber
        fields = (
            'id',
            'partner',
            'agency',
            'agency_id',
            'business_area',
            'business_area_display',
            'number',
        )
        create_only_fields = (
            'partner',
        )

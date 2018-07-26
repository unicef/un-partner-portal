from rest_framework import serializers

from common.defaults import CurrentUserAgencyDefault
from common.mixins import CreateOnlyFieldsMixin
from externals.models import PartnerVendorNumber
from partner.models import Partner


class PartnerVendorNumberSerializer(CreateOnlyFieldsMixin, serializers.ModelSerializer):

    agency = serializers.HiddenField(default=serializers.CreateOnlyDefault(CurrentUserAgencyDefault()))
    partner = serializers.PrimaryKeyRelatedField(queryset=Partner.objects.all())

    class Meta:
        model = PartnerVendorNumber
        fields = (
            'id',
            'partner',
            'agency',
            'number',
        )
        create_only_fields = (
            'partner',
        )

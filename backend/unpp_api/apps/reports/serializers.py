from rest_framework import serializers

from common.serializers import PointSerializer
from partner.models import Partner
from project.models import EOI


class PartnerProfileReportSerializer(serializers.ModelSerializer):

    country = serializers.CharField(source='get_country_code_display')
    organization_type = serializers.CharField(source='get_display_type_display')
    agency_experiences = serializers.SerializerMethodField()
    offices = serializers.SerializerMethodField()

    class Meta:
        model = Partner
        fields = (
            'id',
            'legal_name',
            'organization_type',
            'country',
            'office_count',
            'agency_experiences',
            'offices',
        )

    def get_agency_experiences(self, partner: Partner):
        return partner.collaborations_partnership.values_list('agency__name', flat=True).distinct()

    def get_offices(self, partner: Partner):
        points = []
        if partner.location_of_office:
            points.append(partner.location_of_office)
        points.extend(partner.location_field_offices.all())

        return PointSerializer(points, many=True).data


class ProjectReportSerializer(serializers.ModelSerializer):

    locations = PointSerializer(many=True)
    agency = serializers.CharField(source='agency.name')

    class Meta:
        model = EOI
        fields = (
            'id',
            'title',
            'agency',
            'locations',
        )


class VerificationsAndObservationsReportSerializer(serializers.ModelSerializer):

    acronym = serializers.CharField(source='profile.acronym')
    organization_type = serializers.CharField(source='get_display_type_display')
    country = serializers.CharField(source='get_country_code_display')

    class Meta:
        model = Partner
        fields = (
            'legal_name',
            'acronym',
            'organization_type',
            'country',
            'flagging_status',
            'is_verified',
        )

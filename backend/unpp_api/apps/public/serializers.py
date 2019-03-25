from django.urls import reverse
from rest_framework import serializers

from common.models import Specialization
from project.models import EOI


class PublicSpecializationSerializer(serializers.ModelSerializer):

    category = serializers.CharField(source='category.name')

    class Meta:
        model = Specialization
        fields = (
            'name',
            'category'
        )


class PublicProjectSerializer(serializers.ModelSerializer):

    countries = serializers.SerializerMethodField()
    date_created = serializers.SerializerMethodField()
    pdf_export_url = serializers.SerializerMethodField()
    agency_name = serializers.CharField(source='agency.name')
    specializations = PublicSpecializationSerializer(many=True)

    class Meta:
        model = EOI
        fields = (
            'displayID',
            'title',
            'countries',
            'agency_name',
            'specializations',
            'date_created',
            'deadline_date',
            'pdf_export_url',
        )

    def get_countries(self, obj: EOI):
        return sorted({
            point.admin_level_1.country_name for point in obj.locations.all()
        })

    def get_date_created(self, obj: EOI):
        return obj.created.date()

    def get_pdf_export_url(self, obj: EOI):
        return reverse(
            'public:project-export', kwargs={"pk": obj.id}
        )

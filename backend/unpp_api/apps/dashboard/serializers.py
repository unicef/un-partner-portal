# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from datetime import datetime, timedelta

from django.db.models import Count

from rest_framework import serializers

from common.consts import EOI_TYPES, PARTNER_TYPES
from partner.models import Partner
from agency.models import Agency
from project.models import EOI, Application


class AgencyDashboardSerializer(serializers.ModelSerializer):

    DAYS_AGO = 15

    new_partners_last_15_count = serializers.SerializerMethodField()
    new_partners_last_15_by_day_count = serializers.SerializerMethodField()
    new_cfei_last_15_by_day_count = serializers.SerializerMethodField()
    num_cn_to_score = serializers.SerializerMethodField()
    partner_breakdown = serializers.SerializerMethodField()

    def _get_days_ago_date(self):
        date_N_days_ago = datetime.now() - timedelta(days=self.DAYS_AGO)
        return date_N_days_ago

    def get_partners_since_days_ago(self):
        return Partner.objects.filter(created__gte=self._get_days_ago_date()).exclude(hq__isnull=False)

    def get_new_partners_last_15_count(self, obj):
        return self.get_partners_since_days_ago().count()

    def get_new_partners_last_15_by_day_count(self, obj):
        all_dates = self.get_partners_since_days_ago().dates('created', 'day')
        dates_dict = {}
        for date in all_dates:
            dates_dict[str(date)] = self.get_partners_since_days_ago().filter(created__contains=date).count()

        return dates_dict

    def get_new_cfei_last_15_by_day_count(self, obj):
        return EOI.objects.filter(created__gte=self._get_days_ago_date(),
                                  display_type=EOI_TYPES.open).count()


    def get_num_cn_to_score(self, obj):
        user = self.context['request'].user
        open_eois_as_reviewer = user.eoi_as_reviewer.filter(completed_reason=None,
                                                            completed_date=None)

        applications = Application.objects.filter(eoi__in=open_eois_as_reviewer).exclude(assessments__reviewer=user)
        return applications.count()


    def get_partner_breakdown(self, obj):
        return {
            PARTNER_TYPES.cbo: Partner.objects.filter(display_type=PARTNER_TYPES.cbo).count(),
            PARTNER_TYPES.national: Partner.objects.filter(display_type=PARTNER_TYPES.national).count(),
            PARTNER_TYPES.international: Partner.objects.filter(display_type=PARTNER_TYPES.international).exclude(hq__isnull=False).count(),
            PARTNER_TYPES.academic: Partner.objects.filter(display_type=PARTNER_TYPES.academic).count(),
            PARTNER_TYPES.red_cross: Partner.objects.filter(display_type=PARTNER_TYPES.red_cross).count(),

        }

    class Meta:
        model = Agency
        fields = "__all__"

class PartnerDashboardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Partner
        fields = "__all__"

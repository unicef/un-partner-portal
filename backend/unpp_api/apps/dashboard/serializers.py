# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from datetime import datetime, date, timedelta

from django.db.models import Count
from rest_framework import serializers

from common.consts import EOI_TYPES, PARTNER_TYPES
from common.mixins import PartnerIdsMixin
from common.models import Sector
from partner.models import Partner
from agency.models import Agency
from project.models import EOI, Application, Pin


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
        for _date in all_dates:
            dates_dict[str(_date)] = self.get_partners_since_days_ago().filter(created__contains=_date).count()

        return dates_dict

    def get_new_cfei_last_15_by_day_count(self, obj):
        return EOI.objects.filter(created__gte=self._get_days_ago_date(),
                                  display_type=EOI_TYPES.open).count()

    def get_num_cn_to_score(self, obj):
        user = self.context['request'].user
        open_eois_as_reviewer = user.eoi_as_reviewer.filter(completed_reason=None,
                                                            completed_date=None)

        applications = Application.objects.filter(
            eoi__in=open_eois_as_reviewer).exclude(assessments__reviewer=user)
        return applications.count()

    def get_partner_breakdown(self, obj):
        return {
            PARTNER_TYPES.cbo: Partner.objects.filter(display_type=PARTNER_TYPES.cbo).count(),
            PARTNER_TYPES.national: Partner.objects.filter(display_type=PARTNER_TYPES.national).count(),
            PARTNER_TYPES.international: Partner.objects.filter(
                display_type=PARTNER_TYPES.international).exclude(hq__isnull=False).count(),
            PARTNER_TYPES.academic: Partner.objects.filter(display_type=PARTNER_TYPES.academic).count(),
            PARTNER_TYPES.red_cross: Partner.objects.filter(display_type=PARTNER_TYPES.red_cross).count(),

        }

    class Meta:
        model = Agency
        fields = ('new_partners_last_15_count',
                  'new_partners_last_15_by_day_count',
                  'new_cfei_last_15_by_day_count',
                  'num_cn_to_score',
                  'partner_breakdown',)


class PartnerDashboardSerializer(PartnerIdsMixin, serializers.ModelSerializer):

    DAYS_AGO = 10

    new_cfei_by_sectors_last_days_ago = serializers.SerializerMethodField()
    num_of_submitted_cn = serializers.SerializerMethodField()
    num_of_pinned_cfei = serializers.SerializerMethodField()
    num_of_awards = serializers.SerializerMethodField()
    last_profile_update = serializers.DateTimeField(source='last_update_timestamp', read_only=True, allow_null=True)

    class Meta:
        model = Partner
        fields = (
            'new_cfei_by_sectors_last_days_ago',
            'num_of_submitted_cn',
            'num_of_pinned_cfei',
            'num_of_awards',
            'last_profile_update',
        )

    def get_new_cfei_by_sectors_last_days_ago(self, obj):
        cfei_new = EOI.objects.filter(
            start_date__gte=(date.today()-timedelta(days=self.DAYS_AGO))
        ).values_list('specializations__category__name', 'id').distinct()
        mapped = map(lambda x: x[0], cfei_new)
        result = {}
        for sector in Sector.objects.all():
            result[sector.name] = mapped.count(sector.name)
        return result

    def get_num_of_submitted_cn(self, obj):
        details = Agency.objects.filter(applications__partner_id__in=self.get_partner_ids()).annotate(
            count=Count('applications')).values('name', 'count')
        count = 0
        if len(details) > 0:
            count = reduce(lambda x, y: x + y, map(lambda x: x['count'], details))
        return {
            'details': details,
            'count': count
        }

    def get_num_of_pinned_cfei(self, obj):
        today = date.today()
        return Pin.objects.filter(
            eoi__deadline_date__range=(today, today + timedelta(days=self.DAYS_AGO)),
            partner_id__in=self.get_partner_ids(),
        ).order_by().distinct('eoi').count()

    def get_num_of_awards(self, obj):
        return Application.objects.filter(did_win=True, partner_id__in=self.get_partner_ids()).count()

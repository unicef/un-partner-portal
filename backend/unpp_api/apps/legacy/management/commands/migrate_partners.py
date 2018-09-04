from __future__ import absolute_import

from django.apps import apps
from django.core.management.base import BaseCommand
from django.utils import timezone

from legacy import models
from partner.models import Partner


class Command(BaseCommand):

    # Just to detect whether some data has been unintentionally omitted
    models_assumed_empty = {
        models.AgencyAgency,
        models.AgencyAgencymember,
        models.AgencyAgencyoffice,
        models.AgencyAgencyprofile,
        models.AgencyOtheragency,
        models.PartnerPartnerLocationFieldOffices,
        models.PartnerPartnerauditreport,
        models.PartnerPartnercapacityassessment,
        models.PartnerPartnercollaborationpartnership,
        models.PartnerPartnerdirector,
        models.PartnerPartnerexperience,
        models.PartnerPartnerheadorganization,
        models.PartnerPartnerinternalcontrol,
        models.PartnerPartnermandatemission,
        models.PartnerPartnermember,
        models.PartnerPartnerotherinfo,
        models.PartnerPartnerpolicyarea,
        models.PartnerPartnerreporting,
        models.PartnerPartnerreview,
    }

    def check_empty_models(self):
        all_models = apps.get_app_config('legacy').get_models()
        for legacy_model in all_models:
            if legacy_model.objects.exists() and legacy_model in self.models_assumed_empty:
                self.stderr.write(f'Model {legacy_model} assumed empty has existing entries!')

    def migrate_partner(self, external_partner: models.PartnerPartner):
        self.stdout.write(f'Migrating {external_partner.pk} - {external_partner.legal_name}')
        hq = self.migrate_partner(
            models.PartnerPartner.objects.get(id=external_partner.hq_id)
        ) if external_partner.hq_id else None

        partner, created = Partner.objects.update_or_create(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=external_partner.id,
            defaults={
                'created': external_partner.created,
                'modified': external_partner.modified,
                'legal_name': external_partner.legal_name,
                'display_type': external_partner.display_type,
                'country_code': external_partner.country_code,
                'is_active': external_partner.is_active,
                'hq': hq,
                'staff_globally': external_partner.staff_globally,
                'engagement_operate_desc': external_partner.engagement_operate_desc,
                'staff_in_country': external_partner.staff_in_country,
                'more_office_in_country': external_partner.more_office_in_country,
                'is_locked': False,
            }
        )
        if created:
            partner.migrated_timestamp = timezone.now()
            partner.save()
        return partner

    def handle(self, *args, **options):
        self.check_empty_models()

        for external_partner in models.PartnerPartner.objects.all():
            self.migrate_partner(external_partner)

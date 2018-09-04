from __future__ import absolute_import

from django.apps import apps
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.utils import timezone

from common.consts import BUDGET_CHOICES
from legacy import models as legacy_models
from partner.models import (
    Partner,
    PartnerAuditAssessment,
    PartnerAuthorisedOfficer,
    PartnerBudget,
    PartnerCollaborationEvidence,
    PartnerFunding,
)


class Command(BaseCommand):

    # Just to detect whether some data has been unintentionally omitted
    models_assumed_empty = {
        legacy_models.AgencyAgency,
        legacy_models.AgencyAgencymember,
        legacy_models.AgencyAgencyoffice,
        legacy_models.AgencyAgencyprofile,
        legacy_models.AgencyOtheragency,
        legacy_models.PartnerPartnerLocationFieldOffices,
        legacy_models.PartnerPartnerauditreport,
        legacy_models.PartnerPartnercapacityassessment,
        legacy_models.PartnerPartnercollaborationpartnership,
        legacy_models.PartnerPartnerdirector,
        legacy_models.PartnerPartnerexperience,
        legacy_models.PartnerPartnerheadorganization,
        legacy_models.PartnerPartnerinternalcontrol,
        legacy_models.PartnerPartnermandatemission,
        legacy_models.PartnerPartnermember,
        legacy_models.PartnerPartnerotherinfo,
        legacy_models.PartnerPartnerpolicyarea,
        legacy_models.PartnerPartnerreporting,
        legacy_models.PartnerPartnerreview,
    }
    dummy_user = None

    def check_empty_models(self):
        all_models = apps.get_app_config('legacy').get_models()
        for legacy_model in all_models:
            if legacy_model.objects.exists() and legacy_model in self.models_assumed_empty:
                self.stderr.write(f'Model {legacy_model} assumed empty has existing entries!')

    def migrate_partner(self, source: legacy_models.PartnerPartner):
        self.stdout.write(f'Migrating {source.pk} - {source.legal_name}')
        hq = self.migrate_partner(
            legacy_models.PartnerPartner.objects.get(id=source.hq_id)
        ) if source.hq_id else None

        partner, created = Partner.objects.update_or_create(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.id,
            defaults={
                'created': source.created,
                'modified': source.modified,
                'legal_name': source.legal_name,
                'display_type': source.display_type,
                'country_code': source.country_code,
                'is_active': source.is_active,
                'hq': hq,
                'country_presence': source.country_presence.split(',') if source.country_presence else [],
                'staff_globally': source.staff_globally,
                'engagement_operate_desc': source.engagement_operate_desc,
                'staff_in_country': source.staff_in_country,
                'more_office_in_country': source.more_office_in_country,
                'is_locked': False,
            }
        )

        if created:
            partner.migrated_timestamp = timezone.now()
            partner.save()
        return partner

    def migrate_audit(self, source: legacy_models.PartnerPartnerauditassessment):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.partner_id,
        )
        self.stdout.write(f'Migrating PartnerAuditAssessment {source.pk} for {partner}')

        PartnerAuditAssessment.objects.update_or_create(
            partner=partner,
            defaults={
                'created': source.created,
                'modified': source.modified,
                'regular_audited': source.regular_audited,
                'regular_audited_comment': source.regular_audited_comment,
                'major_accountability_issues_highlighted': source.major_accountability_issues_highlighted,
                'comment': source.comment,
                'regular_capacity_assessments': source.regular_capacity_assessments,
            }
        )

    def migrate_authorised_officer(self, source: legacy_models.PartnerPartnerauthorisedofficer):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.partner_id,
        )
        self.stdout.write(f'Migrating PartnerAuthorisedOfficer {source.pk} for {partner}')

        PartnerAuthorisedOfficer.objects.update_or_create(
            partner=partner,
            defaults={
                'created': source.created,
                'modified': source.modified,
                'fullname': source.fullname,
                'job_title': source.job_title,
                'telephone': source.telephone,
                'email': source.email,
                'fax': source.fax,
            }
        )

    def migrate_budget_info(self, source: legacy_models.PartnerPartnerbudget):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.partner_id,
        )
        self.stdout.write(f'Migrating PartnerBudget {source.pk} for {partner}')

        if source.budget not in BUDGET_CHOICES._db_values:
            self.stderr.write(f'{source.budget} is not a valid budget value. Skipping.')
            return

        PartnerBudget.objects.update_or_create(
            partner=partner,
            defaults={
                'created': source.created,
                'modified': source.modified,
                'year': source.year,
                'budget': source.budget,
            }
        )

    def migrate_collaboration_evidence(self, source: legacy_models.PartnerPartnercollaborationevidence):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.partner_id,
        )
        self.stdout.write(f'Migrating PartnerCollaborationEvidence {source.pk} for {partner}')

        PartnerCollaborationEvidence.objects.update_or_create(
            partner=partner,
            defaults={
                'created': source.created,
                'modified': source.modified,
                'date_received': source.date_received,
                'organization_name': source.organization_name,
                'created_by': self.dummy_user,
            }
        )

    def migrate_partner_funding(self, source: legacy_models.PartnerPartnerfunding):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.partner_id,
        )
        self.stdout.write(f'Migrating PartnerFunding {source.pk} for {partner}')

        PartnerFunding.objects.update_or_create(
            partner=partner,
            defaults={
                'created': source.created,
                'modified': source.modified,
                'source_core_funding': source.source_core_funding,
                'major_donors': source.major_donors.split(',') if source.major_donors else [],
                'main_donors_list': source.main_donors_list,
            }
        )

    def handle(self, *args, **options):
        self.check_empty_models()
        # Need this for models that require a creator
        self.dummy_user, _ = get_user_model().objects.update_or_create(
            email='DummyUNHCRUserMigrationSource',
            defaults={
                'fullname': 'Imported from UNHCR database',
                'is_active': False,
            }
        )

        for external_partner in legacy_models.PartnerPartner.objects.all():
            self.migrate_partner(external_partner)

        for audit_assessment in legacy_models.PartnerPartnerauditassessment.objects.all():
            self.migrate_audit(audit_assessment)

        for authorised_officer in legacy_models.PartnerPartnerauthorisedofficer.objects.all():
            self.migrate_authorised_officer(authorised_officer)

        for budget_info in legacy_models.PartnerPartnerbudget.objects.all():
            self.migrate_budget_info(budget_info)

        for collaboration_evidence in legacy_models.PartnerPartnercollaborationevidence.objects.all():
            self.migrate_collaboration_evidence(collaboration_evidence)

        for partner_funding in legacy_models.PartnerPartnerfunding.objects.all():
            self.migrate_partner_funding(partner_funding)

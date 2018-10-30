from __future__ import absolute_import

from django.apps import apps
from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils import timezone

from agency.agencies import UNHCR
from common.consts import BUDGET_CHOICES
from common.factories import get_new_common_file
from legacy import models as legacy_models
from partner.models import (
    Partner,
    PartnerAuditAssessment,
    PartnerAuthorisedOfficer,
    PartnerBudget,
    PartnerCollaborationEvidence,
    PartnerFunding,
    PartnerMailingAddress,
    PartnerProfile,
    PartnerRegistrationDocument,
    PartnerCollaborationPartnership,
    PartnerMandateMission,
    PartnerInternalControl,
    PartnerPolicyArea,
    PartnerAuditReport,
    PartnerExperience,
    PartnerMember,
)
from externals.models import PartnerVendorNumber


def clean_value(value):
    if hasattr(value, 'strip'):
        value = value.strip()
    return value or None


class Command(BaseCommand):

    # Just to detect whether some data has been unintentionally omitted
    models_assumed_empty = {
        legacy_models.AgencyAgency,
        legacy_models.AgencyAgencymember,
        legacy_models.AgencyAgencyoffice,
        legacy_models.AgencyAgencyprofile,
        legacy_models.AgencyOtheragency,
        legacy_models.PartnerPartnerLocationFieldOffices,
        legacy_models.PartnerPartnercapacityassessment,
        legacy_models.PartnerPartnerdirector,
        legacy_models.PartnerPartnerheadorganization,
        legacy_models.PartnerPartnermember,
        legacy_models.PartnerPartnerotherinfo,
        legacy_models.PartnerPartnerreporting,
        legacy_models.PartnerPartnerreview,
    }
    dummy_user = None

    def check_empty_models(self):
        all_models = apps.get_app_config('legacy').get_models()
        non_empty_models = []
        for legacy_model in all_models:
            if legacy_model.objects.exists() and legacy_model in self.models_assumed_empty:
                non_empty_models.append(legacy_model)

        if non_empty_models:
            raise Exception(
                f'Models:\n{non_empty_models}\nassumed empty have existing entries! '
                f'Update migration code to handle those!'
            )

    def migrate_partner(self, source: legacy_models.PartnerPartner):
        self.stdout.write(f'Migrating {source.pk} - {source.legal_name}')
        hq = self.migrate_partner(
            legacy_models.PartnerPartner.objects.get(id=source.hq_id)
        ) if source.hq_id else None

        legal_name_postfix = ''
        other_partners_with_same_name_in_country_count = Partner.objects.filter(
            legal_name=source.legal_name,
            country_code=source.country_code,
        ).exclude(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.id
        ).count()
        if other_partners_with_same_name_in_country_count > 0:
            legal_name_postfix = f' #{other_partners_with_same_name_in_country_count + 1}'

        partner, created = Partner.objects.update_or_create(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.id,
            defaults={
                'created': source.created,
                'modified': source.modified,
                'legal_name': source.legal_name + legal_name_postfix,
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

        defaults = {
            'fullname': clean_value(source.fullname),
            'job_title': clean_value(source.job_title),
            'telephone': clean_value(source.telephone),
            'email': clean_value(source.email),
            'fax': clean_value(source.fax),
        }

        if not any(defaults.values()):
            self.stderr.write('Empty PartnerAuthorisedOfficer data, skipping...')
            return

        defaults['created'] = source.created
        defaults['modified'] = source.modified
        defaults['created_by'] = self.dummy_user

        PartnerAuthorisedOfficer.objects.update_or_create(
            partner=partner,
            telephone=defaults.pop('telephone'),
            email=defaults.pop('email'),
            defaults=defaults
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
            year=source.year,
            defaults={
                'created': source.created,
                'modified': source.modified,
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

    def migrate_mailing_address(self, source: legacy_models.PartnerPartnermailingaddress):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.partner_id,
        )
        self.stdout.write(f'Migrating PartnerMailingAddress {source.pk} for {partner}')

        PartnerMailingAddress.objects.update_or_create(
            partner=partner,
            defaults={
                'created': source.created,
                'modified': source.modified,
                'mailing_type': source.mailing_type,
                'street': source.street,
                'po_box': source.po_box,
                'city': source.city,
                'country': source.country,
                'zip_code': source.zip_code,
                'telephone': source.telephone,
                'fax': source.fax,
                'website': source.website,
                'org_email': source.org_email,
            }
        )

    def migrate_profile(self, source: legacy_models.PartnerPartnerprofile):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.partner_id,
        )
        self.stdout.write(f'Migrating PartnerProfile {source.pk} for {partner}')

        profile, _ = PartnerProfile.objects.update_or_create(
            partner=partner,
            defaults={
                'created': source.created,
                'modified': source.modified,
                'alias_name': source.alias_name,
                'acronym': source.acronym,
                'legal_name_change': source.legal_name_change,
                'former_legal_name': source.former_legal_name,
                'connectivity': source.connectivity,
                'connectivity_excuse': source.connectivity_excuse,
                'working_languages': source.working_languages.split(',') if source.working_languages else [],
                'working_languages_other': source.working_languages_other,
                'have_board_directors': source.have_board_directors,
                'have_authorised_officers': source.have_authorised_officers,
                'year_establishment': source.year_establishment,
                'have_governing_document': source.have_gov_doc,
                'registered_to_operate_in_country': source.registration_to_operate_in_country,
                'missing_registration_document_comment': source.registration_comment,
                'have_management_approach': source.have_management_approach,
                'management_approach_desc': source.management_approach_desc,
                'have_system_monitoring': source.have_system_monitoring,
                'system_monitoring_desc': source.system_monitoring_desc,
                'have_feedback_mechanism': source.have_feedback_mechanism,
                'feedback_mechanism_desc': source.feedback_mechanism_desc,
                'org_acc_system': source.org_acc_system,
                'method_acc': source.method_acc,
                'have_system_track': source.have_system_track,
                'financial_control_system_desc': source.financial_control_system_desc,
                'experienced_staff': source.experienced_staff,
                'experienced_staff_desc': source.experienced_staff_desc,
                'partnership_collaborate_institution': source.partnership_collaborate_institution,
                'partnership_collaborate_institution_desc': source.partnership_collaborate_institution_desc,
                'any_partnered_with_un': source.any_partnered_with_un,
                'any_accreditation': source.any_accreditation,
                'any_reference': source.any_reference,
                'have_bank_account': source.have_bank_account,
                'have_separate_bank_account': source.have_separate_bank_account,
                'explain': source.explain,
            }
        )

        dummy_registration_document = get_new_common_file()
        dummy_registration_document.file_field.save('dummy_registration_doc.txt', ContentFile(
            'Placeholder registration document for imported registration number.'
        ))
        PartnerRegistrationDocument.objects.update_or_create(
            profile=profile,
            defaults={
                'created': source.created,
                'modified': source.modified,
                'created_by': self.dummy_user,
                'registration_number': source.registration_number,
                'issue_date': source.created,
                'document': dummy_registration_document,
            }
        )

    def migrate_vendor_numbers(self, source: legacy_models.PartnerPartnerVendorNumber):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.partner_id,
        )
        self.stdout.write(f'Migrating PartnerPartnerVendorNumber {source.pk} for {partner}')

        PartnerVendorNumber.objects.update_or_create(
            partner=partner,
            defaults={
                'created': source.created,
                'modified': source.modified,
                'agency': UNHCR.model_instance,
                'number': source.number,
            }
        )

    def migrate_collaborations_partnerships(self, source: legacy_models.PartnerPartnercollaborationpartnership):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.partner_id,
        )
        self.stdout.write(f'Migrating PartnerPartnercollaborationpartnership {source.pk} for {partner}')
        partner.profile.any_partnered_with_un = True
        partner.profile.save()

        PartnerCollaborationPartnership.objects.update_or_create(
            partner=partner,
            created_by=self.dummy_user,
            defaults={
                'created': source.created,
                'modified': source.modified,
                'agency': UNHCR.model_instance,
                'description': source.description,
            }
        )

    def migrate_mandate_mission(self, source: legacy_models.PartnerPartnermandatemission):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.partner_id,
        )
        self.stdout.write(f'Migrating PartnerPartnermandatemission {source.pk} for {partner}')

        PartnerMandateMission.objects.update_or_create(
            partner=partner,
            defaults={
                'created': source.created,
                'modified': source.modified,
                'background_and_rationale': source.background_and_rationale,
                'mandate_and_mission': source.mandate_and_mission,
            }
        )

    def migrate_internal_control(self, source: legacy_models.PartnerPartnerinternalcontrol):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.partner_id,
        )
        self.stdout.write(f'Migrating PartnerPartnerinternalcontrol {source.pk} for {partner}')

        PartnerInternalControl.objects.update_or_create(
            partner=partner,
            functional_responsibility=source.functional_responsibility,
            defaults={
                'created': source.created,
                'modified': source.modified,
                'segregation_duties': source.segregation_duties,
                'comment': source.comment,
            }
        )

    def migrate_policy_area(self, source: legacy_models.PartnerPartnerpolicyarea):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.partner_id,
        )
        self.stdout.write(f'Migrating PartnerPartnerpolicyarea {source.pk} for {partner}')

        PartnerPolicyArea.objects.update_or_create(
            partner=partner,
            area=source.area,
            defaults={
                'created_by': self.dummy_user,
                'created': source.created,
                'modified': source.modified,
                'document_policies': source.document_policies,
            }
        )

    def migrate_audit_reports(self, source: legacy_models.PartnerPartnerauditreport):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.partner_id,
        )
        self.stdout.write(f'Migrating PartnerPartnerauditreport {source.pk} for {partner}')

        PartnerAuditReport.objects.update_or_create(
            partner=partner,
            created=source.created,
            defaults={
                'created_by': self.dummy_user,
                'modified': source.modified,
                'org_audit': source.org_audit,
                'link_report': source.link_report,
            }
        )

    def migrate_experience(self, source: legacy_models.PartnerPartnerexperience):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.partner_id,
        )
        self.stdout.write(f'Migrating PartnerPartnerexperience {source.pk} for {partner}')

        PartnerExperience.objects.update_or_create(
            partner=partner,
            created=source.created,
            defaults={
                'created_by': self.dummy_user,
                'modified': source.modified,
                'years': source.years,
                'specialization_id': source.specialization_id,
            }
        )

    def migrate_user(self, source: legacy_models.PartnerUser):
        partner = Partner.objects.get(
            migrated_from=Partner.SOURCE_UNHCR,
            migrated_original_id=source.ProfileID,
        )
        self.stdout.write(f'Migrating PartnerUser {source.UserID} for {partner}')

        user, _ = get_user_model().objects.get_or_create(
            email=source.Username,
            defaults={
                'fullname': f'{source.FirstName} {source.LastName}' if source.FirstName else 'N/A',
                'date_joined': source.ValidFrom,
            }
        )
        user.set_unusable_password()
        user.save()

        PartnerMember.objects.get_or_create(
            user=user,
            partner=partner,
            defaults={
                'title': 'Member'
            }
        )

    def _migrate_model(self, migrate_function, model):
        for obj in model.objects.all():
            migrate_function(obj)

    def handle(self, *args, **options):
        self.stdout.write('Start data mgiration')
        self.check_empty_models()
        # Need this for models that require a creator
        self.dummy_user, _ = get_user_model().objects.update_or_create(
            email='DummyUNHCRUserMigrationSource',
            defaults={
                'fullname': 'Imported from UNHCR database',
                'is_active': False,
            }
        )

        self._migrate_model(self.migrate_partner, legacy_models.PartnerPartner)
        self._migrate_model(self.migrate_audit, legacy_models.PartnerPartnerauditassessment)
        self._migrate_model(self.migrate_authorised_officer, legacy_models.PartnerPartnerauthorisedofficer)
        self._migrate_model(self.migrate_budget_info, legacy_models.PartnerPartnerbudget)
        self._migrate_model(self.migrate_collaboration_evidence, legacy_models.PartnerPartnercollaborationevidence)
        self._migrate_model(self.migrate_mailing_address, legacy_models.PartnerPartnermailingaddress)
        self._migrate_model(self.migrate_profile, legacy_models.PartnerPartnerprofile)
        self._migrate_model(self.migrate_vendor_numbers, legacy_models.PartnerPartnerVendorNumber)
        self._migrate_model(
            self.migrate_collaborations_partnerships, legacy_models.PartnerPartnercollaborationpartnership
        )
        self._migrate_model(self.migrate_mandate_mission, legacy_models.PartnerPartnermandatemission)
        self._migrate_model(self.migrate_internal_control, legacy_models.PartnerPartnerinternalcontrol)
        self._migrate_model(self.migrate_policy_area, legacy_models.PartnerPartnerpolicyarea)
        self._migrate_model(self.migrate_audit_reports, legacy_models.PartnerPartnerauditreport)
        self._migrate_model(self.migrate_experience, legacy_models.PartnerPartnerexperience)
        self._migrate_model(self.migrate_user, legacy_models.PartnerUser)

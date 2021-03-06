# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import logging
import warnings
from datetime import date
from operator import attrgetter

from cached_property import threaded_cached_property
from django.conf import settings
from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ObjectDoesNotExist
from django.core.validators import MinValueValidator, MinLengthValidator
from django.db import models
from django.db.models import Q, Count
from django.db.models.signals import post_save
from django_countries.fields import Country
from model_utils.models import TimeStampedModel

from account.models import User
from common.base_models import MigratedTimeStampedModel
from common.consts import (
    SATISFACTION_SCALES,
    PARTNER_REVIEW_TYPES,
    PARTNER_TYPES,
    COLLABORATION_EVIDENCE_MODES,
    METHOD_ACC_ADOPTED_CHOICES,
    FINANCIAL_CONTROL_SYSTEM_CHOICES,
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    WORKING_LANGUAGES_CHOICES,
    MAILING_TYPES,
    YEARS_OF_EXP_CHOICES,
    CONCERN_CHOICES,
    STAFF_GLOBALLY_CHOICES,
    PARTNER_DONORS_CHOICES,
    POLICY_AREA_CHOICES,
    ORG_AUDIT_CHOICES,
    AUDIT_ASSESSMENT_CHOICES,
    BUDGET_CHOICES,
    FLAG_TYPES,
    FLAG_CATEGORIES,
)
from common.countries import COUNTRIES_ALPHA2_CODE
from common.database_fields import FixedTextField
from common.validators import max_current_year_validator, past_date_validator, \
    future_date_validator
from partner.roles import PartnerRole, PARTNER_ROLE_PERMISSIONS
from review.models import PartnerFlag

logger = logging.getLogger(__name__)


class Partner(MigratedTimeStampedModel):
    legal_name = models.TextField(max_length=255, validators=[
        MinLengthValidator(1),
    ], db_index=True)
    legal_name_length = models.IntegerField(
        default=0, editable=False, db_index=True
    )  # Maintained in DB, see migration 0091
    display_type = models.CharField(max_length=3, choices=PARTNER_TYPES, verbose_name='Organization Type')
    hq = models.ForeignKey('self', null=True, blank=True, related_name='children')
    country_code = models.CharField(max_length=2, choices=COUNTRIES_ALPHA2_CODE)
    is_active = models.BooleanField(default=True)
    is_locked = models.BooleanField(default=False, verbose_name='Locked and Marked for Deletion')
    # hq information
    country_presence = ArrayField(
        models.CharField(max_length=2, choices=COUNTRIES_ALPHA2_CODE),
        default=list,
        null=True,
        blank=True,
    )
    staff_globally = models.CharField(max_length=3, choices=STAFF_GLOBALLY_CHOICES, null=True, blank=True)
    # country profile information
    location_of_office = models.ForeignKey('common.Point', related_name="location_of_offices", null=True, blank=True)
    more_office_in_country = models.NullBooleanField()
    location_field_offices = models.ManyToManyField('common.Point', related_name="location_field_offices", blank=True)
    staff_in_country = models.CharField(max_length=3, choices=STAFF_GLOBALLY_CHOICES, null=True, blank=True)
    engagement_operate_desc = models.TextField(
        verbose_name="Briefly describe the organization's engagement with the communities in which you operate",
        null=True, blank=True
    )

    declaration = models.ForeignKey('common.CommonFile', null=True, blank=True)

    class Meta:
        ordering = ('legal_name', 'country_code')
        unique_together = (
            'legal_name', 'country_code', 'hq'
        )

    def __str__(self):
        return f"[{self.pk}] {self.legal_name} ({self.display_type}) in {self.get_country_code_display()}"

    @property
    def is_international(self):
        return self.display_type == PARTNER_TYPES.international

    @property
    def is_hq(self):
        if self.is_international:
            return self.hq in [None, '']
        return None

    @property
    def country_of_origin(self):
        return self.hq.country_code if self.hq else self.country_code

    @property
    def is_country_profile(self):
        if self.is_international:
            return self.hq not in [None, '']
        return None

    @property
    def country_profiles(self):
        return self.__class__.objects.filter(hq=self)

    @property
    def office_count(self):
        return 1 if not self.more_office_in_country else 1 + self.location_field_offices.count()

    @property
    def yellow_flag_count(self):
        return PartnerFlag.objects.filter(
            Q(partner=self) | Q(partner=self.hq)
        ).filter(flag_type=FLAG_TYPES.yellow).exclude(is_valid=False).count()

    @property
    def has_yellow_flag(self):
        return bool(self.yellow_flag_count)

    @property
    def red_flag_count(self):
        return PartnerFlag.objects.filter(
            Q(partner=self) | Q(partner=self.hq)
        ).filter(flag_type=FLAG_TYPES.red).exclude(is_valid=False).count()

    @property
    def has_red_flag(self):
        return bool(self.red_flag_count)

    @property
    def escalated_flag_count(self):
        return PartnerFlag.objects.filter(
            Q(partner=self) | Q(partner=self.hq)
        ).filter(flag_type=FLAG_TYPES.escalated).count()

    @property
    def has_escalated_flag(self):
        return bool(self.escalated_flag_count)

    def get_users(self):
        return User.objects.filter(partner_members__partner=self)

    @property
    def is_verified(self):
        return getattr(self.verifications.order_by('created').last(), 'is_verified', None)

    @property
    def can_be_verified(self):
        return all((
            not self.hq or self.hq.is_verified,
            not self.hq or not self.hq.has_red_flag,
            not self.hq or not self.hq.has_sanction_match,
            not self.has_red_flag,
            not self.has_sanction_match,
        ))

    @property
    def has_sanction_match(self):
        return self.sanction_matches.filter(can_ignore=False).exists()

    @property
    def has_potential_sanction_match(self):
        return self.flags.filter(
            flag_type=FLAG_TYPES.yellow, category=FLAG_CATEGORIES.sanctions_match, is_valid=None
        ).exists()

    @property
    def flagging_status(self):
        mapping = dict(PartnerFlag.objects.filter(
            Q(partner=self) | Q(partner=self.hq)
        ).exclude(is_valid=False).values_list('flag_type').annotate(Count('id')).order_by())

        return {
            'observation': mapping.get(FLAG_TYPES.observation, 0),
            'yellow': mapping.get(FLAG_TYPES.yellow, 0),
            'escalated': mapping.get(FLAG_TYPES.escalated, 0),
            'red': mapping.get(FLAG_TYPES.red, 0),
            'invalid': sum(mapping.values()),
        }

    @property
    def registration_declaration(self):
        return getattr(self.hq, 'declaration', self.declaration)

    @property
    def profile_is_complete(self):
        if not self.profile.identification_is_complete:
            return False
        if not self.profile.contact_is_complete:
            return False
        if not self.profile.mandatemission_complete:
            return False
        if not self.profile.funding_complete:
            return False
        if not self.profile.collaboration_complete:
            return False
        if not self.profile.project_implementation_is_complete:
            return False
        if not self.profile.other_info_is_complete:
            return False
        return True

    @property
    def has_finished(self):
        warnings.warn(
            'Partner.has_finished will be removed in the future, use Partner.profile_is_complete',
            PendingDeprecationWarning
        )
        return self.profile_is_complete

    @property
    def org_head(self):
        return self.organisation_heads.order_by('-created').first()

    @property
    def country(self):
        return Country(self.country_code)

    @property
    def country_iso_alpha2(self):
        return Country(self.country_code).code

    @property
    def country_iso_alpha3(self):
        return Country(self.country_code).alpha3

    @property
    def last_update_timestamp(self):
        timestamp_fields = [
            'org_head.modified', 'profile.modified', 'mailing_address.modified', 'audit.modified', 'report.modified',
            'mandate_mission.modified', 'fund.modified', 'other_info.modified'
        ]

        update_timestamps = [
            self.modified,
        ]
        for field_name in timestamp_fields:
            try:
                update_timestamps.append(attrgetter(field_name)(self))
            except (ObjectDoesNotExist, AttributeError):
                pass

        update_timestamps.extend(self.directors.values_list("modified", flat=True))
        update_timestamps.extend(self.authorised_officers.values_list("modified", flat=True))
        update_timestamps.extend(self.area_policies.values_list("modified", flat=True))
        update_timestamps.extend(self.experiences.values_list("modified", flat=True))
        update_timestamps.extend(self.internal_controls.values_list("modified", flat=True))
        update_timestamps.extend(self.budgets.values_list("modified", flat=True))
        update_timestamps.extend(self.collaborations_partnership.values_list("modified", flat=True))
        update_timestamps.extend(self.collaboration_evidences.values_list("modified", flat=True))

        update_timestamps.sort()
        return update_timestamps[-1]


class PartnerProfile(TimeStampedModel):
    partner = models.OneToOneField(Partner, related_name="profile")
    alias_name = models.CharField(max_length=255, null=True, blank=True)
    acronym = models.CharField(max_length=200, null=True, blank=True)
    legal_name_change = models.NullBooleanField()
    former_legal_name = models.CharField(max_length=255, null=True, blank=True)
    connectivity = models.NullBooleanField(
        verbose_name='Does the organization have reliable access to internet in all of its operations?'
    )
    connectivity_excuse = models.CharField(max_length=5000, null=True, blank=True)
    working_languages = ArrayField(
        models.CharField(max_length=3, choices=WORKING_LANGUAGES_CHOICES),
        default=list,
        null=True
    )
    working_languages_other = models.CharField(max_length=100, null=True, blank=True)
    # authorised_officials
    have_board_directors = models.NullBooleanField(
        verbose_name="Does your organization have a board of director(s)?"
    )
    have_authorised_officers = models.NullBooleanField(
        verbose_name="Does your organization have any other authorized officers who are not listed above?"
    )

    # Registration of organization
    year_establishment = models.PositiveSmallIntegerField(
        'Year of establishment',
        help_text="Enter valid year.",
        null=True,
        blank=True,
        validators=(
            max_current_year_validator,
            MinValueValidator(1800),  # red cross since 1863 year
        )
    )
    have_governing_document = models.NullBooleanField(verbose_name='Does the organization have a government document?')
    missing_governing_document_comment = models.TextField(max_length=5000, null=True, blank=True)

    registered_to_operate_in_country = models.NullBooleanField()
    missing_registration_document_comment = models.TextField(max_length=5000, null=True, blank=True)

    # programme management
    have_management_approach = models.NullBooleanField(
        verbose_name='Does the organization use a results-based approach to managing programmes and projects?'
    )
    management_approach_desc = models.TextField(max_length=5000, null=True, blank=True)
    have_system_monitoring = models.NullBooleanField(
        verbose_name='Does your organization have a system for monitoring and evaluating its programmes and projects?'
    )
    system_monitoring_desc = models.TextField(max_length=5000, null=True, blank=True)
    have_feedback_mechanism = models.NullBooleanField()
    feedback_mechanism_desc = models.TextField(max_length=5000, null=True, blank=True)

    # financial controls
    org_acc_system = models.CharField(
        max_length=3,
        choices=FINANCIAL_CONTROL_SYSTEM_CHOICES,
        default=FINANCIAL_CONTROL_SYSTEM_CHOICES.no_system
    )
    method_acc = models.CharField(
        max_length=3,
        choices=METHOD_ACC_ADOPTED_CHOICES,
        default=METHOD_ACC_ADOPTED_CHOICES.cash
    )
    have_system_track = models.NullBooleanField(
        verbose_name='Does your organization have a system to track expenditures, '
                     'prepare project reports, and prepare claims for donors?'
    )
    financial_control_system_desc = models.TextField(max_length=5000, null=True, blank=True)

    # internal control - other fields
    experienced_staff = models.NullBooleanField(
        verbose_name="Does the organization have an adequate number of experienced staff responsible "
                     "for financial management in all operations?"
    )
    experienced_staff_desc = models.TextField(max_length=5000, null=True, blank=True)

    # collaborate
    partnership_collaborate_institution = models.NullBooleanField(
        verbose_name='Has the organization collaborated with or a member of a cluster, professional network, '
                     'consortium or any similar institutions?'
    )
    partnership_collaborate_institution_desc = models.CharField(
        max_length=5000, null=True, blank=True,
        verbose_name='Please state which cluster, network or consortium and briefly explain the collaboration'
    )

    any_partnered_with_un = models.NullBooleanField()
    any_accreditation = models.NullBooleanField(
        verbose_name='Would you like to upload any accreditations received by your organization?'
    )
    any_reference = models.NullBooleanField(
        verbose_name='Would you like to upload any reference letters for your organization?'
    )

    # Banking Information
    have_bank_account = models.NullBooleanField(verbose_name="Does the organization have a bank account?")
    have_separate_bank_account = models.NullBooleanField(
        verbose_name="Does the organization currently maintain, or has it previously maintained, a separate, "
                     "interest-bearing account for UN funded projects that require a separate account?"
    )
    explain = models.TextField(max_length=5000, null=True, blank=True, verbose_name="Please explain")

    class Meta:
        ordering = ('-created', )

    def __str__(self):
        return f"[{self.pk}] PartnerProfile of {self.partner}"

    @property
    def registration_date(self):
        return getattr(self.registration_documents.order_by('created').last(), 'issue_date', None)

    @property
    def annual_budget(self):
        budget = self.partner.budgets.filter(year=date.today().year).first()
        if budget is not None:
            return budget.budget

    @property
    def annual_budget_display(self):
        budget = self.partner.budgets.filter(year=date.today().year).first()
        if budget is not None:
            return budget.get_budget_display()

    @property
    def identification_is_complete(self):
        conditions = [
            self.have_governing_document is not None,
            self.year_establishment,
            self.registered_to_operate_in_country is not None,
        ]

        if self.have_governing_document:
            conditions.append(self.governing_documents.exists())
        else:
            conditions.append(self.missing_governing_document_comment)

        if self.registered_to_operate_in_country:
            conditions.append(self.registration_documents.exists())
        else:
            conditions.append(self.missing_registration_document_comment)

        if self.partner.is_hq is False:
            conditions.append(self.partner.legal_name)

        return all(conditions)

    @property
    def contact_is_complete(self):
        required_fields = {
            'address': self.partner.mailing_address.street or self.partner.mailing_address.po_box,
            'city': self.partner.mailing_address.city,
            'country': self.partner.mailing_address.country,
            'telephone': self.partner.mailing_address.telephone,
            'have_board_directors': self.have_board_directors is not None,
            'have_authorised_officers': self.have_authorised_officers is not None,
            'connectivity': self.connectivity is not None,
            'connectivity_excuse': self.connectivity_excuse if self.connectivity is False else True,
            'working_languages': len(self.working_languages) > 0,
        }

        if self.have_board_directors:
            required_fields['directors'] = all([
                director.is_complete for director in self.partner.directors.all()
            ]) if self.partner.directors.exists() else False

        if self.have_authorised_officers:
            required_fields['authorised_officers'] = all([
                auth_officer.is_complete for auth_officer in self.partner.authorised_officers.all()
            ]) if self.partner.authorised_officers.exists() else False

        return all(required_fields.values())

    @property
    def mandatemission_complete(self):
        ethic_safeguard = self.partner.mandate_mission.ethic_safeguard
        ethic_safeguard_policy = self.partner.mandate_mission.ethic_safeguard_policy
        ethic_safeguard_comment = self.partner.mandate_mission.ethic_safeguard_comment
        ethic_fraud = self.partner.mandate_mission.ethic_fraud
        ethic_fraud_policy = self.partner.mandate_mission.ethic_fraud_policy
        ethic_fraud_comment = self.partner.mandate_mission.ethic_fraud_comment
        population_of_concern = self.partner.mandate_mission.population_of_concern
        required_fields = {
            'proj_background_rationale': self.partner.mandate_mission.background_and_rationale,
            'mandate_and_mission': self.partner.mandate_mission.mandate_and_mission,
            'governance_structure': self.partner.mandate_mission.governance_structure,
            'governance_hq': self.partner.mandate_mission.governance_hq,
            'ethic_safeguard': ethic_safeguard is not None,
            'ethic_safeguard_policy': ethic_safeguard_policy if ethic_safeguard is True else True,
            'ethic_safeguard_comment': ethic_safeguard_comment if ethic_safeguard is False else True,
            'ethic_fraud': ethic_fraud is not None,
            'ethic_fraud_policy': ethic_fraud_policy if ethic_fraud is True else True,
            'ethic_fraud_comment': ethic_fraud_comment,
            'population_of_concern': population_of_concern is not None,
            'concern_groups': len(self.partner.mandate_mission.concern_groups) > 0 if population_of_concern else True,
            'security_high_risk_locations': self.partner.mandate_mission.security_high_risk_locations is not None,
            'security_high_risk_policy': self.partner.mandate_mission.security_high_risk_policy is not None,
            'security_desc': self.partner.mandate_mission.security_desc,
            'staff_in_country': self.partner.staff_in_country,
            'staff_globally': self.partner.staff_globally,
            'country_presence': len(self.partner.country_presence) > 0 if self.partner.is_hq else True,
            'pinned_location_office_on_map': self.partner.location_field_offices.exists(),
            'experiences': all([
                exp.is_complete for exp in self.partner.experiences.all()
            ]) if self.partner.experiences.exists() else False,
        }

        if not self.partner.is_hq:
            required_fields.pop('governance_hq')
            required_fields.pop('staff_globally')
        else:
            required_fields.pop('staff_in_country')
            required_fields.pop('pinned_location_office_on_map')
        return all(required_fields.values())

    @property
    def funding_complete(self):
        budgets = self.partner.budgets.filter(budget__isnull=False)

        current_year = date.today().year
        required_budgets = budgets.filter(year__in=[
            current_year - 2, current_year - 1, current_year
        ])

        required_fields = {
            'budgets': required_budgets.count() == 3,
            'main_donors': self.partner.fund.major_donors,
            'main_donors_list': self.partner.fund.main_donors_list,
            'source_core_funding': self.partner.fund.source_core_funding
        }

        return all(required_fields.values())

    @property
    def collaboration_complete(self):
        required_fields = {
            'any_partnered_with_un': self.any_partnered_with_un is not None,
            'any_accreditation': self.any_accreditation is not None,
            'any_reference': self.any_reference is not None,
            'partnership_collaborate_institution': self.partnership_collaborate_institution is not None,
            'partnership_collaborate_institution_desc':
                self.partnership_collaborate_institution_desc if self.partnership_collaborate_institution else True,
        }

        if self.any_accreditation:
            accreditations = self.partner.collaboration_evidences.filter(
                mode=COLLABORATION_EVIDENCE_MODES.accreditation
            )
            required_fields['accreditations'] = all([a.is_complete for a in accreditations.all()]) \
                if accreditations.exists() else False

        if self.any_reference:
            references = self.partner.collaboration_evidences.filter(
                mode=COLLABORATION_EVIDENCE_MODES.reference
            )
            required_fields['references'] = all([r.is_complete for r in references.all()]) \
                if references.exists() else False

        if self.any_partnered_with_un:
            required_fields['collaborations'] = all(
                [c.is_complete for c in self.partner.collaborations_partnership.all()]
            ) if self.partner.collaborations_partnership.exists() else False

        return all(required_fields.values())

    @property
    def project_implementation_is_complete(self):
        rep_artifact = self.partner.report.report or self.partner.report.link_report

        required_fields = {
            'have_management_approach': self.have_management_approach is not None,
            'management_approach_desc':
                self.management_approach_desc if self.have_management_approach else True,
            'have_system_monitoring': self.have_system_monitoring is not None,
            'system_monitoring_desc': self.system_monitoring_desc if self.have_system_monitoring else True,
            'have_feedback_mechanism': self.have_feedback_mechanism is not None,
            'feedback_mechanism_desc': self.feedback_mechanism_desc if self.have_feedback_mechanism else True,
            'have_system_track': self.have_system_track is not None,
            'financial_control_system_desc': self.financial_control_system_desc if self.have_system_track else True,
            'internal_controls': all(
                [c.is_complete for c in self.partner.internal_controls.all()]
            ) if self.partner.internal_controls.exists() else False,
            'experienced_staff': self.experienced_staff is not None,
            'experienced_staff_desc': self.experienced_staff_desc if self.experienced_staff else True,
            'area_policies': self.partner.area_policies.filter(document_policies__isnull=True).exists() is False,

            'have_bank_account': self.have_bank_account is not None,
            'have_separate_bank_account': self.have_separate_bank_account is not None,
            'explain': self.explain if self.have_separate_bank_account is False else True,

            'key_result': self.partner.report.key_result,
            'publish_annual_reports': self.partner.report.publish_annual_reports is not None,
            'publish_annual_reports_last_report':
                self.partner.report.last_report if self.partner.report.publish_annual_reports else True,
            'publish_annual_reports_artifact': rep_artifact if self.partner.report.publish_annual_reports else True,
        }

        regular_audited = self.partner.audit.regular_audited
        required_fields['regular_audited'] = regular_audited is not None
        if regular_audited is False:
            required_fields['regular_audited_comment'] = self.partner.audit.regular_audited_comment

        if regular_audited:
            required_fields['audit_reports'] = all(
                [report.is_complete for report in self.partner.audit_reports.all()]
            ) if self.partner.audit_reports.exists() else False
            major_accountability_issues_highlighted = self.partner.audit.major_accountability_issues_highlighted
            required_fields[
                'major_accountability_issues_highlighted'] = major_accountability_issues_highlighted is not None
            if major_accountability_issues_highlighted:
                required_fields['comment'] = self.partner.audit.comment

        regular_capacity_assessments = self.partner.audit.regular_capacity_assessments
        required_fields['regular_capacity_assessments'] = regular_capacity_assessments is not None
        if regular_capacity_assessments:
            required_fields['capacity_assessments'] = all(
                [report.is_complete for report in self.partner.capacity_assessments.all()]
            ) if self.partner.capacity_assessments.exists() else False

        return all(required_fields.values())

    @property
    def other_info_is_complete(self):
        required_fields = {
            'confirm_data_updated': self.partner.other_info.confirm_data_updated,
        }

        return all(required_fields.values())


class PartnerMailingAddress(TimeStampedModel):
    partner = models.OneToOneField(Partner, related_name="mailing_address")
    mailing_type = models.CharField(
        max_length=3,
        choices=MAILING_TYPES,
        default=MAILING_TYPES.street
    )
    street = models.CharField(max_length=1000, null=True, blank=True)
    po_box = models.CharField(max_length=1000, null=True, blank=True)
    city = models.CharField(max_length=1000, null=True, blank=True)
    country = models.CharField(max_length=2, choices=COUNTRIES_ALPHA2_CODE, null=True, blank=True)
    zip_code = models.CharField(max_length=1000, null=True, blank=True)
    telephone = models.CharField(max_length=1000, null=True, blank=True)
    fax = models.CharField(max_length=1000, null=True, blank=True)
    website = models.URLField(max_length=1000, null=True, blank=True)
    org_email = models.EmailField(max_length=1000, null=True, blank=True)

    class Meta:
        ordering = ('id', )

    def __str__(self):
        return "PartnerMailingAddress <pk:{}>".format(self.id)


class Person(TimeStampedModel):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True)
    fullname = models.CharField(max_length=512, null=True, blank=True)
    job_title = models.CharField(max_length=255, null=True, blank=True)

    telephone = models.CharField(max_length=255, null=True, blank=True)
    mobile = models.CharField(max_length=255, null=True, blank=True)

    email = models.EmailField(max_length=255, null=True, blank=True)
    fax = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ('id', )
        abstract = True

    def __str__(self):
        return f"{self.__class__.__name__} <{self.pk}> {self.fullname}"

    @property
    def is_complete(self):
        required_fields = {
            self.fullname,
            self.job_title,
            self.telephone,
            self.email,
        }
        if hasattr(self, 'authorized'):
            required_fields.add(self.authorized is not None)
        if hasattr(self, 'board_member'):
            required_fields.add(self.board_member is not None)

        return all(required_fields)


class PartnerHeadOrganization(Person):
    """
    M2M to store historical records, only the most recent entry is valid
    """
    partner = models.ForeignKey(Partner, related_name="organisation_heads", null=True, blank=True)
    authorized = models.NullBooleanField(verbose_name='Is Authorised Officer?')
    board_member = models.NullBooleanField(verbose_name='Is Board Member?')


class PartnerDirector(Person):
    partner = models.ForeignKey(Partner, related_name="directors")
    authorized = models.NullBooleanField(verbose_name='Is Authorised Officer?')


class PartnerAuthorisedOfficer(Person):
    partner = models.ForeignKey(Partner, related_name="authorised_officers")


class PartnerPolicyArea(TimeStampedModel):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, related_name="area_policies")
    partner = models.ForeignKey(Partner, related_name="area_policies")
    area = models.CharField(max_length=3, choices=POLICY_AREA_CHOICES)
    document_policies = models.NullBooleanField()

    class Meta:
        ordering = ('id', )
        unique_together = (
            'partner', 'area'
        )

    def __str__(self):
        return "PartnerPolicyArea <pk:{}>".format(self.id)


class PartnerAuditAssessment(TimeStampedModel):
    partner = models.OneToOneField(Partner, related_name="audit")
    regular_audited = models.NullBooleanField()
    regular_audited_comment = models.TextField(max_length=5000, null=True, blank=True)
    major_accountability_issues_highlighted = models.NullBooleanField(
        verbose_name="Were there any major accountability issues highlighted by audits in the past three years?"
    )
    comment = models.TextField(max_length=5000, null=True, blank=True)
    regular_capacity_assessments = models.NullBooleanField()

    class Meta:
        ordering = ('id', )

    def __str__(self):
        return f"PartnerAuditAssessment <pk:{self.pk}> for {self.partner}"


class PartnerAuditReport(TimeStampedModel):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, related_name='audit_reports')
    partner = models.ForeignKey(Partner, related_name='audit_reports')
    org_audit = models.CharField(
        max_length=3, choices=ORG_AUDIT_CHOICES, null=True, blank=True
    )
    most_recent_audit_report = models.ForeignKey(
        'common.CommonFile',
        null=True,
        blank=True,
        related_name='partner_audit_reports',
    )
    link_report = models.URLField(null=True, blank=True)

    class Meta:
        ordering = ('id', )

    def __str__(self):
        return "PartnerAuditReport <pk:{}>".format(self.id)

    @property
    def is_complete(self):
        required_fields = {
            'org_audit': self.org_audit,
            'file_or_link_report': self.most_recent_audit_report or self.link_report
        }
        return all(required_fields.values())


class PartnerCapacityAssessment(TimeStampedModel):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, related_name='capacity_assessments')
    partner = models.ForeignKey(Partner, related_name='capacity_assessments')
    assessment_type = models.TextField(choices=AUDIT_ASSESSMENT_CHOICES, null=True, blank=True)
    report_file = models.ForeignKey(
        'common.CommonFile',
        null=True,
        blank=True,
        related_name='partner_capacity_assessments',
    )
    report_url = models.URLField(null=True, blank=True)

    class Meta:
        ordering = ('id', )

    def __str__(self):
        return "PartnerCapacityAssessment <pk:{}>".format(self.id)

    @property
    def is_complete(self):
        return all((
            self.assessment_type,
            self.report_file or self.report_url
        ))


class PartnerReporting(TimeStampedModel):
    partner = models.OneToOneField(Partner, related_name="report")
    key_result = models.TextField(max_length=5000, null=True, blank=True)
    publish_annual_reports = models.NullBooleanField()
    last_report = models.DateField(verbose_name='Date of most recent annual report', null=True, blank=True)
    report = models.ForeignKey('common.CommonFile', null=True, blank=True, related_name="reports")
    link_report = models.URLField(max_length=1000, null=True, blank=True)

    class Meta:
        ordering = ('id', )

    def __str__(self):
        return "PartnerReporting <pk:{}>".format(self.id)


class PartnerMandateMission(TimeStampedModel):
    partner = models.OneToOneField(Partner, related_name="mandate_mission")
    # background
    background_and_rationale = models.TextField(max_length=5000, null=True, blank=True)
    mandate_and_mission = models.TextField(max_length=5000, null=True, blank=True)

    # governance
    governance_structure = models.TextField(
        max_length=5000, null=True, blank=True, verbose_name="Briefly describe the organization's governance structure"
    )
    governance_hq = models.TextField(
        max_length=5000, null=True, blank=True,
        verbose_name="Briefly describe the headquarters oversight of country/branch office operations including "
                     "any reporting requirements of the country/branch office to HQ"
    )
    governance_organigram = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name="governance_organigrams"
    )

    # ethics
    ethic_safeguard_comment = models.TextField(
        max_length=5000, null=True, blank=True,
        verbose_name='Briefly describe the organization’s mechanisms to safeguard against the violation and abuse of '
                     'beneficiaries, including sexual exploitation and abuse.'
    )
    ethic_safeguard = models.NullBooleanField(
        verbose_name='Are these mechanisms formally documented in an organizational policy or code of conduct?'
    )
    ethic_safeguard_policy = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name="ethic_safeguard_policies"
    )

    ethic_fraud_comment = models.TextField(
        max_length=5000, null=True, blank=True,
        verbose_name='Briefly describe the organization’s mechanisms to safeguard against fraud, '
                     'corruption and other unethical behaviour.'
    )
    ethic_fraud = models.NullBooleanField(
        verbose_name='Does the organization have a policy or code of conduct to safeguard against fraud and corruption?'
    )
    ethic_fraud_policy = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name="ethic_fraud_policies"
    )

    # population of concern
    population_of_concern = models.NullBooleanField()
    concern_groups = ArrayField(
        models.CharField(max_length=3, choices=CONCERN_CHOICES),
        default=list,
        null=True
    )

    # security
    security_high_risk_locations = models.NullBooleanField(
        verbose_name="Does the organization have the ability to work in high-risk security locations?"
    )
    security_high_risk_policy = models.NullBooleanField(
        verbose_name="Does the organization have policies, procedures and practices related "
                     "to security risk management?"
    )
    security_desc = models.TextField(
        max_length=5000,
        null=True,
        blank=True,
        verbose_name="Briefly describe the organization's ability, if any, to scale-up operations in emergencies or "
                     "other situations requiring rapid response."
    )

    class Meta:
        ordering = ('id', )

    def __str__(self):
        return "PartnerMandateMission <pk:{}>".format(self.id)


class PartnerExperience(TimeStampedModel):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, related_name="experiences")
    partner = models.ForeignKey(Partner, related_name="experiences")
    specialization = models.ForeignKey(
        'common.Specialization', null=True, blank=True, related_name="partner_experiences"
    )
    years = models.CharField(
        max_length=3,
        choices=YEARS_OF_EXP_CHOICES,
        null=True,
        blank=True,
    )

    class Meta:
        ordering = ('id', )

    def __str__(self):
        return "PartnerExperience <pk:{}>".format(self.id)

    @property
    def is_complete(self):
        required_fields = {
            'specialization': self.specialization,
            'years': self.years,
        }
        return all(required_fields.values())


class PartnerInternalControl(TimeStampedModel):
    partner = models.ForeignKey(Partner, related_name="internal_controls")
    functional_responsibility = models.CharField(
        max_length=3,
        choices=FUNCTIONAL_RESPONSIBILITY_CHOICES,
    )
    segregation_duties = models.NullBooleanField()
    comment = models.TextField(max_length=5000, null=True, blank=True)

    class Meta:
        ordering = ('id', )
        unique_together = (
            'partner', 'functional_responsibility'
        )

    def __str__(self):
        return "PartnerInternalControl <pk:{}>".format(self.id)

    @property
    def is_complete(self):
        required_fields = {
            'segregation_duties': self.segregation_duties is not None,
            'comment': self.comment,
        }
        return all(required_fields.values())


class PartnerBudget(TimeStampedModel):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, related_name="budgets")
    partner = models.ForeignKey(Partner, related_name="budgets")
    year = models.PositiveSmallIntegerField(
        help_text="Enter valid year.",
        validators=[max_current_year_validator, MinValueValidator(1800)]  # red cross since 1863 year
    )
    budget = models.CharField(max_length=3, choices=BUDGET_CHOICES, null=True, blank=True)

    class Meta:
        unique_together = ('partner', 'year')
        ordering = ['-year', 'id']

    def __str__(self):
        return "[{}] Partner '{}' budget for {} ".format(self.pk, self.partner, self.year)


class PartnerFunding(TimeStampedModel):
    partner = models.OneToOneField(Partner, related_name="fund")
    source_core_funding = models.CharField(max_length=5000, verbose_name="Please state your source(s) of core funding")
    major_donors = ArrayField(
        models.CharField(max_length=3, choices=PARTNER_DONORS_CHOICES),
        default=list,
        null=True
    )
    main_donors_list = models.CharField(
        max_length=5000, blank=True, null=True, verbose_name="Please list your main donors"
    )

    class Meta:
        ordering = ('id', )

    def __str__(self):
        return f"PartnerFunding {self.partner}"


class PartnerCollaborationPartnership(TimeStampedModel):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="collaborations_partnership")
    partner = models.ForeignKey(Partner, related_name="collaborations_partnership")
    agency = models.ForeignKey(
        'agency.Agency', related_name="collaborations_partnership", blank=True, null=True
    )
    description = models.CharField(max_length=10000, blank=True, null=True)
    partner_number = models.CharField(
        max_length=200, blank=True, null=True, verbose_name='Please provide your Vendor/Partner Number (If applicable)'
    )

    class Meta:
        ordering = ('id', )
        unique_together = (
            ('partner', 'agency'),
        )

    def __str__(self):
        return "PartnerCollaborationPartnership <pk:{}>".format(self.id)

    @property
    def is_complete(self):
        required_fields = {
            'agency': self.agency,
        }
        return all(required_fields.values())


class PartnerCollaborationEvidence(TimeStampedModel):
    """
    Accreditation & References
    """
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="collaboration_evidences")
    partner = models.ForeignKey(Partner, related_name="collaboration_evidences")
    mode = models.CharField(max_length=3, choices=COLLABORATION_EVIDENCE_MODES, blank=True, null=True)
    organization_name = models.CharField(max_length=1000, blank=True, null=True)
    date_received = models.DateField(verbose_name='Date Received', null=True)
    evidence_file = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name="collaboration_evidences"
    )
    editable = models.BooleanField(default=True)

    class Meta:
        ordering = ('id', )

    def __str__(self):
        return "PartnerCollaborationEvidence <pk:{}>".format(self.id)

    @property
    def is_complete(self):
        required_fields = {
            self.mode,
            self.organization_name,
            self.date_received,
            self.evidence_file,
        }
        return all(required_fields)


class PartnerOtherInfo(TimeStampedModel):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, related_name="other_info")
    partner = models.OneToOneField(Partner, related_name="other_info")
    info_to_share = models.TextField(max_length=5000, null=True, blank=True)
    org_logo = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name="others_info"
    )

    other_doc_1 = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name='other_info_doc_1'
    )
    other_doc_2 = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name='other_info_doc_2'
    )
    other_doc_3 = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name='other_info_doc_3'
    )

    confirm_data_updated = models.NullBooleanField(default=False)

    class Meta:
        ordering = ('id', )

    def __str__(self):
        return "PartnerOtherInfo <pk:{}>".format(self.id)

    @property
    def org_logo_thumbnail(self):
        return self.org_logo and self.org_logo.thumbnail_url


class PartnerMember(TimeStampedModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="partner_members")
    partner = models.ForeignKey(Partner, related_name="partner_members")
    title = models.CharField(max_length=255)
    role = FixedTextField(choices=PartnerRole.get_choices(), default=PartnerRole.READER.name)

    class Meta:
        ordering = ('id', )
        unique_together = (
            'user', 'partner'
        )

    def __str__(self):
        return f"<{self.pk}>[{self.user}] `{self.get_role_display()}` in `{self.partner}`"

    def get_role_display(self):
        # This is one of the "magical" django methods and cannot be called directly using super call
        field_object = self._meta.get_field('role')
        prefix = 'HQ ' if self.partner.is_hq else ''
        return prefix + self._get_FIELD_display(field_object)

    @threaded_cached_property
    def user_permissions(self):
        return PARTNER_ROLE_PERMISSIONS[self.partner.is_hq][PartnerRole[self.role]]


class PartnerReview(TimeStampedModel):
    # This class is under construction at all UNICEF projects.. they are figuring out the right result of this entity.
    # We should keep in mind that this class can totally change!
    partner = models.ForeignKey(Partner, related_name="reviews")
    agency = models.ForeignKey('agency.Agency', related_name="partner_reviews")
    reviewer = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="partner_reviews")
    display_type = models.CharField(max_length=3, choices=PARTNER_REVIEW_TYPES)
    eoi = models.ForeignKey('project.EOI', related_name="partner_reviews")
    performance_pm = models.CharField(max_length=3, choices=SATISFACTION_SCALES)
    performance_financial = models.CharField(max_length=3, choices=SATISFACTION_SCALES)
    performance_com_eng = models.CharField(max_length=3, choices=SATISFACTION_SCALES)
    ethical_concerns = models.NullBooleanField(verbose_name='Ethical concerns?')
    does_recommend = models.NullBooleanField(verbose_name='Does recommend?')
    comment = models.TextField()

    class Meta:
        ordering = ('id', )

    def __str__(self):
        return "PartnerReview <pk:{}>".format(self.id)


class PartnerGoverningDocument(TimeStampedModel):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="governing_documents")
    profile = models.ForeignKey(PartnerProfile, related_name="governing_documents")
    document = models.ForeignKey('common.CommonFile', related_name="governing_documents")
    editable = models.BooleanField(default=True)

    class Meta:
        ordering = ('created', )

    def __str__(self):
        return f"[{self.pk}] {self.profile.partner}"


class PartnerRegistrationDocument(TimeStampedModel):
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="registration_documents")
    profile = models.ForeignKey(PartnerProfile, related_name="registration_documents")
    document = models.ForeignKey('common.CommonFile', related_name="registration_documents")
    registration_number = models.TextField(max_length=255, null=True, blank=True)
    editable = models.BooleanField(default=True)
    issuing_authority = models.TextField()
    issue_date = models.DateField(validators=(
        past_date_validator,
    ))
    expiry_date = models.DateField(validators=(
        future_date_validator,
    ), null=True, blank=True)

    class Meta:
        ordering = ('created', )

    def __str__(self):
        return f"[{self.pk}] {self.profile.partner} ({self.issue_date}-{self.expiry_date})"


def create_partner_additional_models(sender, instance, created, **kwargs):
    if created:
        PartnerProfile.objects.create(partner=instance)
        PartnerMailingAddress.objects.create(partner=instance)
        PartnerAuditAssessment.objects.create(partner=instance)
        PartnerReporting.objects.create(partner=instance)
        PartnerMandateMission.objects.create(partner=instance)
        PartnerFunding.objects.create(partner=instance)
        PartnerOtherInfo.objects.create(partner=instance)

        responsibilities = []
        for responsibility in list(FUNCTIONAL_RESPONSIBILITY_CHOICES._db_values):
            responsibilities.append(
                PartnerInternalControl(partner=instance, functional_responsibility=responsibility)
            )
        PartnerInternalControl.objects.bulk_create(responsibilities)

        policy_areas = []
        for policy_area in list(POLICY_AREA_CHOICES._db_values):
            policy_areas.append(PartnerPolicyArea(partner=instance, area=policy_area))
        PartnerPolicyArea.objects.bulk_create(policy_areas)


post_save.connect(create_partner_additional_models, sender=Partner)

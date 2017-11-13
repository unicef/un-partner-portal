# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from datetime import date

from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator
from model_utils.models import TimeStampedModel

from account.models import User
from common.validators import MaxCurrentYearValidator
from common.countries import COUNTRIES_ALPHA2_CODE
from common.consts import (
    SATISFACTION_SCALES,
    PARTNER_REVIEW_TYPES,
    PARTNER_TYPES,
    MEMBER_ROLES,
    MEMBER_STATUSES,
    COLLABORATION_EVIDENCE_MODES,
    METHOD_ACC_ADOPTED_CHOICES,
    FINANCIAL_CONTROL_SYSTEM_CHOICES,
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    WORKING_LAGNUAGES_CHOICES,
    MAILING_TYPES,
    YEARS_OF_EXP_CHOICES,
    CONCERN_CHOICES,
    STAFF_GLOBALLY_CHOICES,
    PARTNER_DONORS_CHOICES,
    POLICY_AREA_CHOICES,
    ORG_AUDIT_CHOICES,
    AUDIT_ASSESMENT_CHOICES,
    BUDGET_CHOICES,
    FLAG_TYPES,
)


class Partner(TimeStampedModel):
    legal_name = models.CharField(max_length=255)
    display_type = models.CharField(max_length=3, choices=PARTNER_TYPES)
    hq = models.ForeignKey('self', null=True, blank=True, related_name='children')
    country_code = models.CharField(max_length=2, choices=COUNTRIES_ALPHA2_CODE)
    is_active = models.BooleanField(default=True)
    is_locked = models.BooleanField(default=False)
    # hq information
    country_presence = ArrayField(
        models.CharField(max_length=2, choices=COUNTRIES_ALPHA2_CODE),
        default=list,
        null=True
    )
    staff_globally = models.CharField(max_length=3, choices=STAFF_GLOBALLY_CHOICES, null=True, blank=True)
    # country profile information
    location_of_office = models.ForeignKey('common.Point', related_name="location_of_offices", null=True, blank=True)
    more_office_in_country = models.BooleanField(default=True)
    location_field_offices = models.ManyToManyField('common.Point', related_name="location_field_offices")
    staff_in_country = models.CharField(max_length=3, choices=STAFF_GLOBALLY_CHOICES, null=True, blank=True)
    engagement_operate_desc = models.CharField(
        verbose_name="Briefly describe the organization's engagement with the communities in which you operate",
        max_length=255, null=True, blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Partner: {} <pk:{}>".format(self.legal_name, self.id)

    @property
    def is_hq(self):
        return self.hq in [None, ''] and self.display_type == PARTNER_TYPES.international

    @property
    def is_country_profile(self):
        return self.hq not in [None, ''] and self.display_type == PARTNER_TYPES.international

    @property
    def country_profiles(self):
        return self.__class__.objects.filter(hq=self)

    @property
    def has_yellow_flag(self):
        return self.flags.filter(flag_type=FLAG_TYPES.yellow).exists()

    @property
    def has_red_flag(self):
        return self.flags.filter(flag_type=FLAG_TYPES.red).exists()

    def get_users(self):
        return User.objects.filter(partner_members__partner=self)

    @property
    def is_verified(self):
        if not self.verifications.exists():
            return None
        else:
            return self.verifications.filter(is_verified=True).exists()

    @property
    def has_sanction_match(self):
        return self.sanction_matches.filter(can_ignore=False).exists()

    @property
    def flagging_status(self):
        return {
            'yellow': self.flags.filter(flag_type=FLAG_TYPES.yellow).count(),
            'red': self.flags.filter(flag_type=FLAG_TYPES.red).count(),
        }


class PartnerProfile(TimeStampedModel):
    partner = models.OneToOneField(Partner, related_name="profile")
    alias_name = models.CharField(max_length=255, null=True, blank=True)
    acronym = models.CharField(max_length=200, null=True, blank=True)
    legal_name_change = models.BooleanField(default=False)
    former_legal_name = models.CharField(max_length=255, null=True, blank=True)
    connectivity = models.BooleanField(default=False, verbose_name='Does the organization have reliable access to '
                                                                   'internet in all of its operations?')
    connectivity_excuse = models.CharField(max_length=200, null=True, blank=True)
    working_languages = ArrayField(
        models.CharField(max_length=3, choices=WORKING_LAGNUAGES_CHOICES),
        default=list,
        null=True
    )
    working_languages_other = models.CharField(max_length=100, null=True, blank=True)
    flagged = models.BooleanField(default=False)  # not sure do we need this attr
    # authorised_officials
    have_board_directors = models.BooleanField(
        default=False, verbose_name="Does your organization have a board of directors?")
    have_authorised_officers = models.BooleanField(
        default=False, verbose_name="Does your organization have a authorised officers?")

    # Registration of organization
    year_establishment = models.PositiveSmallIntegerField(
        'Year of establishment',
        help_text="Enter valid year.",
        null=True,
        blank=True,
        validators=[MaxCurrentYearValidator(), MinValueValidator(1800)]  # red cross since 1863 year
    )
    have_gov_doc = models.BooleanField(default=False, verbose_name='Does the organization have a government document?')
    gov_doc = models.ForeignKey('common.CommonFile', null=True, blank=True, related_name="gov_docs")
    registration_to_operate_in_country = models.BooleanField(default=True)
    registration_doc = models.ForeignKey('common.CommonFile', null=True, blank=True, related_name="registration_docs")
    registration_date = models.DateField(null=True, blank=True)
    registration_comment = models.CharField(max_length=255, null=True, blank=True)
    registration_number = models.CharField(max_length=255, null=True, blank=True)

    # programme management
    have_management_approach = models.BooleanField(default=False)  # results_based_approach
    management_approach_desc = models.CharField(max_length=200, null=True, blank=True)
    have_system_monitoring = models.BooleanField(default=False)
    system_monitoring_desc = models.CharField(max_length=200, null=True, blank=True)
    have_feedback_mechanism = models.BooleanField(default=False)
    feedback_mechanism_desc = models.CharField(max_length=200, null=True, blank=True)

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
    have_system_track = models.BooleanField(default=False)
    financial_control_system_desc = models.CharField(max_length=200, null=True, blank=True)

    # internal control - other fields
    experienced_staff = models.BooleanField(
        default=False, verbose_name="Does the organization have an adequate number of experienced staff responsible "
                                    "for financial management in all operations?")
    experienced_staff_desc = models.CharField(max_length=200, null=True, blank=True)

    # collaborate
    partnership_collaborate_institution = models.BooleanField(default=False)
    partnership_collaborate_institution_desc = models.CharField(max_length=200, null=True, blank=True)

    # Banking Information
    have_bank_account = models.BooleanField(
        default=False, verbose_name="Does the organization have a bank account?")
    have_separate_bank_account = models.BooleanField(
        default=False, verbose_name="Does the organization currently maintain, or has it previously maintained, "
                                    "a separate, interest-bearing account for UN funded projects that require "
                                    "a separate account?")
    explain = models.CharField(max_length=200, null=True, blank=True, verbose_name="Please explain")

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerProfile <pk:{}>".format(self.id)

    @property
    def annual_budget(self):
        budget = self.partner.budgets.filter(year=date.today().year).first()
        if budget is not None:
            return budget.budget

    def identification_is_complete(self):
        required_fields = {
            'legal_name': self.partner.legal_name,
            'country_code': self.partner.county_code,
            'establishment_year': self.year_establishment
        }

        return all(required_fields.values())

    def contact_is_complete(self):
        required_fields = {
            'sreet_or_pobox': self.partner.mailing_address.street or self.partner.mailing_address.po_box,
            'city': self.partner.mailing_address.city,
            'country': self.partner.mailing_address.country,
            'zip_code': self.partner.mailing_address.zip_code,
            'telephone': self.partner.mailing_address.telephone
        }
        return all(required_fields.values())

    def mandatemission_complete(self):
        required_fields = {
            'proj_background_rationale': self.partner.mandate_mission.background_and_rationale,
            'managate_and_mission': self.partner.mandate_mission.mandate_and_mission,
            'governance_structure': self.partner.mandate_mission.governance_structure,
            'governance_hq': self.partner.mandate_mission.governance_hq,
            'governance_organigram': self.partner.mandate_mission.governance_organigram,
            'staff_in_country': self.partner.staff_in_country,
            'staff_globally': self.partner.staff_globally
            # TODO - country presence for hq + country

        }
        if not self.partner.is_hq:
            required_fields.pop('governance_hq')
            required_fields.pop('staff_globally')

        else:
            required_fields.pop('staff_in_country')

        return all(required_fields.values())

    def funding_complete(self):
        budgets = self.partner.budgets.all()
        current_year_exists = budgets.filter(year=date.today().year).exists()
        last_year_exists = budgets.filter(year=(current_year - 1)).exists()

        required_fields = {
            'budgets': current_year_exists and last_year_exists,
            'main_donors': self.partner.fund.major_donors,
            'main_donors_list': self.partner.fund.main_donors_list,
            'source_core_funding': self.partner.fund.source_core_funding
        }

        return all(required_fields.values())

    def collaboration_complete(self):
        # TODO - how do we tell for this tab?
        return True

    def proj_impl_is_complete(self):
        # TODO
        return True

    def other_info_is_complete(self):
        # TODO
        return True



class PartnerMailingAddress(TimeStampedModel):
    partner = models.OneToOneField(Partner, related_name="mailing_address")
    mailing_type = models.CharField(
        max_length=3,
        choices=MAILING_TYPES,
        default=MAILING_TYPES.street
    )
    street = models.CharField(max_length=200, null=True, blank=True)
    po_box = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=2, choices=COUNTRIES_ALPHA2_CODE, null=True, blank=True)
    zip_code = models.CharField(max_length=200, null=True, blank=True)
    telephone = models.CharField(max_length=255, null=True, blank=True)
    fax = models.CharField(max_length=255, null=True, blank=True)
    website = models.URLField(null=True, blank=True)
    org_email = models.EmailField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerMailingAddress <pk:{}>".format(self.id)


class PartnerHeadOrganization(TimeStampedModel):
    partner = models.OneToOneField(Partner, related_name="org_head")
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(max_length=255, null=True, blank=True)
    job_title = models.CharField(max_length=255, null=True, blank=True)
    # TODO: shall we provide PhoneNumberField ???
    telephone = models.CharField(max_length=255, null=True, blank=True)
    fax = models.CharField(max_length=255, null=True, blank=True)
    mobile = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerHeadOrganization <pk:{}>".format(self.id)


class PartnerDirector(TimeStampedModel):
    created_by = models.ForeignKey('account.User', null=True, blank=True, related_name="directors")
    partner = models.ForeignKey(Partner, related_name="directors")
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    job_title = models.CharField(max_length=255, null=True, blank=True)
    authorized = models.BooleanField(default=False)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerDirector <pk:{}>".format(self.id)


class PartnerAuthorisedOfficer(TimeStampedModel):
    created_by = models.ForeignKey('account.User', null=True, blank=True, related_name="authorised_officers")
    partner = models.ForeignKey(Partner, related_name="authorised_officers")
    first_name = models.CharField(max_length=255, null=True, blank=True)
    last_name = models.CharField(max_length=255, null=True, blank=True)
    job_title = models.CharField(max_length=255, null=True, blank=True)
    telephone = models.CharField(max_length=255, null=True, blank=True)
    fax = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerAuthorisedOfficer <pk:{}>".format(self.id)


class PartnerPolicyArea(TimeStampedModel):
    created_by = models.ForeignKey('account.User', null=True, blank=True, related_name="area_policies")
    partner = models.ForeignKey(Partner, related_name="area_policies")
    area = models.CharField(max_length=3, choices=POLICY_AREA_CHOICES)
    document_policies = models.BooleanField(default=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerPolicyArea <pk:{}>".format(self.id)


class PartnerAuditAssessment(TimeStampedModel):
    partner = models.OneToOneField(Partner, related_name="audit")
    regular_audited = models.BooleanField(default=True)
    regular_audited_comment = models.CharField(max_length=200, null=True, blank=True)
    org_audits = ArrayField(
        models.CharField(max_length=3, choices=ORG_AUDIT_CHOICES),
        default=list,
        null=True
    )
    most_recent_audit_report = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name="most_recent_audit_reports")
    link_report = models.URLField()
    major_accountability_issues_highlighted = models.BooleanField(
        default=False, verbose_name="Were there any major accountability issues highlighted by audits in the past "
                                    "three years?")
    comment = models.CharField(max_length=200, null=True, blank=True)
    capacity_assessment = models.BooleanField(default=True, verbose_name="Has the organization undergone a formal "
                                                                         "capacity assessment?")
    assessments = ArrayField(
        models.CharField(max_length=3, choices=AUDIT_ASSESMENT_CHOICES),
        default=list,
        null=True
    )
    assessment_report = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name="assessment_reports")

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerAuditAssessment <pk:{}>".format(self.id)


class PartnerReporting(TimeStampedModel):
    partner = models.OneToOneField(Partner, related_name="report")
    key_result = models.CharField(max_length=200, null=True, blank=True)
    publish_annual_reports = models.BooleanField(default=True)
    last_report = models.DateField(verbose_name='Date of most recent annual report', null=True, blank=True)
    report = models.ForeignKey('common.CommonFile', null=True, blank=True, related_name="reports")
    link_report = models.URLField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerReporting <pk:{}>".format(self.id)


class PartnerMandateMission(TimeStampedModel):
    partner = models.OneToOneField(Partner, related_name="mandate_mission")
    # background
    background_and_rationale = models.CharField(max_length=400, null=True, blank=True)
    mandate_and_mission = models.CharField(max_length=400, null=True, blank=True)

    # governance
    governance_structure = models.CharField(
        max_length=200, null=True, blank=True, verbose_name="Briefly describe the organization's governance structure")
    governance_hq = models.CharField(
        max_length=200, null=True, blank=True,
        verbose_name="Briefly describe the headquarters oversight of country/branch office operations including "
                     "any reporting requirements of the country/branch office to HQ")
    governance_organigram = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name="governance_organigrams")

    # ethics
    ethic_safeguard = models.BooleanField(default=False)
    ethic_safeguard_policy = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name="ethic_safeguard_policies")
    ethic_safeguard_comment = models.CharField(max_length=200, null=True, blank=True)
    ethic_fraud = models.BooleanField(default=False)
    ethic_fraud_policy = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name="ethic_fraud_policies")
    ethic_fraud_comment = models.CharField(max_length=200, null=True, blank=True)

    # population of concern
    population_of_concern = models.BooleanField(default=False)
    concern_groups = ArrayField(
        models.CharField(max_length=3, choices=CONCERN_CHOICES),
        default=list,
        null=True
    )

    # security
    security_high_risk_locations = models.BooleanField(
        default=False, verbose_name="Does the organization have the ability to work in high-risk security locations?")
    security_high_risk_policy = models.BooleanField(
        default=False, verbose_name="Does the organization have policies, procedures and practices related "
                                    "to security risk management?")
    security_desc = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        verbose_name="Briefly describe the organization's ability, if any, to scale-up operations in emergencies or "
                     "other situations requiring rapid response."
    )

    # Collaboration
    partnership_with_insitutions = models.BooleanField(
        default=False,
        verbose_name=(
            'Has the organization collaborated with or a member of a cluster,'
            ' professional netwok, consortium or any similar insitutions?')
    )
    description = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        verbose_name=(
            'Please state which cluster, network or consortium and briefly explain the collaboration'
            ' professional netwok, consortium or any similar insitutions?')
    )

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerMandateMission <pk:{}>".format(self.id)


class PartnerExperience(TimeStampedModel):
    created_by = models.ForeignKey('account.User', null=True, blank=True, related_name="experiences")
    partner = models.ForeignKey(Partner, related_name="experiences")
    specialization = models.ForeignKey('common.Specialization', related_name="partner_experiences")
    years = models.CharField(
        max_length=3,
        choices=YEARS_OF_EXP_CHOICES,
        default=YEARS_OF_EXP_CHOICES.less_1
    )

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerExperience <pk:{}>".format(self.id)


class PartnerInternalControl(TimeStampedModel):
    partner = models.ForeignKey(Partner, related_name="internal_controls")
    functional_responsibility = models.CharField(
        max_length=3,
        choices=FUNCTIONAL_RESPONSIBILITY_CHOICES,
    )
    segregation_duties = models.BooleanField(default=False)
    comment = models.CharField(max_length=200, null=True, blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerInternalControl <pk:{}>".format(self.id)


class PartnerBudget(TimeStampedModel):
    created_by = models.ForeignKey('account.User', null=True, blank=True, related_name="budgets")
    partner = models.ForeignKey(Partner, related_name="budgets")
    year = models.PositiveSmallIntegerField(
        "Weight in percentage",
        help_text="Enter valid year.",
        validators=[MaxCurrentYearValidator(), MinValueValidator(1800)]  # red cross since 1863 year
    )
    budget = models.CharField(max_length=3, choices=BUDGET_CHOICES, default=BUDGET_CHOICES.less)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerBudget {} <pk:{}>".format(self.year, self.id)


class PartnerFunding(TimeStampedModel):
    partner = models.OneToOneField(Partner, related_name="fund")
    source_core_funding = models.CharField(max_length=200, verbose_name="Please state your source(s) of core funding")
    major_donors = ArrayField(
        models.CharField(max_length=3, choices=PARTNER_DONORS_CHOICES),
        default=list,
        null=True
    )
    main_donors_list = models.CharField(
        max_length=200, blank=True, null=True, verbose_name="Please list your main donors")

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerFunding <pk:{}>".format(self.id)


class PartnerCollaborationPartnership(TimeStampedModel):
    created_by = models.ForeignKey('account.User', related_name="collaborations_partnership")
    partner = models.ForeignKey(Partner, related_name="collaborations_partnership")
    agency = models.ForeignKey('agency.Agency', related_name="collaborations_partnership")
    description = models.CharField(max_length=200, blank=True, null=True)
    partner_number = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        ordering = ['id']
        unique_together = (('partner', 'agency'), )

    def __str__(self):
        return "PartnerCollaborationPartnership <pk:{}>".format(self.id)


class PartnerCollaborationEvidence(TimeStampedModel):
    """
    Accreditation & References
    """
    created_by = models.ForeignKey('account.User', related_name="collaboration_evidences")
    partner = models.ForeignKey(Partner, related_name="collaboration_evidences")
    mode = models.CharField(max_length=3, choices=COLLABORATION_EVIDENCE_MODES)
    organization_name = models.CharField(max_length=200)
    date_received = models.DateField(verbose_name='Date Received', auto_now=True)
    evidence_file = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name="collaboration_evidences")

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerCollaborationEvidence <pk:{}>".format(self.id)


class PartnerOtherInfo(TimeStampedModel):
    created_by = models.ForeignKey('account.User', null=True, blank=True, related_name="other_info")
    partner = models.OneToOneField(Partner, related_name="other_info")
    info_to_share = models.CharField(max_length=200)
    org_logo = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name="others_info")

    other_doc_1 = models.ForeignKey('common.CommonFile', null=True,
                                    blank=True, related_name='other_info_doc_1')
    other_doc_2 = models.ForeignKey('common.CommonFile', null=True,
                                    blank=True, related_name='other_info_doc_2')
    other_doc_3 = models.ForeignKey('common.CommonFile', null=True,
                                    blank=True, related_name='other_info_doc_3')

    confirm_data_updated = models.BooleanField(default=False)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerOtherInfo <pk:{}>".format(self.id)


class PartnerMember(TimeStampedModel):
    user = models.ForeignKey('account.User', related_name="partner_members")
    partner = models.ForeignKey(Partner, related_name="partner_members")
    title = models.CharField(max_length=255)
    role = models.CharField(max_length=3, choices=MEMBER_ROLES, default=MEMBER_ROLES.reader)
    status = models.CharField(max_length=3, choices=MEMBER_STATUSES, default=MEMBER_STATUSES.invited)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerMember: {} <pk:{}>".format(self.title, self.id)


class PartnerReview(TimeStampedModel):
    # This class is under construction at all UNICEF projects.. they are figuring out the right result of this entity.
    # We should keep in mind that this class can totally change!
    partner = models.ForeignKey(Partner, related_name="reviews")
    agency = models.ForeignKey('agency.Agency', related_name="partner_reviews")
    reviewer = models.ForeignKey('account.User', related_name="partner_reviews")
    display_type = models.CharField(max_length=3, choices=PARTNER_REVIEW_TYPES)
    eoi = models.ForeignKey('project.EOI', related_name="partner_reviews")
    performance_pm = models.CharField(max_length=3, choices=SATISFACTION_SCALES)
    peformance_financial = models.CharField(max_length=3, choices=SATISFACTION_SCALES)
    performance_com_eng = models.CharField(max_length=3, choices=SATISFACTION_SCALES)
    ethical_concerns = models.BooleanField(default=False, verbose_name='Ethical concerns?')
    does_recommend = models.BooleanField(default=False, verbose_name='Does recommend?')
    comment = models.TextField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerReview <pk:{}>".format(self.id)

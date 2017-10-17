# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from datetime import date

from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.core.validators import MinValueValidator
from model_utils.models import TimeStampedModel

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
)


class Partner(TimeStampedModel):
    legal_name = models.CharField(max_length=255)
    display_type = models.CharField(max_length=3, choices=PARTNER_TYPES)
    hq = models.ForeignKey('self', null=True, blank=True, related_name='children')
    country_code = models.CharField(max_length=2, choices=COUNTRIES_ALPHA2_CODE)
    is_active = models.BooleanField(default=True)
    # hq information
    country_presence = ArrayField(
        models.CharField(max_length=2, choices=WORKING_LAGNUAGES_CHOICES),
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
        return self.hq in [None, '']

    @property
    def country_profiles(self):
        return self.__class__.objects.filter(hq=self)


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
    working_languages_other = models.CharField(max_length=2, choices=COUNTRIES_ALPHA2_CODE, null=True, blank=True)
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
        return PartnerBudget.objects.filter(partner=self, year=date.today().year).values_list('budget', flat=True) or 0


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

    def __str__(self):
        return "PartnerCollaborationPartnership <pk:{}>".format(self.id)


class PartnerCollaborationPartnershipOther(TimeStampedModel):
    created_by = models.ForeignKey('account.User', related_name="collaborations_partnership_others")
    partner = models.ForeignKey(Partner, related_name="collaborations_partnership_others")
    other_agency = models.ForeignKey('agency.OtherAgency', related_name="collaborations_partnership_others")

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerCollaborationPartnershipOther <pk:{}>".format(self.id)


class PartnerCollaborationEvidence(TimeStampedModel):
    """
    Accreditation & References
    """
    created_by = models.ForeignKey('account.User', related_name="collaboration_evidences")
    partner = models.ForeignKey(Partner, related_name="collaboration_evidences")
    mode = models.CharField(max_length=3, choices=COLLABORATION_EVIDENCE_MODES)
    organization_name = models.CharField(max_length=200)
    date_received = models.DateField(verbose_name='Date Received')
    evidence_file = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name="collaboration_evidences")

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerCollaborationEvidence <pk:{}>".format(self.id)


class PartnerOtherInfo(TimeStampedModel):
    partner = models.OneToOneField(Partner, related_name="other_info")
    info_to_share = models.CharField(max_length=200)
    org_logo = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name="others_info")
    confirm_data_updated = models.BooleanField(default=False)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerOtherInfo <pk:{}>".format(self.id)


class PartnerOtherDocument(TimeStampedModel):
    """
    Max to 3 other document that User can upload.
    """
    partner = models.ForeignKey(Partner, related_name="other_documents")
    document = models.FileField(null=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerOtherDocument <pk:{}>".format(self.id)


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

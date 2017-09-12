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
    ACCEPTED_DECLINED,
    JUSTIFICATION_FOR_DIRECT_SELECTION,
)


class Partner(TimeStampedModel):
    """

    """
    legal_name = models.CharField(max_length=255)
    display_type = models.CharField(max_length=3, choices=PARTNER_TYPES)
    hq = models.ForeignKey('self', null=True, blank=True, related_name='children')
    country_code = models.CharField(max_length=2, choices=COUNTRIES_ALPHA2_CODE)
    is_active = models.BooleanField(default=True)
    registration_number = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Partner: {} <pk:{}>".format(self.legal_name, self.id)


class PartnerProfile(TimeStampedModel):
    """

    """
    partner = models.ForeignKey(Partner, related_name="profile")
    alias_name = models.CharField(max_length=255, null=True, blank=True)
    legal_name_change = models.BooleanField(default=False)
    former_legal_name = models.CharField(max_length=255, null=True, blank=True)
    org_head_first_name = models.CharField(max_length=255, null=True, blank=True)

    org_head_last_name = models.CharField(max_length=255, null=True, blank=True)
    org_head_email = models.EmailField(max_length=255, null=True, blank=True)
    org_head_job_title = models.CharField(max_length=255, null=True, blank=True)
    # TODO: shall we provide PhoneNumberField ???
    org_head_telephonee = models.CharField(max_length=255, null=True, blank=True)
    org_head_fax = models.CharField(max_length=255, null=True, blank=True)
    org_head_mobile = models.CharField(max_length=255, null=True, blank=True)
    working_languages = ArrayField(
        models.CharField(max_length=3, choices=WORKING_LAGNUAGES_CHOICES),
        default=list,
        null=True
    )
    working_languages_other = models.CharField(max_length=2, choices=COUNTRIES_ALPHA2_CODE, null=True, blank=True)
    register_country = models.BooleanField(default=False, verbose_name='Register to work in country?')
    flagged = models.BooleanField(default=False)
    start_cooperate_date = models.DateField(auto_now_add=True)
    have_gov_doc = models.BooleanField(default=False, verbose_name='Does the organization have a government document?')
    registration_doc = models.FileField(null=True)

    # programme management
    have_management_approach = models.BooleanField(default=False)  # results_based_approach
    management_approach_desc = models.CharField(max_length=200, null=True, blank=True)
    have_system_monitoring = models.BooleanField(default=False)
    system_monitoring_desc = models.CharField(max_length=200, null=True, blank=True)
    have_feedback_mechanism = models.BooleanField(default=False)

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

    # internal controls
    # TODO: add here right fields + we will have relation with PartnerInternalControls

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerProfile <pk:{}>".format(self.id)

    @property
    def annual_budget(self):
        return PartnerBudget.objects.filter(partner=self, year=date.today().year).values_list('budget', flat=True) or 0


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
    """

    """
    partner = models.ForeignKey(Partner, related_name="budgets")
    year = models.PositiveSmallIntegerField(
        "Weight in percentage",
        help_text="Value in percentage, provide number from 0 to 100",
        validators=[MaxCurrentYearValidator(), MinValueValidator(1800)]  # red cross since 1863 year
    )
    budget = models.DecimalField(decimal_places=2, max_digits=12, blank=True, null=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "PartnerBudget {} <pk:{}>".format(self.year, self.id)


class PartnerDonor(TimeStampedModel):
    partner = models.ForeignKey(Partner, related_name="donors")
    name = models.CharField(max_length=255)


class PartnerCollaborationPartnership(TimeStampedModel):
    created_by = models.ForeignKey('account.User', related_name="collaborations_partnership")
    partner = models.ForeignKey(Partner, related_name="collaborations_partnership")
    agency = models.ForeignKey('agency.Agency', related_name="collaborations_partnership")
    description = models.CharField(max_length=200, blank=True, null=True)
    partner_number = models.CharField(max_length=200, blank=True, null=True)


class PartnerCollaborationPartnershipOther(TimeStampedModel):
    created_by = models.ForeignKey('account.User', related_name="collaborations_partnership_others")
    partner = models.ForeignKey(Partner, related_name="collaborations_partnership_others")
    other_agency = models.ForeignKey('agency.OtherAgency', related_name="collaborations_partnership_others")
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


class PartnerCollaborationEvidence(TimeStampedModel):
    created_by = models.ForeignKey('account.User', related_name="collaboration_evidences")
    partner = models.ForeignKey(Partner, related_name="collaboration_evidences")
    mode = models.CharField(max_length=3, choices=COLLABORATION_EVIDENCE_MODES)
    organization_name = models.CharField(max_length=200)
    date_received = models.DateField(verbose_name='Date Received')
    evidence_file = models.FileField()


class PartnerMember(TimeStampedModel):
    """

    """
    user = models.ForeignKey('account.User', related_name="partner_members")
    partner = models.ForeignKey(Partner, related_name="partners")
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

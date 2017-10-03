# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from datetime import date

from django.db import models
from django.db.models import Sum
from django.contrib.postgres.fields import ArrayField, JSONField
from django.core.validators import MaxValueValidator, MinValueValidator
from model_utils.models import TimeStampedModel
from common.consts import (
    EOI_TYPES,
    APPLICATION_STATUSES,
    SCALE_TYPES,
    EOI_STATUSES,
    SELECTION_CRITERIA_CHOICES,
    DIRECT_SELECTION_SOURCE,
    JUSTIFICATION_FOR_DIRECT_SELECTION,
    COMPLETED_REASON,
)
from common.countries import COUNTRIES_ALPHA2_CODE


class EOI(TimeStampedModel):
    """
    Call of Expression of Interest
    """
    # TODO: this model is very heavy !!! we should think to split fields like file texts to some "EOI_profil" ..
    display_type = models.CharField(max_length=3, choices=EOI_TYPES, default=EOI_TYPES.open)
    status = models.CharField(max_length=3, choices=EOI_STATUSES, default=EOI_STATUSES.open)
    title = models.CharField(max_length=255)
    country_code = models.CharField(max_length=2, choices=COUNTRIES_ALPHA2_CODE)
    agency = models.ForeignKey('agency.Agency', related_name="expressions_of_interest")
    created_by = models.ForeignKey('account.User', related_name="expressions_of_interest")
    # focal_point - limited to users under agency
    focal_points = models.ManyToManyField('account.User', related_name="eoi_focal_points")
    locations = models.ManyToManyField('common.Point', related_name="expressions_of_interest")
    agency_office = models.ForeignKey('agency.AgencyOffice', related_name="expressions_of_interest")
    # always be taken from the agency; we always keep their base template of the one they used.
    cn_template = models.FileField(null=True, blank=True)
    specializations = models.ManyToManyField('common.Specialization', related_name="expressions_of_interest")
    # TODO: intended_pop_of_concern = Selection. Should have in help text only for UNHCR. TODO on select options
    description = models.CharField(max_length=200, verbose_name='Brief background of the project')
    goal = models.CharField(
        max_length=200, null=True, blank=True, verbose_name='Goal, Objective, Expected Outcome and Results.')
    other_information = models.CharField(
        max_length=200, null=True, blank=True, verbose_name='Other information (optional)')
    start_date = models.DateField(verbose_name='Estimated Start Date')
    end_date = models.DateField(verbose_name='Estimated End Date')
    deadline_date = models.DateField(verbose_name='Estimated Deadline Date', null=True, blank=True)
    notif_results_date = models.DateField(verbose_name='Notification of Results Date', null=True, blank=True)
    has_weighting = models.BooleanField(default=True, verbose_name='Has weighting?')
    invited_partners = \
        models.ManyToManyField('partner.Partner', related_name="expressions_of_interest", blank=True)
    reviewers = \
        models.ManyToManyField('account.User', related_name="eoi_as_reviewer", blank=True)
    justification = models.TextField(null=True, blank=True)  # closed or completed
    completed_reason = models.CharField(max_length=3, choices=COMPLETED_REASON, null=True, blank=True)
    selected_source = models.CharField(max_length=3, choices=DIRECT_SELECTION_SOURCE, null=True, blank=True)

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "EOI: {} <pk:{}>".format(self.title, self.id)

    @property
    def is_direct(self):
        return self.display_type == EOI_TYPES.direct

    @property
    def is_overdue_deadline(self):
        return self.deadline_date < date.today()

    @property
    def contains_the_winners(self):
        return self.applications.filter(did_win=True).exists()


class Pin(TimeStampedModel):
    eoi = models.ForeignKey(EOI, related_name="pins")
    partner = models.ForeignKey('partner.Partner', related_name="pins")
    pinned_by = models.ForeignKey('account.User', related_name="pins")

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Pin <pk:{}> (eoi:{})".format(self.id, self.eoi_id)


class Application(TimeStampedModel):
    is_unsolicited = models.BooleanField(default=False, verbose_name='Is unsolicited?')
    proposal_of_eoi_details = JSONField(
        default=dict([('locations', []), ('title', ''), ('agency_id', None), ('specializations', [])])
    )
    partner = models.ForeignKey('partner.Partner', related_name="applications")
    eoi = models.ForeignKey(EOI, related_name="applications", null=True, blank=True)
    submitter = models.ForeignKey('account.User', related_name="applications")
    cn = models.FileField()
    status = models.CharField(max_length=3, choices=APPLICATION_STATUSES, default=APPLICATION_STATUSES.pending)
    did_win = models.BooleanField(default=False, verbose_name='Did win?')
    did_accept = models.BooleanField(default=False, verbose_name='Did accept?')
    # These two (ds_justification_*) will be used as direct selection will create applications for DS EOIs.
    # hq information
    ds_justification_select = ArrayField(
        models.CharField(max_length=3, choices=JUSTIFICATION_FOR_DIRECT_SELECTION),
        default=list,
        null=True
    )
    justification_reason = models.TextField(null=True, blank=True)  # reason why we choose winner

    class Meta:
        ordering = ['id']
        unique_together = (("eoi", "partner"), )

    def __str__(self):
        return "Application <pk:{}>".format(self.id)


class ApplicationFeedback(TimeStampedModel):
    application = models.ForeignKey(Application, related_name="application_feedbacks")
    provider = models.ForeignKey('account.User', related_name="application_feedbacks")
    feedback = models.TextField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "ApplicationFeedback <pk:{}>".format(self.id)


class AssessmentCriteria(TimeStampedModel):
    eoi = models.ForeignKey(EOI, related_name="assessments_criteria")
    display_type = models.CharField(
        max_length=3,
        choices=SELECTION_CRITERIA_CHOICES,
        default=SELECTION_CRITERIA_CHOICES.sector,
    )
    goal = models.CharField(
        max_length=200, null=True, blank=True, verbose_name='Goal, Objective, Expected Outcome and Results.')
    scale = models.CharField(
        max_length=3,
        choices=SCALE_TYPES,
        default=SCALE_TYPES.standard,
    )
    weight = models.PositiveSmallIntegerField(
        "Weight in percentage",
        help_text="Value in percentage, provide number from 0 to 100",
        default=100,
        validators=[MaxValueValidator(100), MinValueValidator(1)]
    )
    description = models.TextField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "AssessmentCriteria <pk:{}>".format(self.id)


class Assessment(TimeStampedModel):
    criteria = models.ForeignKey(AssessmentCriteria, related_name="assessments")

    reviewer = models.ForeignKey('account.User', related_name="assessments")
    application = models.ForeignKey(Application, related_name="assessments")
    score = models.PositiveIntegerField()
    date_reviewed = models.DateField(verbose_name='Date reviewed')

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "Assessment <pk:{}>".format(self.id)

    __total_score = None

    @property
    def total_score(self):
        if self.__total_score is None:
            self.__total_score = Assessment.objects.filter(
                cirteria__eoi=self.criteria.eoi
            ).aggregate(Sum('score')).get('score__sum') or 0
        else:
            return self.__total_score

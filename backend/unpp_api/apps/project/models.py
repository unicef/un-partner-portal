# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.db.models import Sum
from django.core.validators import MaxValueValidator, MinValueValidator
from model_utils.models import TimeStampedModel
from common.consts import (
    EOI_TYPE,
    APPLICATION_STATUS,
    SCALE_TYPE,
)


class EOI(TimeStampedModel):
    """
    Call of Expression of Interest
    """
    # TODO: this model is very heavy !!! we should think to split fields like file texts to some "EOI_profil" ..
    display_type = models.CharField(max_length=3, choices=EOI_TYPE, default=EOI_TYPE.open)
    is_closed = models.BooleanField(default=True, verbose_name='Is closed?')
    title = models.CharField(max_length=255)
    country = models.ForeignKey('common.Country', related_name="expressions_of_interest")
    agency = models.ForeignKey('agency.Agency', related_name="expressions_of_interest")
    created_by = models.ForeignKey('account.User', related_name="expressions_of_interest")
    # focal_point - limited to users under agency
    focal_point = models.ForeignKey('account.User', related_name="expressions_of_interest_by_focal_point")
    locations = models.ManyToManyField('common.Point', related_name="expressions_of_interest")
    agency_office = models.ForeignKey('agency.AgencyOffice', related_name="expressions_of_interest")
    cn_template = models.FileField()  # or take it from agency or agency office
    specializations = models.ManyToManyField('common.Specialization', related_name="expressions_of_interest")
    # TODO: intended_pop_of_concern = Selection. Should have in help text only for UNHCR. TODO on select options
    description = models.CharField(max_length=200, verbose_name='Brief background of the project')
    other_information = models.CharField(max_length=200, verbose_name='Other information (optional)')
    start_date = models.DateField(verbose_name='Estimated Start Date')
    end_date = models.DateField(verbose_name='Estimated End Date')
    deadline_date = models.DateField(verbose_name='Estimated Deadline Date')
    notif_results_date = models.DateField(verbose_name='Notification of Results Date')
    has_weighting = models.BooleanField(default=True, verbose_name='Has weighting?')  # TBD - not even sure we need to store
    invited_partners = models.ManyToManyField('partner.Partner', related_name="expressions_of_interest")
    reviewers = models.ManyToManyField('account.User', related_name="expressions_of_interest_by_reviewers")
    closed_justification = models.TextField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "EOI: {} <pk:{}>".format(self.title, self.id)

    @property
    def is_direct(self):
        return self.display_type == EOI_TYPE.direct


class Application(TimeStampedModel):
    is_unsolicited = models.BooleanField(default=False, verbose_name='Is unsolicited?')
    partner = models.ForeignKey('partner.Partner', related_name="applications")
    eoi = models.ForeignKey(EOI, related_name="applications")
    submitter = models.ForeignKey('account.User', related_name="applications")
    agency = models.ForeignKey('agency.Agency', related_name="applications")
    cn = models.FileField()
    status = models.CharField(max_length=3, choices=APPLICATION_STATUS, default=APPLICATION_STATUS.pending)
    did_win = models.BooleanField(default=False, verbose_name='Did win?')
    did_accept = models.BooleanField(default=False, verbose_name='Did accept?')
    # These two (ds_justification_*) will be used as direct selection will create applications for DS EOIs.
    ds_justification_select = models.TextField()  # if direct select
    ds_justification_reason = models.TextField()  # reason why we choose winner

    class Meta:
        ordering = ['id']

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
    # TODO: display_type = Selection of criteria types
    scale = models.CharField(
        max_length=3,
        choices=SCALE_TYPE,
        default=SCALE_TYPE.standard,
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


class ApplicationReview(TimeStampedModel):
    application = models.ForeignKey(Application, related_name="application_reviews")
    reviewer = models.ForeignKey('account.User', related_name="application_reviews")

    __total_score = None

    @property
    def total_score(self):
        if self.__total_score is None:
            self.__total_score = ApplicationReviewCriteria.objects.filter(
                application_review=self
            ).aggregate(Sum('score')).get('score__sum') or 0
        else:
            return self.__total_score


class ApplicationReviewCriteria(TimeStampedModel):

    application_review = models.ForeignKey(ApplicationReview, related_name="application_review_criterias")
    criteria = models.ForeignKey(AssessmentCriteria, related_name="application_review_criterias")
    score = models.PositiveSmallIntegerField(default=1, validators=[MaxValueValidator(100), MinValueValidator(1)])

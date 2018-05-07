# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from datetime import date

from django.contrib.postgres.fields import ArrayField, JSONField
from django.db import models
from model_utils.models import TimeStampedModel
from common.consts import (
    EOI_TYPES,
    APPLICATION_STATUSES,
    EOI_STATUSES,
    DIRECT_SELECTION_SOURCE,
    JUSTIFICATION_FOR_DIRECT_SELECTION,
    COMPLETED_REASON,
    EXTENDED_APPLICATION_STATUSES,
)
from common.utils import get_countries_code_from_queryset, get_absolute_frontend_url
from project.validators import (
    validate_weight_adjustments,
)


class EOI(TimeStampedModel):
    """
    Call of Expression of Interest
    """
    # TODO: this model is very heavy !!! we should think to split fields like file texts to some "EOI_profil" ..
    display_type = models.CharField(max_length=3, choices=EOI_TYPES, default=EOI_TYPES.open)
    title = models.CharField(max_length=255)
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
    description = models.CharField(max_length=5000, verbose_name='Brief background of the project')
    goal = models.CharField(
        max_length=5000, null=True, blank=True, verbose_name='Goal, Objective, Expected Outcome and Results.')
    other_information = models.CharField(
        max_length=5000, null=True, blank=True, verbose_name='Other information (optional)')
    start_date = models.DateField(verbose_name='Estimated Start Date')
    end_date = models.DateField(verbose_name='Estimated End Date')
    deadline_date = models.DateField(verbose_name='Estimated Deadline Date', null=True, blank=True)
    notif_results_date = models.DateField(verbose_name='Notification of Results Date', null=True, blank=True)
    has_weighting = models.BooleanField(default=True, verbose_name='Has weighting?')
    invited_partners = models.ManyToManyField('partner.Partner', related_name="expressions_of_interest", blank=True)
    reviewers = models.ManyToManyField('account.User', related_name="eoi_as_reviewer", blank=True)
    justification = models.TextField(null=True, blank=True)  # closed or completed
    completed_reason = models.CharField(max_length=3, choices=COMPLETED_REASON, null=True, blank=True)
    completed_date = models.DateTimeField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    selected_source = models.CharField(max_length=3, choices=DIRECT_SELECTION_SOURCE, null=True, blank=True)
    assessments_criteria = JSONField(
        default=dict([('selection_criteria', ''), ('weight', 0)]),
        validators=[validate_weight_adjustments]
    )
    review_summary_comment = models.TextField(null=True, blank=True)
    review_summary_attachment = models.ForeignKey(
        'common.CommonFile', null=True, blank=True, related_name='review_summary_attachments')

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "EOI {} <pk:{}>".format(self.title, self.id)

    @property
    def status(self):
        today = date.today()
        if self.is_completed:
            return EOI_STATUSES.completed
        elif self.is_completed is False and self.deadline_date and today > self.deadline_date:
            return EOI_STATUSES.closed
        else:
            return EOI_STATUSES.open

    @property
    def is_open(self):
        return self.display_type == EOI_TYPES.open

    @property
    def is_direct(self):
        return self.display_type == EOI_TYPES.direct

    @property
    def is_overdue_deadline(self):
        return self.deadline_date < date.today()

    @property
    def contains_the_winners(self):
        return self.applications.filter(did_win=True).exists()

    @property
    def contains_partner_accepted(self):
        return self.applications.filter(did_accept=True, did_withdraw=False).exists()

    def get_assessment_criteria_as_dict(self):
        output = {}
        for criteria in self.assessments_criteria:
            copied_criteria = criteria.copy()
            criteria_name = copied_criteria.pop('selection_criteria')
            output[criteria_name] = copied_criteria
        return output

    @property
    def is_weight_adjustments_ok(self):
        return sum(map(lambda x: x.get('weight'), self.assessments_criteria)) == 100 if self.has_weighting else True

    def get_absolute_url(self):
        return get_absolute_frontend_url("/cfei/open/{}/overview".format(self.pk))


class Pin(TimeStampedModel):
    eoi = models.ForeignKey(EOI, related_name="pins")
    partner = models.ForeignKey('partner.Partner', related_name="pins")
    pinned_by = models.ForeignKey('account.User', related_name="pins")

    class Meta:
        ordering = ['id']
        unique_together = (('eoi', 'partner'), )

    def __str__(self):
        return "Pin <pk:{}> (eoi:{})".format(self.id, self.eoi_id)


class ApplicationQuerySet(models.QuerySet):

    def winners(self):
        return self.filter(did_win=True, did_accept=True, did_withdraw=False)

    def losers(self):
        return self.filter(did_win=False)


class Application(TimeStampedModel):
    is_unsolicited = models.BooleanField(default=False, verbose_name='Is unsolicited?')
    proposal_of_eoi_details = JSONField(default=dict([('title', ''), ('specializations', [])]))
    locations_proposal_of_eoi = models.ManyToManyField('common.Point', related_name="applications", blank=True)
    partner = models.ForeignKey('partner.Partner', related_name="applications")
    eoi = models.ForeignKey(EOI, related_name="applications", null=True, blank=True)
    agency = models.ForeignKey('agency.Agency', related_name="applications")
    submitter = models.ForeignKey('account.User', related_name="applications")
    cn = models.ForeignKey('common.CommonFile', related_name="concept_notes", null=True, blank=True)
    status = models.CharField(max_length=3, choices=APPLICATION_STATUSES, default=APPLICATION_STATUSES.pending)
    did_win = models.BooleanField(default=False, verbose_name='Did win?')
    did_accept = models.BooleanField(default=False, verbose_name='Did accept?')
    decision_date = models.DateField(null=True, blank=True)  # for accept or decline
    accept_notification = models.OneToOneField(
        'notification.Notification', related_name="accept_notification", null=True, blank=True
    )
    did_decline = models.BooleanField(default=False, verbose_name='Did decline?')
    # did_withdraw is only applicable if did_win is True
    did_withdraw = models.BooleanField(default=False, verbose_name='Did withdraw?')
    withdraw_reason = models.TextField(null=True, blank=True)  # reason why partner withdraw
    # These two (ds_justification_*) will be used as direct selection will create applications for DS EOIs.
    # hq information
    ds_justification_select = ArrayField(
        models.CharField(max_length=3, choices=JUSTIFICATION_FOR_DIRECT_SELECTION),
        default=list,
        null=True,
        blank=True,
    )
    # Applies when application converted to EOI. Only applicable if this is unsolicited
    eoi_converted = models.OneToOneField(EOI, related_name="unsolicited_conversion", null=True, blank=True)
    justification_reason = models.TextField(null=True, blank=True)  # reason why we choose winner

    objects = ApplicationQuerySet.as_manager()

    class Meta:
        ordering = ['id']
        unique_together = (("eoi", "partner"), )

    def __str__(self):
        return "Application <pk:{}>".format(self.id)

    @property
    def cfei_type(self):
        if self.is_unsolicited:
            return 'Unsolicited Concept Note'
        elif self.eoi.is_open:
            return 'Open Selection'
        elif self.eoi.is_direct:
            return 'Direct Selection'

    @property
    def project_title(self):
        if self.is_unsolicited:
            return self.proposal_of_eoi_details.get('title')
        else:
            return self.eoi.title

    @property
    def countries(self):
        if self.is_unsolicited:
            country = self.locations_proposal_of_eoi
        else:
            country = self.eoi.locations
        if country:
            # we expecting here few countries
            return get_countries_code_from_queryset(country)
        return None

    @property
    def partner_is_verified(self):
        return self.partner.is_verified

    @property
    def application_status(self):
        # Any changes made here should be reflected in ApplicationsFilter.filter_applications_status
        if not self.did_win and self.eoi and self.eoi.status == EOI_STATUSES.completed:
            return EXTENDED_APPLICATION_STATUSES.unsuccessful
        elif self.did_win and self.did_withdraw:
            return EXTENDED_APPLICATION_STATUSES.retracted
        elif self.did_win and self.did_decline is False and self.did_accept is False and self.decision_date is None:
            return EXTENDED_APPLICATION_STATUSES.successful
        elif self.did_win and self.did_accept and self.decision_date is not None:
            return EXTENDED_APPLICATION_STATUSES.accepted
        elif self.did_win and self.did_decline and self.decision_date is not None:
            return EXTENDED_APPLICATION_STATUSES.declined
        return EXTENDED_APPLICATION_STATUSES.review

    # RETURNS [{u'Cos': {u'scores': [23, 13], u'weight': 30}, u'avg': 23..]
    def get_scores_by_selection_criteria(self):
        assessments_criteria = self.eoi.get_assessment_criteria_as_dict()
        for assessment in self.assessments.all():
            for key, val in assessment.get_scores_as_dict().iteritems():
                assessments_criteria[key].setdefault('scores', []).append(val['score'])

        for key in assessments_criteria.keys():
            scores = assessments_criteria[key].get('scores', [])
            if len(scores) != 0:
                assessments_criteria[key]['avg'] = sum(scores) / (len(scores))

        return assessments_criteria

    @property
    def average_total_score(self):
        assessments_qs = self.assessments.all()
        count = assessments_qs.count()
        if count != 0:
            return sum([x.total_score for x in assessments_qs]) / count  # we expect to have integer
        return 0

    @property
    def assessments_is_completed(self):
        return self.eoi and self.eoi.reviewers.count() == self.assessments.filter(
            reviewer__in=self.eoi.reviewers.all()
        ).count()

    def get_absolute_url(self):
        return get_absolute_frontend_url("/cfei/open/{}/applications/{}".format(self.eoi.pk, self.pk))


class ApplicationFeedback(TimeStampedModel):
    application = models.ForeignKey(Application, related_name="application_feedbacks")
    provider = models.ForeignKey('account.User', related_name="application_feedbacks")
    feedback = models.TextField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return "ApplicationFeedback <pk:{}>".format(self.id)


class AssessmentManager(models.Manager):

    def get_queryset(self):
        return super(AssessmentManager, self).get_queryset().filter(archived=False)


class Assessment(TimeStampedModel):
    created_by = models.ForeignKey('account.User', related_name="assessments_creator")
    modified_by = models.ForeignKey('account.User', related_name="assessments_editor", null=True, blank=True)
    reviewer = models.ForeignKey('account.User', related_name="assessments")
    application = models.ForeignKey(Application, related_name="assessments")
    scores = JSONField(default=[dict((('selection_criteria', None), ('score', 0)))])
    date_reviewed = models.DateField(auto_now=True, verbose_name='Date reviewed')
    note = models.TextField(null=True, blank=True)
    archived = models.BooleanField(default=False)

    class Meta:
        ordering = ['id']
        unique_together = (("reviewer", "application"), )

    def __str__(self):
        return "Assessment <pk:{}>".format(self.id)

    objects = AssessmentManager()
    all_objects = models.Manager()

    __total_score = None

    @property
    def total_score(self):
        if self.__total_score is None:
            app_eoi = self.application.eoi
            if not app_eoi.has_weighting:
                self.__total_score = sum([x['score'] for x in self.scores])
            else:
                assessment_weights = app_eoi.get_assessment_criteria_as_dict()
                comb_dict = assessment_weights.copy()
                for k, v in self.get_scores_as_dict().iteritems():
                    comb_dict[k]['score'] = v['score']

                self.__total_score = sum([v['score'] for v in comb_dict.values()])

        return self.__total_score

    def get_scores_as_dict(self):
        output = {}
        for score in self.scores:
            copied_score = score.copy()
            criteria_name = copied_score.pop('selection_criteria')
            output[criteria_name] = copied_score
        return output

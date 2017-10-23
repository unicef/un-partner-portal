# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
from django.core.mail import send_mail
from django.conf import settings
from django.template import Context, Template


def send_notification(subject, body, cc=[]):
    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, cc)


def get_template_as_str(filename, context):
    main_dir_name = os.path.dirname(os.path.abspath(__file__))
    temp_file = open(os.path.join(main_dir_name, 'standard_emails', filename))
    template = Template(temp_file.read())
    return template.render(Context(context))


def send_account_approval_activated_create_profile(context, cc):
    subject = "Title"
    body = get_template_as_str('account_approval_activated_create_profile', context)
    send_notification(subject, body, cc)


def send_account_approval_activated_sent_to_head_org(context, cc):
    subject = "Title"
    body = get_template_as_str('account_approval_activated_sent_to_head_org', context)
    send_notification(subject, body, cc)


def send_account_approval_rejection_application_duplicate(context, cc):
    subject = "Title"
    body = get_template_as_str('account_approval_rejection_application_duplicate', context)
    send_notification(subject, body, cc)


def send_account_approval_rejection_sanctions_list(context, cc):
    subject = "Title"
    body = get_template_as_str('account_approval_rejection_sanctions_list', context)
    send_notification(subject, body, cc)


def send_account_creation_rejection(context, cc):
    subject = "Title"
    body = get_template_as_str('account_creation_rejection', context)
    send_notification(subject, body, cc)


def send_cancel_cfei(context, cc):
    subject = "Title"
    body = get_template_as_str('cancel_CFEI', context)
    send_notification(subject, body, cc)


def send_cn_assessment(context, cc):
    subject = "Title"
    body = get_template_as_str('CN_Assessment', context)
    send_notification(subject, body, cc)


def send_cn_assessment_not_successful(context, cc):
    subject = "Title"
    body = get_template_as_str('cn_assessment_not_successful', context)
    send_notification(subject, body, cc)


def send_cn_assessment_successful(context, cc):
    subject = "Title"
    body = get_template_as_str('CN_Assessment_successful', context)
    send_notification(subject, body, cc)


def send_cn_submission(context, cc):
    subject = "Title"
    body = get_template_as_str('CN_Submission', context)
    send_notification(subject, body, cc)


def send_cn_unsolicited(context, cc):
    subject = "Title"
    body = get_template_as_str('CN_Unsolicited', context)
    send_notification(subject, body, cc)


def send_direct_selection_un_initiated(context, cc):
    subject = "Title"
    body = get_template_as_str('direct_selection_UN_initiated', context)
    send_notification(subject, body, cc)


def send_direct_selection_via_ucn(context, cc):
    subject = "Title"
    body = get_template_as_str('direct_selection_via_UCN', context)
    send_notification(subject, body, cc)


def send_new_cfei_inviting(context, cc):
    subject = "Title"
    body = get_template_as_str('New_CFEI_inviting', context)
    send_notification(subject, body, cc)


def send_update_cfei_prev_invited_submited_app(context, cc):
    subject = "Title"
    body = get_template_as_str('Update_CFEI_prev_invited_submited_app', context)
    send_notification(subject, body, cc)

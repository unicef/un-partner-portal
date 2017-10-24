# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from django.template import Context, Template
from .models import Notification, NotifiedUser


@transaction.atomic
def feed_alert(source, subject, body, context):
    notification = Notification.objects.create(
        name=subject,
        description=body,
        source=source
    )
    notified_users = []
    for recipient_id in context.get('notified_users_pks'):
        notified_users.append(NotifiedUser(notification=notification, did_read=False, recipient_id=recipient_id))
    NotifiedUser.objects.bulk_create(notified_users)


def send_notification(subject, body, cc=[]):
    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, cc)


def get_template_as_str(filename, context):
    main_dir_name = os.path.dirname(os.path.abspath(__file__))
    temp_file = open(os.path.join(main_dir_name, 'standard_emails', filename))
    template = Template(temp_file.read())
    return template.render(Context(context))


def send_account_approval_activated_create_profile(context, cc):
    source = 'account_approval_activated_create_profile'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)


def send_account_approval_activated_sent_to_head_org(context, cc):
    source = 'account_approval_activated_sent_to_head_org'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)


def send_account_approval_rejection_application_duplicate(context, cc):
    source = 'account_approval_rejection_application_duplicate'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)


def send_account_approval_rejection_sanctions_list(context, cc):
    source = 'account_approval_rejection_application_duplicate'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)


def send_account_creation_rejection(context, cc):
    source = 'account_approval_rejection_application_duplicate'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)


def send_cancel_cfei(context, cc):
    source = 'cancel_CFEI'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)


def send_cn_assessment(context, cc):
    source = 'CN_Assessment'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)


def send_cn_assessment_not_successful(context, cc):
    source = 'cn_assessment_not_successful'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)


def send_cn_assessment_successful(context, cc):
    source = 'CN_Assessment_successful'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)


def send_cn_submission(context, cc):
    source = 'CN_Submission'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)


def send_cn_unsolicited(context, cc):
    source = 'CN_Unsolicited'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)


def send_direct_selection_un_initiated(context, cc):
    source = 'direct_selection_UN_initiated'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)


def send_direct_selection_via_ucn(context, cc):
    source = 'direct_selection_via_UCN'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)


def send_new_cfei_inviting(context, cc):
    source = 'New_CFEI_inviting'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)


def send_update_cfei_prev_invited_submited_app(context, cc):
    source = 'Update_CFEI_prev_invited_submited_app'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, cc)
    feed_alert(source, subject, body, context)

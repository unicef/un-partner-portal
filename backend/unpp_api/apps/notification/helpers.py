# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from django.template import Context, Template

from account.models import User
from common.consts import COMPLETED_REASON, MEMBER_ROLES
from .models import Notification, NotifiedUser


@transaction.atomic
def feed_alert(source, subject, body, users, obj):
    notification = Notification.objects.create(
        name=subject,
        description=body,
        source=source,
        content_object=obj,
    )
    notified_users = []
    for user in users:
        notified_users.append(NotifiedUser(notification=notification, did_read=False, recipient_id=user.id))
    NotifiedUser.objects.bulk_create(notified_users)


def send_notification(subject, body, users=[]):
    cc = list(users.values_list('email', flat=True))
    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, cc)


def get_template_as_str(filename, context):
    main_dir_name = os.path.dirname(os.path.abspath(__file__))
    temp_file = open(os.path.join(main_dir_name, 'standard_emails', filename))
    template = Template(temp_file.read())
    return template.render(Context(context))


# Return all partner members. Potential limit in future?
def get_notify_partner_users_for_application(application):
    users = User.objects.filter(partner_members__partner=application.partner)
    return users.distinct()


def get_partner_users_for_app_qs(application_qs):
    notify_user_ids = []
    for application in application_qs:
        users_qs = get_notify_partner_users_for_application(application)
        notify_user_ids.extend(list(users_qs.values_list('id', flat=True)))

    return User.objects.filter(id__in=notify_user_ids)


def send_account_approval_activated_create_profile(context, users, obj=None):
    source = 'account_approval_activated_create_profile'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, obj)


def send_account_approval_activated_sent_to_head_org(context, users, obj=None):
    source = 'account_approval_activated_sent_to_head_org'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, obj)


def send_account_approval_rejection_application_duplicate(context, users, obj=None):
    source = 'account_approval_rejection_application_duplicate'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, obj)


def send_account_approval_rejection_sanctions_list(context, users, obj=None):
    source = 'account_approval_rejection_application_duplicate'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, obj)


def send_account_creation_rejection(context, users, obj=None):
    source = 'account_approval_rejection_application_duplicate'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, obj)


### CFEI COMPLETED NOTIFICATIONS
def _send_cancel_cfei(eoi, context=None):
    source = 'cancel_CFEI'
    subject = "Title"

    users = get_partner_users_for_app_qs(eoi.applications.all())

    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, eoi)


def _send_cn_assessment_not_successful(eoi, context=None):
    source = 'cn_assessment_not_successful'
    subject = "Title"

    users = get_partner_users_for_app_qs(eoi.applications.losers())

    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, eoi)


def send_notification_cfei_completed(eoi):
    if eoi.completed_reason == COMPLETED_REASON.canceled:
        _send_cancel_cfei(eoi)

    if eoi.completed_reason == COMPLETED_REASON.partners:
        _send_cn_assessment_not_successful(eoi)

    if eoi.completed_reason == COMPLETED_REASON.no_candidate:
        # TODO - perhaps a different message?
        _send_cancel_cfei(eoi)



### Application Updated Notifications
def _send_cn_withdraw_notification(application, context=None):
    source = 'CN_Assessment_Withdraw'
    subject = "Title"

    users = get_notify_partner_users_for_application(application)

    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, application)


def _send_cn_selected_notification(application, context=None):
    source = 'CN_Assessment_successful'
    subject = "Title"

    users = get_notify_partner_users_for_application(application)

    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, application)


def send_notification_application_updated(application):

    if application.eoi.is_open:
        # if did win
        if application.did_win:
            _send_cn_selected_notification(application)

        # if did withdraw
        if application.did_withdraw:
            _send_cn_withdraw_notification(application)


### Application Created Notifications
def _send_cn_submission(application, context=None):
    source = 'CN_Submission'
    subject = "Title"

    users = get_notify_partner_users_for_application(application)

    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, application)


def _send_cn_unsolicited(application, context=None):
    source = 'CN_Unsolicited'
    subject = "Title"

    users = get_notify_partner_users_for_application(application)

    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, application)



def _send_direct_selection_un_initiated(application, context=None):
    source = 'direct_selection_UN_initiated'
    subject = "Title"

    users = get_notify_partner_users_for_application(application)

    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, application)


def _send_direct_selection_via_ucn(application, context=None):
    source = 'direct_selection_via_UCN'
    subject = "Title"

    users = get_notify_partner_users_for_application(application)

    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, application)


def send_notificiation_application_created(application):

    if application.eoi:
        if application.eoi.is_open:
            _send_cn_submission(application)

        if application.eoi.is_direct:
            _send_direct_selection_un_initiated(application)

        if application.eoi.is_direct and application.eoi.unsolicited_conversion:
            _send_direct_selection_via_ucn(application)

    else:
        if application.is_unsolicited:
            _send_cn_unsolicited(application)


### Misc / Other
def send_new_cfei_inviting(context, users, obj=None):
    source = 'New_CFEI_inviting'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, obj)


def send_update_cfei_prev_invited_submited_app(context, users, obj=None):
    source = 'Update_CFEI_prev_invited_submited_app'
    subject = "Title"
    body = get_template_as_str(source, context)
    send_notification(subject, body, users)
    feed_alert(source, subject, body, users, obj)

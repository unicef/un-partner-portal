# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os
from django.db import transaction
from django.core.mail import send_mail
from django.conf import settings
from django.template import Context, Template
from django.contrib.contenttypes.models import ContentType

from account.models import User
from common.consts import COMPLETED_REASON
from .models import Notification, NotifiedUser
from .consts import NOTIFICATION_DATA


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


def send_notification(notification_type, obj, users, context=None, send_in_feed=True,
                      check_sent_for_source=True):
    """
        notification_type - check NotificationType class in const.py
        obj - object directly associated w/ notification. generic fk to it
        users - users who are receiving notif
        context - context to provide to template for email or body of notif
        send_in_feed - create notification feed element
        check_sent_for_source - checks to confirm no duplicates are sent for source + object. false bypasses

    """

    if check_sent_for_source and notification_already_sent(obj, notification_type):
        return

    notification_info = NOTIFICATION_DATA.get(notification_type)

    targets = [u.email for u in users]
    body = get_template_as_str(notification_info.get('template_name'), context)
    send_mail(notification_info.get('subject'), body, settings.DEFAULT_FROM_EMAIL, targets)

    if send_in_feed:
        feed_alert(notification_type, notification_info.get('subject'), body, users, obj)


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


# We don't want to send 2x of the same notification
def notification_already_sent(obj, notification_source):
    content_type = ContentType.objects.get_for_model(obj)
    return Notification.objects.filter(object_id=obj.id,
                                       source=notification_source,
                                       content_type=content_type).exists()


def send_notification_cfei_completed(eoi):
    if eoi.completed_reason == COMPLETED_REASON.canceled:
        users = get_partner_users_for_app_qs(eoi.applications.all())
        send_notification('cfei_cancel', eoi, users)

    if eoi.completed_reason == COMPLETED_REASON.partners:
        users = get_partner_users_for_app_qs(eoi.applications.losers())
        send_notification('cfei_application_lost', eoi, users)

    if eoi.completed_reason == COMPLETED_REASON.no_candidate:
        # TODO - perhaps a different message?
        users = get_partner_users_for_app_qs(eoi.applications.all())
        send_notification('cfei_application_lost', eoi, users)


def send_notification_application_updated(application):

    if application.eoi.is_open:
        # if did win
        if application.did_win:
            users = get_notify_partner_users_for_application(application)
            send_notification('cfei_application_selected', application, users)

        # if did withdraw
        if application.did_withdraw:
            users = get_notify_partner_users_for_application(application)
            send_notification('cfei_application_withdraw', application, users)


def send_notificiation_application_created(application):

    if application.eoi:
        if application.eoi.is_open:
            users = get_notify_partner_users_for_application(application)
            send_notification('cfei_application_submitted', application, users)

        if application.eoi.is_direct:
            users = get_notify_partner_users_for_application(application)
            send_notification('unsol_application_submitted', application, users)

        if application.eoi.is_direct and application.eoi.unsolicited_conversion:
            users = get_notify_partner_users_for_application(application)
            send_notification('direct_select_un_int', application, users,
                              context={'eoi_title': application.eoi.title})

        # Alert Agency Users if accept / decline
        if application.did_win:
            if application.did_accept or application.did_decline:
                notify_ids = list(application.eoi.focal_points.all().values_list('id', flat=True))
                notify_ids.append(application.eoi.created_by.id)
                notify_users = User.objects.filter(id__in=notify_ids).distinct()
                send_notification('agency_application_decision_made', application, notify_users)

    else:
        if application.is_unsolicited:
            users = get_notify_partner_users_for_application(application)
            send_notification('direct_select_ucn', application, users)


# TODO - below
# def send_account_approval_activated_create_profile(context, users, obj=None):
#     source = 'account_approval_activated_create_profile'
#     subject = "Title"
#     send_notification(subject, source, context, obj, users)


# def send_account_approval_activated_sent_to_head_org(context, users, obj=None):
#     source = 'account_approval_activated_sent_to_head_org'
#     subject = "Title"
#     send_notification(subject, source, context, obj, users)


# def send_account_approval_rejection_application_duplicate(context, users, obj=None):
#     source = 'account_approval_rejection_application_duplicate'
#     subject = "Title"
#     send_notification(subject, source, context, obj, users)


# def send_account_approval_rejection_sanctions_list(context, users, obj=None):
#     source = 'account_approval_rejection_application_duplicate'
#     subject = "Title"
#     send_notification(subject, source, context, obj, users)


# def send_account_creation_rejection(context, users, obj=None):
#     source = 'account_approval_rejection_application_duplicate'
#     subject = "Title"
#     send_notification(subject, source, context, obj, users)


# TODO
# Agency deadline
# Agency accept/decline response from partners

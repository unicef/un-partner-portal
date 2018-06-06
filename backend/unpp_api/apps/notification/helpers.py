# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.core.mail import send_mass_mail
from django.template import loader
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone

from account.models import User
from common.consts import COMPLETED_REASON, CFEI_STATUSES
from notification.models import Notification, NotifiedUser
from notification.consts import NOTIFICATION_DATA, NotificationType


def send_notification(notification_type, obj, users, context=None, send_in_feed=True, check_sent_for_source=True):
    """
    notification_type - check NotificationType class in const.py
    obj - object directly associated w/ notification. generic fk to it
    users - users who are receiving notification
    context - context to provide to template for email or body of notification
    send_in_feed - create notification feed element
    check_sent_for_source - checks to confirm no duplicates are sent for source + object. false bypasses
    """

    if check_sent_for_source and notification_already_sent(obj, notification_type):
        return

    notification_payload = NOTIFICATION_DATA.get(notification_type)

    body = render_notification_template_to_str(notification_payload.get('template_name'), context)

    notification = Notification.objects.create(
        name=notification_payload.get('subject'),
        description=body,
        source=notification_type,
        content_object=obj,
    )

    NotifiedUser.objects.bulk_create([NotifiedUser(
        notification=notification,
        did_read=not send_in_feed,
        recipient_id=user.id
    ) for user in users])

    return notification


def render_notification_template_to_str(template_name, context):
    return loader.get_template('notifications/{}'.format(template_name)).render(context)


def get_notify_partner_users_for_application(application):
    return User.objects.filter(partner_members__partner=application.partner).distinct()


def get_partner_users_for_application_queryset(application_qs):
    return User.objects.filter(partner_members__partner__applications__in=application_qs).distinct()


# We don't want to send 2x of the same notification
def notification_already_sent(obj, notification_type):
    content_type = ContentType.objects.get_for_model(obj)
    return Notification.objects.filter(
        object_id=obj.id, source=notification_type, content_type=content_type
    ).exists()


def user_received_notification_recently(user, obj, notification_type, time_ago=relativedelta(days=1)):
    content_type = ContentType.objects.get_for_model(obj)
    return NotifiedUser.objects.filter(
        notification__source=notification_type,
        notification__object_id=obj.id,
        notification__content_type=content_type,
        recipient=user,
        created__gte=timezone.now() - time_ago
    ).exists()


def send_notification_cfei_completed(eoi):
    if eoi.completed_reason == COMPLETED_REASON.cancelled:
        users = get_partner_users_for_application_queryset(eoi.applications.all())
        send_notification(NotificationType.CFEI_CANCELLED, eoi, users)

    if eoi.completed_reason == COMPLETED_REASON.partners:
        users = get_partner_users_for_application_queryset(eoi.applications.losers())
        send_notification(NotificationType.CFEI_APPLICATION_LOSS, eoi, users)

    if eoi.completed_reason == COMPLETED_REASON.no_candidate:
        users = get_partner_users_for_application_queryset(eoi.applications.all())
        send_notification(NotificationType.CFEI_APPLICATION_LOSS, eoi, users)


def send_agency_updated_application_notification(application):
    if application.eoi.status == CFEI_STATUSES.open:
        users = get_notify_partner_users_for_application(application)

        if application.did_withdraw:
            send_notification(NotificationType.CFEI_APPLICATION_WITHDRAWN, application, users)
        elif application.did_win:
            notification = send_notification(NotificationType.CFEI_APPLICATION_WIN, application, users)
            if notification:
                application.accept_notification = notification
                application.save()


def send_partner_made_decision_notification(application):
    if application.eoi.status == CFEI_STATUSES.open:
        users = application.eoi.focal_points.all()

        if application.did_accept or application.did_decline:
            send_notification(NotificationType.PARTNER_DECISION_MADE, application, users)


def send_notification_application_created(application):
    users = get_notify_partner_users_for_application(application)
    if application.eoi:
        if application.eoi.is_open:
            send_notification(NotificationType.CFEI_APPLICATION_SUBMITTED, application, users)

        if application.eoi.is_direct:
            context = {'eoi_title': application.eoi.title}
            if hasattr(application.eoi, 'unsolicited_conversion'):
                notification_type = NotificationType.DIRECT_SELECTION_FROM_NOTE_INITIATED
            else:
                notification_type = NotificationType.DIRECT_SELECTION_INITIATED

            send_notification(notification_type, application, users, context=context)
    elif application.is_unsolicited:
        send_notification(NotificationType.UNSOLICITED_CONCEPT_NOTE_RECEIVED, application, users)


def send_cfei_review_required_notification(eoi, users):
    send_notification(
        NotificationType.CFEI_REVIEW_REQUIRED, eoi, users, send_in_feed=True, check_sent_for_source=False, context={
            'eoi_name': eoi.title,
            'eoi_url': eoi.get_absolute_url()
        }
    )


def send_notification_to_cfei_focal_points(eoi):
    content_type = ContentType.objects.get_for_model(eoi)
    users = eoi.focal_points.exclude(
        notified__notification__source=NotificationType.ADDED_AS_CFEI_FOCAL_POINT,
        notified__notification__object_id=eoi.id,
        notified__notification__content_type=content_type,
    )

    send_notification(
        NotificationType.ADDED_AS_CFEI_FOCAL_POINT, eoi, users,
        send_in_feed=True,
        check_sent_for_source=False,
        context={
            'eoi_name': eoi.title,
            'eoi_url': eoi.get_absolute_url()
        }
    )


def flush_email_notifications():
    if not settings.DEBUG:
        raise Exception('Run only during development')

    to_be_sent = NotifiedUser.objects.filter(sent_as_email=False).select_related('notification')

    # See https://docs.djangoproject.com/en/1.11/topics/email/#send-mass-mail
    messages = [(n[0], n[1], settings.DEFAULT_FROM_EMAIL, [n[2]]) for n in to_be_sent.values_list(
        'notification__name', 'notification__description', 'recipient__email'
    )]
    send_mass_mail(messages, fail_silently=False)
    to_be_sent.update(sent_as_email=True)

# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from collections import defaultdict

from dateutil.relativedelta import relativedelta
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import get_connection, EmailMultiAlternatives
from django.template import loader
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.utils.html import strip_tags

from account.models import User
from agency.roles import ESCALATED_FLAG_RESOLVER_ROLE_NAMES
from common.consts import COMPLETED_REASON, CFEI_STATUSES
from common.utils import get_absolute_frontend_url
from notification.models import Notification, NotifiedUser
from notification.consts import NOTIFICATION_DATA, NotificationType
from partner.models import Partner
from review.models import PartnerFlag


def send_notification(notification_type, obj, users, context=None, send_in_feed=True):
    """
    notification_type - check NotificationType class in const.py
    obj - object directly associated w/ notification. generic fk to it
    users - users who are receiving notification
    context - context to provide to template for email or body of notification
    send_in_feed - create notification feed element
    """
    notification_payload = NOTIFICATION_DATA.get(notification_type)

    body = render_notification_template_to_str(notification_payload.get('template_name'), context)

    notification = Notification.objects.create(
        name=notification_payload.get('subject'),
        description=body,
        source=notification_type,
        content_object=obj,
    )

    notified_users = []
    for user in users:
        user_has_emails_enabled = bool(user.profile.notification_frequency)
        if send_in_feed or user_has_emails_enabled:
            notified_users.append(NotifiedUser(
                notification=notification,
                did_read=not send_in_feed,
                sent_as_email=not user_has_emails_enabled,
                recipient_id=user.id
            ))

    NotifiedUser.objects.bulk_create(notified_users)

    return notification


def render_notification_template_to_str(template_name, context):
    return loader.get_template('notifications/{}'.format(template_name)).render(context)


def get_notify_partner_users_for_application(application):
    return User.objects.filter(partner_members__partner=application.partner).distinct()


def get_partner_users_for_application_queryset(application_qs):
    return User.objects.filter(partner_members__partner__applications__in=application_qs).distinct()


def user_received_notification_recently(user, obj, notification_type, time_ago=relativedelta(days=1)):
    content_type = ContentType.objects.get_for_model(obj)
    return NotifiedUser.objects.filter(
        notification__source=notification_type,
        notification__object_id=obj.id,
        notification__content_type=content_type,
        recipient=user,
        created__gte=timezone.now() - time_ago
    ).exists()


def send_eoi_sent_for_decision_notification(eoi):
    if eoi.sent_for_decision:
        users = eoi.focal_points.all()

        send_notification(NotificationType.CFEI_SENT_FOR_DECISION_MAKING, eoi, users, context={
            'eoi': eoi,
        })


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
    if application.did_accept or application.did_decline:
        send_notification(
            NotificationType.PARTNER_DECISION_MADE,
            application,
            application.eoi.focal_points.all(),
        )


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
        NotificationType.CFEI_REVIEW_REQUIRED, eoi, users, send_in_feed=True, context={
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
        id=eoi.created_by_id
    ).distinct('id')

    send_notification(
        NotificationType.ADDED_AS_CFEI_FOCAL_POINT, eoi, users,
        send_in_feed=True,
        context={
            'eoi_name': eoi.title,
            'eoi_url': eoi.get_absolute_url()
        }
    )


def send_notification_summary_to_notified_users(notified_users):
    aggregated_mail = defaultdict(list)
    mail_to_fullname = dict()

    for user_email, user_fullname, subject, body in notified_users.values_list(
            'recipient__email', 'recipient__fullname', 'notification__name', 'notification__description'
    ):
        aggregated_mail[user_email].append((subject, body))
        mail_to_fullname[user_email] = user_fullname

    connection = get_connection()

    mail_subject = 'UNPP Notification Summary'
    for email, messages in aggregated_mail.items():
        html_content = loader.get_template('notifications/notification_summary.html').render({
            'title': mail_subject,
            'user_fullname': mail_to_fullname[email],
            'messages': messages,
        })
        text_content = strip_tags(html_content)

        msg = EmailMultiAlternatives(
            mail_subject, text_content, settings.DEFAULT_FROM_EMAIL, [email], connection=connection
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send()

    notified_users.update(sent_as_email=True)


def send_partner_marked_for_deletion_email(partner: Partner):
    notification_payload = NOTIFICATION_DATA.get(NotificationType.DJANGO_ADMIN_NEW_PARTNER_FOR_DELETION)

    body = render_notification_template_to_str(notification_payload.get('template_name'), {
        'partner_name': partner.legal_name,
        'partner_id': partner.id,
    })

    msg = EmailMultiAlternatives(
        notification_payload['subject'],
        body,
        settings.DEFAULT_FROM_EMAIL,
        get_user_model().objects.filter(
            is_staff=True, is_superuser=True
        ).values_list('email', flat=True).order_by().distinct('email')
    )
    msg.send()


def send_new_escalated_flag_email(partner_flag: PartnerFlag):
    base_users_queryset = get_user_model().objects.filter(
        agency_members__role__in=ESCALATED_FLAG_RESOLVER_ROLE_NAMES,
        agency_members__office__agency=partner_flag.submitter.agency,
    )

    target_users = base_users_queryset.filter(agency_members__office__country=partner_flag.partner.country_code)
    if not target_users:
        # If no applicable users in partners country send notification to all
        target_users = base_users_queryset

    notification_payload = NOTIFICATION_DATA.get(NotificationType.NEW_ESCALATED_FLAG)

    body = render_notification_template_to_str(notification_payload.get('template_name'), {
        'partner_name': partner_flag.partner.legal_name,
        # TODO: replace with verification tab url once it's done on the frontend
        'partner_url': get_absolute_frontend_url(f'/partner/{partner_flag.partner.id}/overview')
    })

    msg = EmailMultiAlternatives(
        notification_payload['subject'],
        body,
        settings.DEFAULT_FROM_EMAIL,
        target_users.values_list('email', flat=True).order_by().distinct('email')
    )
    msg.send()

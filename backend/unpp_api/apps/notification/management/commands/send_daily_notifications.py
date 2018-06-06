from __future__ import absolute_import

from collections import defaultdict

from django.conf import settings
from django.core.mail import send_mass_mail
from django.core.management.base import BaseCommand

from common.consts import NOTIFICATION_FREQUENCY_CHOICES
from notification.models import NotifiedUser


class Command(BaseCommand):
    help = 'Immediately sends all queued EMail Notifications. For dev only use'

    def handle(self, *args, **options):
        aggregated_mail = defaultdict(list)
        mail_fullnames = dict()

        to_be_notified = NotifiedUser.objects.filter(
            sent_as_email=False, recipient__profile__notification_frequency=NOTIFICATION_FREQUENCY_CHOICES.daily
        )

        for user_email, user_fullname, subject, body in to_be_notified.values_list(
            'recipient__email', 'recipient__fullname', 'notification__name', 'notification__description'
        ):
            aggregated_mail[user_email].append((subject, body))
            mail_fullnames[user_email] = user_fullname

        # See https://docs.djangoproject.com/en/1.11/topics/email/#send-mass-mail
        bulk_send_list = []

        mail_subject = 'UNPP Notification Summary'
        for email, messages in aggregated_mail.items():
            body =

            bulk_send_list.append((

            ))




        pass

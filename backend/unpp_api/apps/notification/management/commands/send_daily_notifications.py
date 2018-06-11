from __future__ import absolute_import
from django.core.management.base import BaseCommand

from common.consts import NOTIFICATION_FREQUENCY_CHOICES
from notification.helpers import send_notification_summary_to_notified_users
from notification.models import NotifiedUser


class Command(BaseCommand):
    help = 'Send notifications to users with daily email preference'

    def handle(self, *args, **options):
        notified_users = NotifiedUser.objects.filter(
            sent_as_email=False, recipient__profile__notification_frequency=NOTIFICATION_FREQUENCY_CHOICES.daily
        )
        send_notification_summary_to_notified_users(notified_users)

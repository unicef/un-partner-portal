from __future__ import absolute_import
from django.core.management.base import BaseCommand
from django.db import transaction

from common.consts import NOTIFICATION_FREQUENCY_CHOICES
from notification.helpers import send_notification_summary_to_notified_users
from notification.models import NotifiedUser


class Command(BaseCommand):
    help = 'Send notifications to users with daily email preference'

    def handle(self, *args, **options):
        users_to_notify_ids = set(NotifiedUser.objects.filter(
            sent_as_email=False, recipient__profile__notification_frequency=NOTIFICATION_FREQUENCY_CHOICES.daily
        ).values_list('recipient_id', flat=True))

        for user_id in users_to_notify_ids:
            with transaction.atomic():
                notified_users = NotifiedUser.objects.select_for_update().filter(
                    sent_as_email=False, recipient_id=user_id
                )
                send_notification_summary_to_notified_users(notified_users)

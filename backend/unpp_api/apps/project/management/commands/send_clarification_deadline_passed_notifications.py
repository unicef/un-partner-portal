from __future__ import absolute_import

from datetime import date

from dateutil.relativedelta import relativedelta
from django.core.management.base import BaseCommand
from django.db import transaction

from notification.helpers import send_send_clarification_deadline_passed_notification
from project.models import EOI


class Command(BaseCommand):
    help = 'Send notifications to creators / focal points'

    def handle(self, *args, **options):
        yesterday = date.today() - relativedelta(days=1)
        eoi_ids = set(EOI.objects.filter(
            is_published=True, clarification_request_deadline_date=yesterday
        ).values_list('id', flat=True))

        for eoi_id in eoi_ids:
            with transaction.atomic():
                send_send_clarification_deadline_passed_notification(
                    EOI.objects.select_for_update().get(id=eoi_id)
                )

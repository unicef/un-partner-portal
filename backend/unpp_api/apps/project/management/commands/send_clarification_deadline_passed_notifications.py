from __future__ import absolute_import

from datetime import date

from dateutil.relativedelta import relativedelta
from django.core.management.base import BaseCommand

from notification.helpers import send_send_clarification_deadline_passed_notification
from project.models import EOI


class Command(BaseCommand):
    help = 'Send notifications to creators / focal points'

    def handle(self, *args, **options):
        yesterday = date.today() - relativedelta(days=1)
        for eoi in EOI.objects.filter(is_published=True, clarification_request_deadline_date=yesterday):
            send_send_clarification_deadline_passed_notification(eoi)

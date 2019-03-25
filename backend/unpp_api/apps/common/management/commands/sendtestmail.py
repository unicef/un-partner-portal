from __future__ import absolute_import

from django.conf import settings
from django.core.mail import send_mail

from django.core.management.base import BaseCommand
from django.utils import timezone


MAIL_BODY = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et " \
            "dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip " \
            "ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore " \
            "eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia " \
            "deserunt mollit anim id est laborum."


class Command(BaseCommand):
    help = 'Send email to specified address.'

    def add_arguments(self, parser):
        parser.add_argument(
            'to',
            type=str,
            help='target email'
        )

    def handle(self, *args, **options):
        send_mail(
            f'[{timezone.now().isoformat()}] Test Message',
            MAIL_BODY,
            settings.DEFAULT_FROM_EMAIL,
            [
                options['to']
            ],
            fail_silently=False,
        )

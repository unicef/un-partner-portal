from __future__ import absolute_import

from django.core.management.base import BaseCommand

from sanctionslist.etl import parse_unsc_list
from sanctionslist.models import SanctionedItem


class Command(BaseCommand):
    help = 'Pulls Sanctions List from UN site and updates local copy.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--initial',
            action='store_true',
            dest='initial',
            help='Only sync when list is empty',
        )

    def handle(self, *args, **options):
        if options.get('initial') is True and SanctionedItem.objects.exists():
            self.stdout.write('Some entries present, skipping initial sync.')
            return

        self.stdout.write('Start sanctions list sync.')
        try:
            parse_unsc_list()
        except Exception as e:
            self.stderr.write(f'Error syncing sanctions list {e}')
        self.stdout.write('Sanctions list sync complete.')

from __future__ import absolute_import

from django.core.management.base import BaseCommand

from sanctionslist.etl import parse_unsc_list


class Command(BaseCommand):
    help = 'Pulls Sanctions List from UN site and updates local copy.'

    def handle(self, *args, **options):
        self.stdout.write('Start sanctions list sync.')
        parse_unsc_list()
        self.stdout.write('Sanctions list sync complete.')

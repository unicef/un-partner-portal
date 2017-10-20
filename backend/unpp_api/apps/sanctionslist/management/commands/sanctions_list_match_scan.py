from __future__ import absolute_import

from django.core.management.base import BaseCommand

from sanctionslist.scans import scan_all_partners


class Command(BaseCommand):
    help = 'Scans Sanctions List for any Matches in our database'

    def handle(self, *args, **options):
        scan_all_partners()

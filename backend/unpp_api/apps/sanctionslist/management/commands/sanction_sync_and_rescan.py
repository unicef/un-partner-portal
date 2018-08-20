from __future__ import absolute_import

from django.core.management.base import BaseCommand

from sanctionslist.etl import parse_unsc_list
from sanctionslist.scans import sanctions_scan_all_partners


class Command(BaseCommand):
    help = 'Sync sanction list and scan sanctions List for any Matches in our database'

    def handle(self, *args, **options):
        parse_unsc_list()
        sanctions_scan_all_partners()

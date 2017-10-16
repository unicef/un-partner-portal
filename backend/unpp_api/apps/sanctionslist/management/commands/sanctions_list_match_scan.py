from __future__ import absolute_import

from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Scans Sanctions List for any Matches in our database'

    def handle(self, *args, **options):
        # TODO

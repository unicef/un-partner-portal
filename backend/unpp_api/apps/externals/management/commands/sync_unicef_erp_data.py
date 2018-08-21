from __future__ import absolute_import

from django.core.management.base import BaseCommand

from externals.sources.unicef import UNICEFInfoDownloader


class Command(BaseCommand):
    help = 'Sync UNICEF ERP data'

    def handle(self, *args, **options):
        UNICEFInfoDownloader().sync_business_areas()

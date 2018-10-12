from __future__ import absolute_import

from datetime import date

from dateutil.relativedelta import relativedelta
from django.core.management.base import BaseCommand

from externals.sources.unicef import UNICEFInfoDownloader


class Command(BaseCommand):
    help = 'Sync UNICEF ERP data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            dest='force',
            help='Run even if today is not last day of month',
        )

    def handle(self, *args, **options):
        # This makes sure we only have to schedule one cronjob on 28-31 day of month
        is_last_day_of_the_month = (date.today() + relativedelta(days=1)).day == 1

        if any((
            is_last_day_of_the_month,
            options.get('force'),
        )):
            self.stdout.write('Start UNICEF ERP data sync')
            UNICEFInfoDownloader().sync_business_areas()
            self.stdout.write('Finished UNICEF ERP data sync')
        else:
            self.stdout.write('Not last day of the month, skipping.\nUse --force to run anyway')

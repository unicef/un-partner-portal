from __future__ import absolute_import

from datetime import datetime

from dateutil.relativedelta import relativedelta
from django.core.management.base import BaseCommand
from common.models import CommonFile


class Command(BaseCommand):
    help = 'Cleans up files that have no existing references.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            dest='all',
            default=False,
            help='Do not exclude recent files'
        )

    def handle(self, *args, **options):
        common_files = CommonFile.objects.all()
        if not options.get('all'):
            common_files = common_files.filter(created_lte=datetime.now() - relativedelta(weeks=1))

        self.stdout.write('Start checking current files')

        cf: CommonFile
        for cf in common_files.iterator():
            if not cf.has_existing_reference:
                self.stdout.write(f'{cf} has no references, removing...')
                cf.delete()

        self.stdout.write('Finish files scan')

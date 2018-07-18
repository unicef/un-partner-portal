from __future__ import absolute_import

from django.conf import settings
from django.core.management.base import BaseCommand
from django.core.management import call_command
from common.fakedata_utilities import clean_up_data_in_db, generate_fake_data
from common.utils import confirm


class Command(BaseCommand):
    help = 'Creates a set of ORM objects for development and staging environment.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clean_before',
            action='store_true',
            dest='clean_before',
            default=False,
            help='Clean up all ORM objects before generating fake data'
        )

    def handle(self, *args, **options):
        prompt = 'You are about to run a script that generates test data'
        if options['clean_before']:
            prompt += ' and WIPES THE DATABASE'
        if settings.IS_PROD and not confirm(prompt='{}. Are you sure?'.format(prompt)):
            return

        if options['clean_before']:
            clean_up_data_in_db()
            call_command("loaddata", "initial.json")
            self.stdout.write("Agency, Sectors and Specialization initialized!")

        generate_fake_data()

        self.stdout.write("Fake data script done.")

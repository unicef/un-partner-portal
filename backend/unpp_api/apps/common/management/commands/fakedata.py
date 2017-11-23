from __future__ import absolute_import
from django.core.management.base import BaseCommand
from django.core.management import call_command
from .helpers import clean_up_data_in_db, generate_fake_data


class Command(BaseCommand):
    help = 'Creates a set of ORM objects for development and stagging environment.'

    def add_arguments(self, parser):
        parser.add_argument('quantity', type=int)

        parser.add_argument(
            '--clean_before',
            action='store_true',
            dest='clean_before',
            default=False,
            help='Clean up all ORM objects before generating fake data'
        )

    def handle(self, *args, **options):
        if options['clean_before']:
            clean_up_data_in_db()
            print "Data cleaned!"
            call_command("loaddata", "initial.json")
            print "Sectors and Specialization initialized!"

        generate_fake_data(options['quantity'])

        print "Fake data script finish."

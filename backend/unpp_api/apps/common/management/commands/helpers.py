from django.conf import settings

from account.models import User, UserProfile
from common.consts import EOI_TYPES
from common.factories import (
    PartnerFactory,
    PartnerProfileFactory,
    PartnerMemberFactory,
    AgencyMemberFactory,
    EOIFactory,
)


def clean_up_data_in_db():
    if settings.ENV == 'dev':
        print "Deleting all ORM objects"

        User.objects.all().delete()
        UserProfile.objects.all().delete()
        print "All ORM objects deleted"


def generate_fake_data(quantity=4):

    admin, created = User.objects.get_or_create(username='admin', defaults={
        'email': 'admin@unicef.org',
        'is_superuser': True,
        'is_staff': True,
    })
    password = 'Passw0rd!'
    admin.set_password(password)
    admin.save()
    print "Superuser created:{}/{}".format(admin.username, password)

    PartnerFactory.create_batch(quantity/2)
    print "{} Partner objects created".format(quantity/2)

    PartnerProfileFactory.create_batch(quantity/2)
    print "{} Partner Profile objects created".format(quantity/2)

    PartnerMemberFactory.create_batch(quantity/2)
    print "{} PartnerMember objects created".format(quantity/2)

    AgencyMemberFactory.create_batch(quantity/2)
    print "{} AgencyMember objects created".format(quantity/2)

    EOIFactory.create_batch(quantity)
    print "{} open EOI objects created".format(quantity)

    for idx in xrange(0, quantity):
        EOIFactory(display_type=EOI_TYPES.direct)
    print "{} direct EOI objects created".format(quantity)

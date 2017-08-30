from django.conf import settings

from account.models import User, UserProfile
from common.consts import EOI_TYPES
from common.factories import (
    PartnerFactory,
    PartnerProfileFactory,
    PartnerHeadOrganizationFactory,
    PartnerMandateMissionFactory,
    PartnerFundingFactory,
    PartnerMemberFactory,
    AgencyMemberFactory,
    EOIFactory,
)
from partner.models import Partner
from project.models import EOI


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


    AgencyMemberFactory.create_batch(quantity/2)
    print "{} AgencyMember objects created".format(quantity/2)

    EOIFactory.create_batch(quantity)
    print "{} open EOI objects created".format(quantity)

    for idx in xrange(0, quantity):
        EOIFactory(display_type=EOI_TYPES.direct)
    print "{} direct EOI objects created".format(quantity)

    for eoi in EOI.objects.filter(display_type=EOI_TYPES.direct):
        for partner in Partner.objects.all():
            eoi.invited_partners.add(partner)
    print "All partners invited to direct EOI."

    PartnerFactory.create_batch(quantity/2)
    print "{} Partner objects created".format(quantity/2)

    hq = Partner.objects.first()
    Partner.objects.exclude(id=hq.id).update(hq=hq)
    print "Partner HQ & Country Profiles"

    PartnerProfileFactory.create_batch(quantity/2)
    print "{} Partner Profile objects created".format(quantity/2)

    PartnerHeadOrganizationFactory.create_batch(quantity/2)
    print "{} Partner Head Organization objects created".format(quantity/2)

    PartnerMandateMissionFactory.create_batch(quantity/2)
    print "{} Partner Mandate Mission objects created".format(quantity/2)

    PartnerFundingFactory.create_batch(quantity/2)
    print "{} Partner Funding objects created".format(quantity/2)

    PartnerMemberFactory.create_batch(quantity/2)
    print "{} PartnerMember objects created".format(quantity/2)

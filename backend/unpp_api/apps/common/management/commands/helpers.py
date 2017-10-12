from django.conf import settings

from account.models import User, UserProfile
from agency.models import AgencyMember
from common.consts import (
    EOI_TYPES,
    MEMBER_ROLES,
)
from common.factories import (
    PartnerFactory,
    PartnerMemberFactory,
    OtherAgencyFactory,
    AgencyMemberFactory,
    EOIFactory,
)
from partner.models import Partner, PartnerMember


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

    OtherAgencyFactory.create_batch(quantity/2)
    print "{} OtherAgencyFactory objects created".format(quantity/2)

    AgencyMemberFactory.create_batch(quantity/2)
    print "{} AgencyMember objects created".format(quantity/2)

    PartnerFactory.create_batch(quantity/2)
    print "{} Partner objects created".format(quantity/2)

    hq = Partner.objects.first()
    Partner.objects.exclude(id=hq.id).update(hq=hq)
    print "Partner HQ & Country Profiles"
    for idx, code in enumerate(hq.country_presence):
        if idx >= Partner.objects.filter(hq=hq).count():
            break
        partner = Partner.objects.filter(hq=hq)[idx]
        partner.country_code = code
        partner.save()

    PartnerMemberFactory.create_batch(quantity/2)
    print "{} PartnerMember objects created".format(quantity/2)

    EOIFactory.create_batch(quantity)
    print "{} open EOI objects created".format(quantity)

    for idx in xrange(0, quantity):
        EOIFactory(display_type=EOI_TYPES.direct, deadline_date=None)
    print "{} direct EOI objects created with applications".format(quantity)

    pm = PartnerMember.objects.first()
    pm.user = admin
    pm.role = MEMBER_ROLES.admin
    pm.save()

    am = AgencyMember.objects.first()
    am.user = admin
    am.role = MEMBER_ROLES.admin
    am.save()
    print "Set default first Partner and Agency member as admin."

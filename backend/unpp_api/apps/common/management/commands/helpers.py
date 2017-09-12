from django.conf import settings

from account.models import User, UserProfile
from agency.models import AgencyMember
from common.consts import (
    EOI_TYPES,
    MEMBER_ROLES,
    JUSTIFICATION_FOR_DIRECT_SELECTION,
    ACCEPTED_DECLINED,
    DIRECT_SELECTION_SOURCE,
    APPLICATION_STATUSES,
)
from common.factories import (
    PartnerFactory,
    PartnerMemberFactory,
    AgencyMemberFactory,
    EOIFactory,
)
from partner.models import Partner, PartnerMember, PartnerSelected
from project.models import EOI, Application


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

    PartnerFactory.create_batch(quantity)
    print "{} Partner objects created".format(quantity)

    PartnerMemberFactory.create_batch(quantity/2)
    print "{} PartnerMember objects created".format(quantity/2)

    AgencyMemberFactory.create_batch(quantity/2)
    print "{} AgencyMember objects created".format(quantity/2)

    EOIFactory.create_batch(quantity)
    print "{} open EOI objects created".format(quantity)

    for idx in xrange(0, quantity):
        EOIFactory(display_type=EOI_TYPES.direct, deadline_date=None)
    print "{} direct EOI objects created".format(quantity)

    for eoi in EOI.objects.filter(display_type=EOI_TYPES.direct):
        partner_example = Partner.objects.all().order_by("?").first()
        Application.objects.create(
            partner=partner_example,
            eoi=eoi,
            submitter=eoi.created_by,
            agency=eoi.agency,
            status=APPLICATION_STATUSES.pending,
            did_win=True,
            did_accept=False,
            ds_justification_select=JUSTIFICATION_FOR_DIRECT_SELECTION.known,
            ds_justification_reason="They are the best!",
        )
        eoi.selected_source = DIRECT_SELECTION_SOURCE.cso
        eoi.save()
    print "Partners selected to direct EOI."

    pm = PartnerMember.objects.first()
    pm.user = admin
    pm.role = MEMBER_ROLES.admin
    pm.save()

    am = AgencyMember.objects.first()
    am.user = admin
    am.role = MEMBER_ROLES.admin
    am.save()
    print "Set default first Partner and Agency member as admin."

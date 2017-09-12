from django.conf import settings

from account.models import User, UserProfile
from agency.models import AgencyMember
from common.consts import (
    EOI_TYPES,
    MEMBER_ROLES,
    JUSTIFICATION_FOR_DIRECT_SELECTION,
    DIRECT_SELECTION_SOURCE,
    APPLICATION_STATUSES,
)
from common.factories import (
    PartnerFactory,
    PartnerProfileFactory,
    PartnerHeadOrganizationFactory,
    PartnerMandateMissionFactory,
    PartnerFundingFactory,
    PartnerOtherInfoFactory,
    PartnerAuditAssessmentFactory,
    PartnerReportingFactory,
    PartnerMemberFactory,
    OtherAgencyFactory,
    AgencyMemberFactory,
    EOIFactory,
)
from partner.models import Partner, PartnerMember
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

    OtherAgencyFactory.create_batch(quantity/2)
    print "{} OtherAgencyFactory objects created".format(quantity/2)

    AgencyMemberFactory.create_batch(quantity/2)
    print "{} AgencyMember objects created".format(quantity/2)

    EOIFactory.create_batch(quantity)
    print "{} open EOI objects created".format(quantity)

    for idx in xrange(0, quantity):
        EOIFactory(display_type=EOI_TYPES.direct, deadline_date=None)
    print "{} direct EOI objects created".format(quantity)

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

    PartnerOtherInfoFactory.create_batch(quantity/2)
    print "{} Partner Other Info objects created".format(quantity/2)

    PartnerAuditAssessmentFactory.create_batch(quantity/2)
    print "{} Partner Audit Assessment Info objects created".format(quantity/2)

    PartnerReportingFactory.create_batch(quantity/2)
    print "{} Partner Reporting objects created".format(quantity/2)

    PartnerMemberFactory.create_batch(quantity/2)
    print "{} PartnerMember objects created".format(quantity/2)

    pm = PartnerMember.objects.first()
    pm.user = admin
    pm.role = MEMBER_ROLES.admin
    pm.save()

    am = AgencyMember.objects.first()
    am.user = admin
    am.role = MEMBER_ROLES.admin
    am.save()
    print "Set default first Partner and Agency member as admin."

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

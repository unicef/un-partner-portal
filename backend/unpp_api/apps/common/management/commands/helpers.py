from datetime import date
from django.conf import settings

from account.models import User, UserProfile
from agency.models import (
    OtherAgency,
    Agency,
    AgencyProfile,
    AgencyOffice,
    AgencyMember,
)
from common.consts import (
    EOI_TYPES,
    MEMBER_ROLES,
    PARTNER_TYPES,
    FLAG_TYPES,
)
from common.factories import (
    PartnerFactory,
    PartnerMemberFactory,
    AgencyFactory,
    AgencyOfficeFactory,
    OtherAgencyFactory,
    AgencyMemberFactory,
    EOIFactory,
    UnsolicitedFactory,
    PartnerVerificationFactory,
    PartnerFlagFactory,
)
from common.models import (
    AdminLevel1,
    Point,
    Sector,
    Specialization,
    CommonFile,
)
from notification.models import (
    Notification,
    NotifiedUser,
)
from partner.models import (
    Partner,
    PartnerProfile,
    PartnerMailingAddress,
    PartnerHeadOrganization,
    PartnerDirector,
    PartnerAuthorisedOfficer,
    PartnerPolicyArea,
    PartnerAuditAssessment,
    PartnerReporting,
    PartnerMandateMission,
    PartnerExperience,
    PartnerInternalControl,
    PartnerBudget,
    PartnerFunding,
    PartnerCollaborationPartnership,
    PartnerCollaborationEvidence,
    PartnerOtherInfo,
    PartnerMember,
    PartnerReview,
)
from project.models import (
    EOI,
    Pin,
    Application,
    ApplicationFeedback,
    Assessment,
)
from review.models import (
    PartnerFlag,
    PartnerVerification,
)
from sanctionslist.models import (
    SanctionedItem,
    SanctionedName,
    SanctionedNameMatch,
)


def clean_up_data_in_db():
    if settings.ENV == 'dev':
        print "Deleting all ORM objects"

        User.objects.all().delete()
        UserProfile.objects.all().delete()

        OtherAgency.objects.all().delete()
        Agency.objects.all().delete()
        AgencyProfile.objects.all().delete()
        AgencyOffice.objects.all().delete()
        AgencyMember.objects.all().delete()

        AdminLevel1.objects.all().delete()
        Point.objects.all().delete()
        Sector.objects.all().delete()
        Specialization.objects.all().delete()
        CommonFile.objects.all().delete()

        Notification.objects.all().delete()
        NotifiedUser.objects.all().delete()

        Partner.objects.all().delete()
        PartnerProfile.objects.all().delete()
        PartnerMailingAddress.objects.all().delete()
        PartnerHeadOrganization.objects.all().delete()
        PartnerDirector.objects.all().delete()
        PartnerAuthorisedOfficer.objects.all().delete()
        PartnerPolicyArea.objects.all().delete()
        PartnerAuditAssessment.objects.all().delete()
        PartnerReporting.objects.all().delete()
        PartnerMandateMission.objects.all().delete()
        PartnerExperience.objects.all().delete()
        PartnerInternalControl.objects.all().delete()
        PartnerBudget.objects.all().delete()
        PartnerFunding.objects.all().delete()
        PartnerCollaborationPartnership.objects.all().delete()
        PartnerCollaborationEvidence.objects.all().delete()
        PartnerOtherInfo.objects.all().delete()
        PartnerMember.objects.all().delete()
        PartnerReview.objects.all().delete()

        EOI.objects.all().delete()
        Pin.objects.all().delete()
        Application.objects.all().delete()
        ApplicationFeedback.objects.all().delete()
        Assessment.objects.all().delete()

        PartnerFlag.objects.all().delete()
        PartnerVerification.objects.all().delete()

        SanctionedItem.objects.all().delete()
        SanctionedName.objects.all().delete()
        SanctionedNameMatch.objects.all().delete()

        print "All ORM objects deleted"


def generate_fake_data(quantity=50):
    assert quantity in [50, 100, 150, 200], "Quantity have to be: 50 or 100, 150, 200."

    admin, created = User.objects.get_or_create(fullname='admin', defaults={
        'email': 'admin@unicef.org',
        'is_superuser': True,
        'is_staff': True,
    })
    password = 'Passw0rd!'
    admin.set_password(password)
    admin.save()
    print "Superuser {}:{}/{}".format("created" if created else "updated",admin.fullname, password)

    # Agencies
    unicef = Agency.objects.get(name="UNICEF")
    wfp = Agency.objects.get(name="WFP")
    unhcr = Agency.objects.get(name="UNHCR")

    AgencyOfficeFactory.create_batch(3, agency=unicef)
    AgencyOfficeFactory.create_batch(3, agency=wfp)
    AgencyOfficeFactory.create_batch(3, agency=unhcr)
    print "Agencies and their offices are created"
    AgencyMemberFactory.create_batch(6, role=MEMBER_ROLES.admin)
    AgencyMemberFactory.create_batch(9)

    OtherAgencyFactory.create_batch(3)
    print "Other Agencies are created."

    PartnerFactory.create_batch(quantity)
    print "{} Partner objects created".format(quantity)

    partner_all = Partner.objects.all().values_list('id', flat=True)
    # national
    national_pks = partner_all[quantity/10:quantity/5]
    Partner.objects.filter(id__in=national_pks).update(display_type=PARTNER_TYPES.national)
    # academic
    academic_pks = partner_all[quantity/5:quantity/5+quantity/10]
    Partner.objects.filter(id__in=academic_pks).update(display_type=PARTNER_TYPES.academic)
    # red_cross
    red_cross_pks = partner_all[quantity/5+quantity/10:2*(quantity/5)]
    Partner.objects.filter(id__in=red_cross_pks).update(display_type=PARTNER_TYPES.red_cross)
    # hq & country profiles
    hq_pks = partner_all[2*(quantity/5):3*(quantity/5)]
    Partner.objects.filter(id__in=hq_pks).update(display_type=PARTNER_TYPES.international)
    # country profiles
    country_profiles_pks = partner_all[3*(quantity/5):quantity]

    per_country = len(hq_pks) / len(country_profiles_pks)
    for idx, hq_id in enumerate(hq_pks):
        scope_pks = country_profiles_pks[idx*per_country: (idx+1)*per_country]
        Partner.objects.filter(id__in=scope_pks).update(
            hq_id=hq_id,
            display_type=PARTNER_TYPES.international
        )
        PartnerHeadOrganization.objects.filter(partner_id__in=scope_pks).delete()
        PartnerBudget.objects.filter(partner_id__in=scope_pks).delete()

    for idx, partner in enumerate(Partner.objects.all()):
        if idx % 2:
            PartnerFlagFactory(partner=partner)
            if idx % 3:
                PartnerVerificationFactory(partner=partner, is_cert_uploaded=False)
            elif idx % 2:
                PartnerVerificationFactory(partner=partner)
        else:
            PartnerFlagFactory(partner=partner, flag_type=FLAG_TYPES.red)

        PartnerMemberFactory(partner=partner, role=MEMBER_ROLES.admin, title='Head')
        PartnerMemberFactory(partner=partner, role=MEMBER_ROLES.editor, title='PM')
        PartnerMemberFactory(partner=partner, role=MEMBER_ROLES.reader, title='Assistant')
    print "Other Relation to Partner objects created".format(quantity)

    EOIFactory.create_batch(quantity)
    print "{} open EOI objects created".format(quantity)

    # preselect
    for idx, eoi in enumerate(EOI.objects.filter(display_type=EOI_TYPES.open)):
        app = eoi.applications.all().order_by("?").first()
        if app is None:
            # if someone will run fake date without clean database, their can be EOI with no applications
            continue
        app.did_win = True
        if idx % 4:
            app.decision_date = date.today()
            app.did_withdraw = True
            app.withdraw_reason = "fake reason"
        elif idx % 2:
            app.decision_date = date.today()
            app.did_accept = True
        elif idx % 7:
            app.decision_date = date.today()
            app.did_decline = True

        app.save()

    EOIFactory.create_batch(quantity, display_type=EOI_TYPES.direct, deadline_date=None)
    print "{} direct EOI objects created with applications".format(quantity)

    UnsolicitedFactory.create_batch(quantity/3, agency=unicef)
    UnsolicitedFactory.create_batch(quantity/3, agency=wfp)
    UnsolicitedFactory.create_batch(quantity/3, agency=unhcr)
    print "Unsolicited concept notest for each agency created"

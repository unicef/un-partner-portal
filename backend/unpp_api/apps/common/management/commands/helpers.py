import random
from coolname import generate
from django.conf import settings
from django_countries import countries

from account.models import User, UserProfile
from agency.models import (
    OtherAgency,
    Agency,
    AgencyProfile,
    AgencyOffice,
    AgencyMember,
)
from agency.roles import AgencyRole
from common.consts import (
    PARTNER_TYPES,
)
from common.factories import (
    PartnerFactory,
    PartnerMemberFactory,
    AgencyOfficeFactory,
    OtherAgencyFactory,
    AgencyMemberFactory,
    EOIFactory,
    UnsolicitedFactory,
    PartnerVerificationFactory,
    PartnerFlagFactory,
    UserFactory)
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
from partner.roles import PartnerRole
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
        print("Deleting all ORM objects")

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

        print("All ORM objects deleted")


USERNAME_AGENCY_ROLE_POSTFIXES = {
    AgencyRole.ADMINISTRATOR.name: 'admin',
    AgencyRole.HQ_EDITOR.name: 'editor-hq',
    AgencyRole.READER.name: 'reader',
    AgencyRole.EDITOR_BASIC.name: 'editor',
    AgencyRole.EDITOR_ADVANCED.name: 'editor-adv',
    AgencyRole.PAM_USER.name: 'pam',
    AgencyRole.MFT_USER.name: 'mft',
}


def generate_fake_data(country_count=3):
    admin, created = User.objects.get_or_create(fullname='admin', defaults={
        'email': 'admin@unicef.org',
        'is_superuser': True,
        'is_staff': True,
    })
    password = 'Passw0rd!'
    admin.set_password(password)
    admin.save()
    print("Superuser {}: {}/{}".format("created" if created else "updated", admin.email, password))

    agencies = [
        Agency.objects.get(name="UNICEF"),
        Agency.objects.get(name="WFP"),
        Agency.objects.get(name="UNHCR"),
    ]

    chosen_countries = random.choices(countries, k=country_count)
    for agency in agencies:
        for index, (country_code, country_name) in enumerate(chosen_countries):
            print(f'Creating {agency.name} in {country_name}')
            index += 1
            office = AgencyOfficeFactory(country=country_code, agency=agency)
            for role_name, display_name in AgencyRole.get_choices(agency=agency):
                user = UserFactory(
                    email=f'agency-{index}-{USERNAME_AGENCY_ROLE_POSTFIXES[role_name]}@{agency.name.lower()}.org'
                )
                AgencyMemberFactory(user=user, office=office, role=role_name)

                EOIFactory.create_batch(random.randint(3, 8), agency=agency, created_by=user, is_published=True)
                EOIFactory.create_batch(random.randint(3, 8), agency=agency, created_by=user)
                print(f'Created {user}')

    OtherAgencyFactory.create_batch(1)

    partner_count = 2
    ingo_hqs = [
        PartnerFactory(display_type=PARTNER_TYPES.international) for _ in range(partner_count)
    ]
    for hq in ingo_hqs:
        PartnerVerificationFactory(partner=hq)

    standard_partners_created = 0
    ingo_partners_created = 0
    for country_code, country_name in chosen_countries:
        for index in range(partner_count):
            for partner_type, display_type in PARTNER_TYPES:
                if partner_type == PARTNER_TYPES.international:
                    partner_kwargs = {
                        'legal_name': f'{ingo_hqs[index].legal_name} - {country_name}',
                        'hq': ingo_hqs[index]
                    }
                    ingo_partners_created += 1
                else:
                    partner_kwargs = {
                        'hq': None
                    }
                    standard_partners_created += 1

                partner = PartnerFactory(display_type=partner_type, **partner_kwargs)
                partner.country_presence = [country_code]
                partner.save()

                if index == partner_count - 1:
                    PartnerFlagFactory(partner=partner)
                else:
                    PartnerVerificationFactory(partner=partner)

                for role_code, display_name in PartnerRole.get_choices():
                    postfix = f'ingo-{ingo_partners_created}' if partner.hq else standard_partners_created
                    user = UserFactory(email=f'partner-{postfix}-{role_code.lower()}@partner.org')
                    PartnerMemberFactory(user=user, role=role_code, partner=partner)
                    if partner.hq:
                        PartnerMemberFactory(user=user, role=role_code, partner=partner.hq)
                    print(f'Created {user}')
                if random.randint(1, 2) == 2:
                    UnsolicitedFactory.create_batch(random.randint(1, 3))

    # TODO: Make sure partner profiles are complete

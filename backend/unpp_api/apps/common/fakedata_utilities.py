import random
from django.conf import settings

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
from common.countries import COUNTRIES_ALPHA2_CODE
from common.factories import (
    PartnerFactory,
    PartnerMemberFactory,
    AgencyOfficeFactory,
    OtherAgencyFactory,
    AgencyMemberFactory,
    OpenEOIFactory,
    UnsolicitedFactory,
    PartnerVerificationFactory,
    PartnerFlagFactory,
    UserFactory,
    get_partner_name,
    DirectEOIFactory,
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
    SanctionedName,
    SanctionedNameMatch,
)


def clean_up_data_in_db():
    models_to_wipe = [
        User,
        UserProfile,

        OtherAgency,
        Agency,
        AgencyProfile,
        AgencyOffice,
        AgencyMember,

        AdminLevel1,
        Point,
        Sector,
        Specialization,
        CommonFile,

        Notification,
        NotifiedUser,

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

        EOI,
        Pin,
        Application,
        ApplicationFeedback,
        Assessment,

        PartnerFlag,
        PartnerVerification,

        SanctionedName,
        SanctionedNameMatch,
    ]

    if not settings.IS_PROD:
        print("Start DB Wipe")

        for model in models_to_wipe:
            print(f'Deleting {model.objects.all().count()} {model} instances')
            model.objects.all().delete()

        print("End DB wipe")


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

    chosen_countries = random.choices(COUNTRIES_ALPHA2_CODE, k=country_count)

    OtherAgencyFactory()

    partner_count = 2
    ingo_hqs = [
        PartnerFactory(display_type=PARTNER_TYPES.international) for _ in range(partner_count)
    ]
    for index, hq in enumerate(ingo_hqs):
        PartnerVerificationFactory(partner=hq)
        for role_code, display_name in PartnerRole.get_choices():
            user = UserFactory(
                email=f'partner-ingo-hq-{index + 1}-{role_code.lower()}@partner.org'
            )
            PartnerMemberFactory(user=user, role=role_code, partner=hq)
            print(f'Created {user}')

    standard_partners_created = 0
    ingo_partners_created = 0
    for country_code, country_name in chosen_countries:
        for index in range(partner_count):
            for partner_type, display_type in PARTNER_TYPES:
                if partner_type == PARTNER_TYPES.international:
                    name_parts = ingo_hqs[index].legal_name.split(' ') + [country_code]
                    hq = ingo_hqs[index]
                    partner_kwargs = {
                        'legal_name': f'{"-".join(name_parts)}.{partner_type}'.lower(),
                        'hq': hq
                    }
                    ingo_partners_created += 1
                    if country_code not in hq.country_presence:
                        hq.country_presence.append(country_code)
                        hq.save()
                else:
                    def get_legal_name():
                        name_parts = get_partner_name().split(" ")
                        return f'{"-".join(name_parts)}.{partner_type}'.lower()

                    # Soft unique check
                    legal_name = get_legal_name()
                    while Partner.objects.filter(legal_name=legal_name).exists():
                        legal_name = get_legal_name()

                    partner_kwargs = {
                        'hq': None,
                        'legal_name': legal_name,
                    }
                    standard_partners_created += 1

                partner = PartnerFactory(
                    country_code=country_code,
                    display_type=partner_type,
                    **partner_kwargs
                )
                partner.country_presence = [country_code]
                partner.save()

                if index == partner_count - 1:
                    PartnerFlagFactory(partner=partner)
                else:
                    PartnerVerificationFactory(partner=partner)
                print(f'Created {partner}')

                for role_code, display_name in PartnerRole.get_choices():
                    postfix = f'ingo-{ingo_partners_created}' if partner.hq else standard_partners_created

                    user = UserFactory(email=f'partner-{postfix}-{role_code.lower()}@partner.org')
                    PartnerMemberFactory(user=user, role=role_code, partner=partner)
                    if partner.hq:
                        PartnerMemberFactory(user=user, role=role_code, partner=partner.hq)
                    print(f'Created {user}')

                    user = UserFactory(email=f'partner-{role_code.lower()}@{partner.legal_name}')
                    PartnerMemberFactory(user=user, role=role_code, partner=partner)
                    print(f'Created {user}')

                if random.randint(1, 2) == 2:
                    UnsolicitedFactory.create_batch(random.randint(1, 3), is_published=True)

    for agency in agencies:
        for index, (country_code, country_name) in enumerate(chosen_countries):
            print(f'Creating {agency.name} in {country_name}')
            index += 1
            office = AgencyOfficeFactory(country=country_code, agency=agency)
            roles = AgencyRole.get_choices(agency=agency) + [
                (AgencyRole.HQ_EDITOR.value, AgencyRole.HQ_EDITOR.name)
            ]

            for role_name, display_name in roles:
                user = UserFactory(
                    email=f'agency-{index}-{USERNAME_AGENCY_ROLE_POSTFIXES[role_name]}@{agency.name.lower()}.org',
                    is_superuser=True,
                    is_staff=True,
                )
                AgencyMemberFactory(user=user, office=office, role=role_name)

                OpenEOIFactory.create_batch(random.randint(3, 8), agency=agency, created_by=user, is_published=True)
                OpenEOIFactory.create_batch(random.randint(3, 8), agency=agency, created_by=user)
                DirectEOIFactory.create_batch(random.randint(3, 5), agency=agency, created_by=user, is_published=True)
                DirectEOIFactory.create_batch(random.randint(3, 5), agency=agency, created_by=user)

                print(f'Created {user}')

            # Make sure each office has a couple of potential focal points
            if agency.name == 'UNHCR':
                focal_point_role = AgencyRole.MFT_USER
            else:
                focal_point_role = AgencyRole.EDITOR_ADVANCED
            AgencyMemberFactory.create_batch(random.randint(5, 10), office=office, role=focal_point_role.name)

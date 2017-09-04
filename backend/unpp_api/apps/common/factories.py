import os
import random
from datetime import date
from django.conf import settings
from django.contrib.auth.models import Group
from django.db.models.signals import post_save
import factory
from factory import fuzzy
from account.models import User, UserProfile
from agency.models import OtherAgency, Agency, AgencyOffice, AgencyMember
from common.models import Sector, Specialization
from partner.models import (
    Partner,
    PartnerProfile,
    PartnerMailingAddress,
    PartnerDirector,
    PartnerAuthorisedOfficer,
    PartnerHeadOrganization,
    PartnerMandateMission,
    PartnerExperience,
    PartnerBudget,
    PartnerFunding,
    PartnerCollaborationPartnership,
    PartnerCollaborationPartnershipOther,
    PartnerCollaborationEvidence,
    PartnerOtherInfo,
    PartnerInternalControl,
    PartnerPolicyArea,
    PartnerAuditAssessment,
    PartnerReporting,
    PartnerMember,
)
from project.models import EOI
from .consts import (
    PARTNER_TYPES,
    MEMBER_STATUSES,
    CONCERN_CHOICES,
    YEARS_OF_EXP_CHOICES,
    PARTNER_DONORS_CHOICES,
    COLLABORATION_EVIDENCE_MODES,
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    POLICY_AREA_CHOICES,
    ORG_AUDIT_CHOICES,
    AUDIT_ASSESMENT_CHOICES,
)
from .countries import COUNTRIES_ALPHA2_CODE


COUNTRIES = [x[0] for x in COUNTRIES_ALPHA2_CODE]


def get_random_agency():
    return random.choice([
        Agency.objects.get_or_create(name='UNICEF')[0],
        Agency.objects.get_or_create(name='World Food Program')[0],
    ])


def get_agency_member():
    return User.objects.filter(is_superuser=False, agency_members__isnull=False).order_by("?").first()


def get_partner():
    return Partner.objects.all().order_by("?").first()


def get_country_list(quantity=3):
    return [random.choice(COUNTRIES) for idx in xrange(0, quantity)]


def get_first_name():
    return random.choice([
        "William",
        "Lizzy",
        "Jack"
    ])


def get_last_name():
    return random.choice([
        "Collins",
        "Bennet",
        "Sparow",
    ])


def get_job_title():
    return random.choice([
        'Project Manager',
        'PM Assistant',
        'Head'
    ])


def get_concerns(quantity=2):
    return [random.choice(list(CONCERN_CHOICES._db_values)) for idx in xrange(0, quantity)]


def get_year_of_exp():
    return random.choice(list(YEARS_OF_EXP_CHOICES._db_values))


def get_donors(quantity=2):
    return [random.choice(list(PARTNER_DONORS_CHOICES._db_values)) for idx in xrange(0, quantity)]


class GroupFactory(factory.django.DjangoModelFactory):
    name = "UNICEF User"

    class Meta:
        model = Group


class UserProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserProfile


class UserFactory(factory.django.DjangoModelFactory):
    username = fuzzy.FuzzyText()
    email = factory.Sequence(lambda n: "fake-user-{}@unicef.org".format(n))
    password = factory.PostGenerationMethodCall('set_password', 'test')

    profile = factory.RelatedFactory(UserProfileFactory, 'user')

    @classmethod
    def _generate(cls, create, attrs):
        post_save.disconnect(UserProfile.create_user_profile, User)
        user = super(UserFactory, cls)._generate(create, attrs)
        post_save.connect(UserProfile.create_user_profile, User)
        return user

    @factory.post_generation
    def groups(self, create, extracted, **kwargs):
        group, created = Group.objects.get_or_create(name='UNICEF User')
        self.groups.add(group)

    class Meta:
        model = User


class PartnerFactory(factory.django.DjangoModelFactory):
    legal_name = factory.Sequence(lambda n: "legal name {}".format(n))
    display_type = PARTNER_TYPES.national
    country_code = factory.fuzzy.FuzzyChoice(COUNTRIES)
    registration_number = factory.Sequence(lambda n: "reg-number {}".format(n))

    @factory.post_generation
    def mailing_addresses(self, create, extracted, **kwargs):
        address, created = PartnerMailingAddress.objects.get_or_create(
            partner=self,
            street='fake street',
            city='fake city',
            country=get_country_list(1)[0],
            zip_code='90210',
            telephone='(123) 234 569',
            fax='(123) 234 566',
            website='partner.website.org',
            org_email="office@partner.website.org",
        )
        self.mailing_addresses.add(address)

    @factory.post_generation
    def directors(self, create, extracted, **kwargs):
        for x in xrange(0, 2):
            director, created = PartnerDirector.objects.get_or_create(
                partner=self,
                first_name=get_first_name(),
                last_name=get_last_name(),
                job_title=get_job_title(),
            )
            self.directors.add(director)

    @factory.post_generation
    def authorised_officers(self, create, extracted, **kwargs):
        for x in xrange(0, 2):
            officer, created = PartnerAuthorisedOfficer.objects.get_or_create(
                partner=self,
                first_name=get_first_name(),
                last_name=get_last_name(),
                job_title=get_job_title(),
                telephone = '(123) 234 569',
                fax='(123) 234 566',
                email="office@partner.website.org",
            )
            self.authorised_officers.add(officer)

    @factory.post_generation
    def experiences(self, create, extracted, **kwargs):
        for x in xrange(0, 2):
            experience, created = PartnerExperience.objects.get_or_create(
                partner=self,
                specialization=Specialization.objects.all().order_by("?").first(),
                years=get_year_of_exp()
            )
            self.experiences.add(experience)

    @factory.post_generation
    def budgets(self, create, extracted, **kwargs):
        for year in [date.today().year, date.today().year-1]:
            budget, created = PartnerBudget.objects.get_or_create(
                partner=self,
                year=year,
                budget=year**2
            )
            self.budgets.add(budget)


    @factory.post_generation
    def collaborations_partnership(self, create, extracted, **kwargs):
        partnership, created = PartnerCollaborationPartnership.objects.get_or_create(
            partner=self,
            created_by=User.objects.first(),
            agency=Agency.objects.all().order_by("?").first(),
            description="description"
        )
        self.collaborations_partnership.add(partnership)

    @factory.post_generation
    def collaborations_partnership_others(self, create, extracted, **kwargs):
        partnership, created = PartnerCollaborationPartnershipOther.objects.get_or_create(
            partner=self,
            created_by=User.objects.first(),
            other_agency=OtherAgency.objects.all().order_by("?").first(),
        )
        self.collaborations_partnership_others.add(partnership)

    @factory.post_generation
    def collaboration_evidences(self, create, extracted, **kwargs):
        accreditation, created = PartnerCollaborationEvidence.objects.get_or_create(
            partner=self,
            created_by=User.objects.first(),
            mode = COLLABORATION_EVIDENCE_MODES.accreditation,
            organization_name = "accreditation organization name",
            date_received = date.today()
        )
        self.collaboration_evidences.add(accreditation)

        reference, created = PartnerCollaborationEvidence.objects.get_or_create(
            partner=self,
            created_by=User.objects.first(),
            mode = COLLABORATION_EVIDENCE_MODES.reference,
            organization_name = "reference organization name",
            date_received = date.today()
        )
        self.collaboration_evidences.add(reference)

    @factory.post_generation
    def internal_controls(self, create, extracted, **kwargs):
        PartnerInternalControl.objects.get_or_create(
            partner=self,
            functional_responsibility=FUNCTIONAL_RESPONSIBILITY_CHOICES.procurement,
            segregation_duties=True,
            comment="fake comment"
        )
        PartnerInternalControl.objects.get_or_create(
            partner=self,
            functional_responsibility=FUNCTIONAL_RESPONSIBILITY_CHOICES.authorization,
            segregation_duties=True,
            comment="fake comment"
        )
        PartnerInternalControl.objects.get_or_create(
            partner=self,
            functional_responsibility=FUNCTIONAL_RESPONSIBILITY_CHOICES.recording,
            segregation_duties=True,
            comment="fake comment"
        )
        PartnerInternalControl.objects.get_or_create(
            partner=self,
            functional_responsibility=FUNCTIONAL_RESPONSIBILITY_CHOICES.payment,
            segregation_duties=True,
            comment="fake comment"
        )
        PartnerInternalControl.objects.get_or_create(
            partner=self,
            functional_responsibility=FUNCTIONAL_RESPONSIBILITY_CHOICES.custody,
            segregation_duties=True,
            comment="fake comment"
        )
        PartnerInternalControl.objects.get_or_create(
            partner=self,
            functional_responsibility=FUNCTIONAL_RESPONSIBILITY_CHOICES.bank,
            segregation_duties=True,
            comment="fake comment"
        )

    @factory.post_generation
    def area_policies(self, create, extracted, **kwargs):
        PartnerPolicyArea.objects.get_or_create(
            partner=self,
            area = POLICY_AREA_CHOICES.human
        )
        PartnerPolicyArea.objects.get_or_create(
            partner=self,
            area = POLICY_AREA_CHOICES.procurement
        )
        PartnerPolicyArea.objects.get_or_create(
            partner=self,
            area = POLICY_AREA_CHOICES.asset
        )

    class Meta:
        model = Partner


class PartnerProfileFactory(factory.django.DjangoModelFactory):
    partner = factory.Iterator(Partner.objects.all())
    alias_name = factory.Sequence(lambda n: "aliast name {}".format(n))
    working_languages = factory.LazyFunction(get_country_list)

    class Meta:
        model = PartnerProfile


class PartnerHeadOrganizationFactory(factory.django.DjangoModelFactory):
    partner = factory.Iterator(Partner.objects.all())
    first_name = factory.LazyFunction(get_first_name)
    last_name = factory.LazyFunction(get_last_name)
    email = factory.Sequence(lambda n: "fake-partner-head-{}@unicef.org".format(n))
    job_title = factory.LazyFunction(get_job_title)
    telephone = factory.Sequence(lambda n: "+48 22 568 03 0{}".format(n))

    class Meta:
        model = PartnerHeadOrganization


class PartnerMandateMissionFactory(factory.django.DjangoModelFactory):
    partner = factory.Iterator(Partner.objects.all())
    background_and_rationale = factory.Sequence(lambda n: "background and rationale {}".format(n))
    mandate_and_mission = factory.Sequence(lambda n: "mandate and mission {}".format(n))
    governance_structure = factory.Sequence(lambda n: "governance structure {}".format(n))
    governance_hq = factory.Sequence(lambda n: "reporting requirements of the country office to HQ {}".format(n))

    concern_groups = factory.LazyFunction(get_concerns)
    security_desc = factory.Sequence(lambda n: "rapid response {}".format(n))
    description = factory.Sequence(lambda n: "collaboration professional netwok {}".format(n))

    class Meta:
        model = PartnerMandateMission


class PartnerFundingFactory(factory.django.DjangoModelFactory):
    partner = factory.Iterator(Partner.objects.all())

    source_core_funding = factory.Sequence(lambda n: "source(s) of core funding {}".format(n))
    major_donors = factory.LazyFunction(get_donors)
    main_donors_list = factory.Sequence(lambda n: "list of main donors {}".format(n))

    class Meta:
        model = PartnerFunding


class PartnerOtherInfoFactory(factory.django.DjangoModelFactory):
    partner = factory.Iterator(Partner.objects.all())
    info_to_share = factory.Sequence(lambda n: "info to share {}".format(n))

    class Meta:
        model = PartnerOtherInfo


class PartnerAuditAssessmentFactory(factory.django.DjangoModelFactory):
    partner = factory.Iterator(Partner.objects.all())
    org_audits = [ORG_AUDIT_CHOICES.internal, ]
    link_report = "www.link.report.org/example"
    comment = factory.Sequence(lambda n: "comment {}".format(n))
    assessments = [AUDIT_ASSESMENT_CHOICES.ocha, ]

    class Meta:
        model = PartnerAuditAssessment


class PartnerReportingFactory(factory.django.DjangoModelFactory):

    partner = factory.Iterator(Partner.objects.all())
    key_result = factory.Sequence(lambda n: "key result {}".format(n))
    last_report = date.today()
    link_report = 'www.link.report.org'

    class Meta:
        model = PartnerReporting


class PartnerMemberFactory(factory.django.DjangoModelFactory):
    user = factory.SubFactory(UserFactory)
    partner = factory.LazyFunction(get_partner)
    title = factory.LazyFunction(get_job_title)
    status = MEMBER_STATUSES.active

    class Meta:
        model = PartnerMember


class AgencyFactory(factory.django.DjangoModelFactory):

    name = factory.Sequence(lambda n: "UNICEF agency {}".format(n))

    class Meta:
        model = Agency


class OtherAgencyFactory(factory.django.DjangoModelFactory):

    name = factory.Sequence(lambda n: "other agency {}".format(n))

    class Meta:
        model = OtherAgency


class AgencyOfficeFactory(factory.django.DjangoModelFactory):

    name = factory.Sequence(lambda n: "agency office {}".format(n))
    agency = factory.LazyFunction(get_random_agency)
    countries_code = factory.LazyFunction(get_country_list)

    class Meta:
        model = AgencyOffice


class AgencyMemberFactory(factory.django.DjangoModelFactory):
    user = factory.SubFactory(UserFactory)
    office = factory.SubFactory(AgencyOfficeFactory)

    class Meta:
        model = AgencyMember


class EOIFactory(factory.django.DjangoModelFactory):
    title = factory.Sequence(lambda n: "title {}".format(n))
    country_code = factory.fuzzy.FuzzyChoice(COUNTRIES)
    agency = factory.LazyFunction(get_random_agency)
    created_by = factory.LazyFunction(get_agency_member)
    focal_point = factory.LazyFunction(get_agency_member)
    # locations ... TODO when right time will come (when we need them - depending on endpoint)
    agency_office = factory.SubFactory(AgencyOfficeFactory)
    description = factory.Sequence(lambda n: "Brief background of the project {}".format(n))
    start_date = date.today()
    end_date = date.today()
    deadline_date = date.today()
    # invited_partners ... TODO when right time will come (when we need them - depending on endpoint)
    # reviewers ... TODO when right time will come (when we need them - depending on endpoint)

    class Meta:
        model = EOI

    @factory.post_generation
    def specializations(self, create, extracted, **kwargs):
        sector_food = Sector.objects.get_or_create(name='Food Security')[0]
        sector_nutro = Sector.objects.get_or_create(name='Nutrition')[0]
        self.specializations.add(
            Specialization.objects.get_or_create(name='Food area 1', category=sector_food)[0],
            Specialization.objects.get_or_create(name='Food area 2', category=sector_food)[0],
            Specialization.objects.get_or_create(name='Nutrition area 1', category=sector_nutro)[0],
            Specialization.objects.get_or_create(name='Nutrition area 2', category=sector_nutro)[0],
        )

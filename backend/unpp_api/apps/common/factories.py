import random
import os
from datetime import date, timedelta
from django.conf import settings
from django.contrib.auth.models import Group
from django.db.models.signals import post_save
import factory
from factory import fuzzy
from account.models import User, UserProfile
from agency.models import OtherAgency, Agency, AgencyOffice, AgencyMember
from common.models import Specialization, Point, AdminLevel1
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
    PartnerOtherDocument,
    PartnerInternalControl,
    PartnerPolicyArea,
    PartnerAuditAssessment,
    PartnerReporting,
    PartnerMember,
)
from project.models import EOI, Application, AssessmentCriteria
from review.models import PartnerFlag, PartnerVerification
from .consts import (
    PARTNER_TYPES,
    MEMBER_STATUSES,
    MEMBER_ROLES,
    CONCERN_CHOICES,
    YEARS_OF_EXP_CHOICES,
    PARTNER_DONORS_CHOICES,
    COLLABORATION_EVIDENCE_MODES,
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    POLICY_AREA_CHOICES,
    ORG_AUDIT_CHOICES,
    AUDIT_ASSESMENT_CHOICES,
    JUSTIFICATION_FOR_DIRECT_SELECTION,
    EOI_TYPES,
    DIRECT_SELECTION_SOURCE,
    BUDGET_CHOICES,
    SELECTION_CRITERIA_CHOICES,
    STAFF_GLOBALLY_CHOICES,
    FINANCIAL_CONTROL_SYSTEM_CHOICES,
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


def get_partner_member():
    return User.objects.filter(is_superuser=False, partner_members__isnull=False).order_by("?").first()


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


def get_budget_choice():
    return random.choice(list(BUDGET_CHOICES._db_values))


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
    first_name = factory.LazyFunction(get_first_name)
    last_name = factory.LazyFunction(get_last_name)

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


class AdminLevel1Factory(factory.django.DjangoModelFactory):
    name = factory.Sequence(lambda n: "admin level 1 name {}".format(n))

    class Meta:
        model = AdminLevel1


class PointFactory(factory.django.DjangoModelFactory):
    country_code = factory.fuzzy.FuzzyChoice(COUNTRIES)
    lat = random.randint(-180, 180)
    lon = random.randint(-180, 180)
    admin_level_1 = factory.SubFactory(AdminLevel1Factory)

    class Meta:
        model = Point


class PartnerSimpleFactory(factory.django.DjangoModelFactory):
    legal_name = factory.Sequence(lambda n: "legal name {}".format(n))
    display_type = PARTNER_TYPES.national
    country_code = factory.fuzzy.FuzzyChoice(COUNTRIES)

    class Meta:
        model = Partner


class PartnerFactory(factory.django.DjangoModelFactory):
    legal_name = factory.Sequence(lambda n: "legal name {}".format(n))
    display_type = PARTNER_TYPES.international
    country_code = factory.fuzzy.FuzzyChoice(COUNTRIES)

    # hq information
    country_presence = factory.LazyFunction(get_country_list)
    staff_globally = STAFF_GLOBALLY_CHOICES.to200
    # country profile information
    staff_in_country = STAFF_GLOBALLY_CHOICES.to100
    engagement_operate_desc = factory.Sequence(lambda n: "engagement with the communitie {}".format(n))

    @factory.post_generation
    def mailing_address(self, create, extracted, **kwargs):
        PartnerMailingAddress.objects.get_or_create(
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
                telephone='(123) 234 569',
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
                budget=get_budget_choice()
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
            mode=COLLABORATION_EVIDENCE_MODES.accreditation,
            organization_name="accreditation organization name",
            date_received=date.today()
        )
        self.collaboration_evidences.add(accreditation)

        reference, created = PartnerCollaborationEvidence.objects.get_or_create(
            partner=self,
            created_by=User.objects.first(),
            mode=COLLABORATION_EVIDENCE_MODES.reference,
            organization_name="reference organization name",
            date_received=date.today()
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
            area=POLICY_AREA_CHOICES.human
        )
        PartnerPolicyArea.objects.get_or_create(
            partner=self,
            area=POLICY_AREA_CHOICES.procurement
        )
        PartnerPolicyArea.objects.get_or_create(
            partner=self,
            area=POLICY_AREA_CHOICES.asset
        )

    @factory.post_generation
    def org_head(self, create, extracted, **kwargs):
        PartnerHeadOrganization.objects.get_or_create(
            partner=self,
            first_name=get_first_name(),
            last_name=get_last_name(),
            email="fake-partner-head-{}@unicef.org".format(self.id),
            job_title=get_job_title(),
            telephone="+48 22 568 03 0{}".format(self.id)
        )

    @factory.post_generation
    def profile(self, create, extracted, **kwargs):
        profile, created = PartnerProfile.objects.get_or_create(
            partner=self,
            alias_name="aliast name {}".format(self.id),
            registration_number="reg-number {}".format(self.id),
        )
        if created:
            filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.csv')
            profile.working_languages = get_country_list()
            profile.acronym = "acronym {}".format(self.id)
            profile.former_legal_name = "former legal name {}".format(self.id)
            profile.connectivity_excuse = "connectivity excuse {}".format(self.id)
            profile.year_establishment = date.today().year - random.randint(1, 30)
            profile.have_gov_doc = True
            profile.gov_doc = open(filename).read()
            profile.registration_doc = open(filename).read()
            profile.registration_date = date.today() - timedelta(days=random.randint(365, 3650))
            profile.registration_comment = "registration comment {}".format(self.id)
            profile.registration_number = "registration number {}".format(self.id)
            profile.explain = "explain {}".format(self.id)
            profile.experienced_staff_desc = "experienced staff desc {}".format(self.id)
            # programme management
            profile.have_management_approach = True
            profile.management_approach_desc = "management approach desc {}".format(self.id)
            profile.have_system_monitoring = True
            profile.system_monitoring_desc = "system monitoring desc {}".format(self.id)
            profile.have_feedback_mechanism = True
            profile.feedback_mechanism_desc = "feedback mechanism desc {}".format(self.id)
            profile.financial_control_system_desc = "financial control system desc {}".format(self.id)
            profile.partnership_collaborate_institution_desc = "collaborate institution {}".format(self.id)
            profile.explain = "explain {}".format(self.id)
            # financial controls
            profile.org_acc_system = FINANCIAL_CONTROL_SYSTEM_CHOICES.computerized
            profile.have_system_track = True
            profile.financial_control_system_desc = "financial control system desc {}".format(self.id)

            profile.save()

    @factory.post_generation
    def mandate_mission(self, create, extracted, **kwargs):
        PartnerMandateMission.objects.create(
            partner=self,
            background_and_rationale="background and rationale {}".format(self.id),
            mandate_and_mission="mandate and mission {}".format(self.id),
            governance_structure="governance structure {}".format(self.id),
            governance_hq="reporting requirements of the country office to HQ {}".format(self.id),
            concern_groups=get_concerns(),
            security_desc="rapid response {}".format(self.id),
            description="collaboration professional netwok {}".format(self.id),
            population_of_concern=True,
            ethic_safeguard_comment="fake comment {}".format(self.id),
        )

    @factory.post_generation
    def fund(self, create, extracted, **kwargs):
        PartnerFunding.objects.create(
            partner=self,
            source_core_funding="source(s) of core funding {}".format(self.id),
            major_donors=get_donors(),
            main_donors_list="main donors {}".format(self.id),
        )

    @factory.post_generation
    def audit(self, create, extracted, **kwargs):
        PartnerAuditAssessment.objects.create(
            partner=self,
            regular_audited_comment="fake regular audited comment {}".format(self.id),
            org_audits=[ORG_AUDIT_CHOICES.donor],
            link_report="http://fake.unicef.org/fake_uri{}".format(self.id),
            major_accountability_issues_highlighted=True,
            comment="fake comment {}".format(self.id),
            assessments=[AUDIT_ASSESMENT_CHOICES.micro],
        )

    @factory.post_generation
    def report(self, create, extracted, **kwargs):
        PartnerReporting.objects.create(
            partner=self,
            key_result="fake key result {}".format(self.id),
            last_report=date.today(),
            link_report="Http://fake.unicef.org/fake_uri{}".format(self.id),
        )

    @factory.post_generation
    def other_info(self, create, extracted, **kwargs):
        PartnerOtherInfo.objects.create(
            partner=self,
            info_to_share="fake info to share {}".format(self.id),
            confirm_data_updated=True,
        )

    @factory.post_generation
    def other_documents(self, create, extracted, **kwargs):
        filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.csv')
        PartnerOtherDocument.objects.create(
            partner=self,
            document=open(filename).read(),
        )

    class Meta:
        model = Partner


class PartnerProfileFactory(factory.django.DjangoModelFactory):
    partner = factory.Iterator(Partner.objects.all())
    alias_name = factory.Sequence(lambda n: "aliast name {}".format(n))
    working_languages = factory.LazyFunction(get_country_list)
    registration_number = factory.Sequence(lambda n: "reg-number {}".format(n))

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

    population_of_concern = True
    ethic_safeguard_comment = factory.Sequence(lambda n: "fake comment {}".format(n))
    governance_hq = factory.Sequence(lambda n: "headquarters oversight operations {}".format(n))
    mandate_and_mission = factory.Sequence(lambda n: "fake mandate & mission {}".format(n))
    background_and_rationale = factory.Sequence(lambda n: "fake background & rationale {}".format(n))

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
    role = MEMBER_ROLES.admin

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
    # locations ... TODO when right time will come (when we need them - depending on endpoint)
    agency_office = factory.SubFactory(AgencyOfficeFactory)
    description = factory.Sequence(lambda n: "Brief background of the project {}".format(n))
    start_date = date.today()
    end_date = date.today()
    deadline_date = date.today()
    notif_results_date = date.today()
    # reviewers ... TODO when right time will come (when we need them - depending on endpoint)

    class Meta:
        model = EOI

    @factory.post_generation
    def reviewers(self, create, extracted, **kwargs):
        agency_members = User.objects.filter(is_superuser=False, agency_members__isnull=False).order_by("?")
        self.reviewers.add(agency_members.first())
        self.reviewers.add(agency_members.last())

    @factory.post_generation
    def focal_points(self, create, extracted, **kwargs):
        focal_point = get_agency_member()
        if focal_point:
            self.focal_points.add(focal_point)

    @factory.post_generation
    def invited_partners(self, create, extracted, **kwargs):
        partner = get_partner()
        if partner:
            self.invited_partners.add(partner)

    @factory.post_generation
    def specializations(self, create, extracted, **kwargs):
        self.specializations.add(
            Specialization.objects.order_by("?").first(),
            Specialization.objects.order_by("?").first(),
        )

    @factory.post_generation
    def applications(self, create, extracted, **kwargs):
        if self.status == EOI_TYPES.direct:
            Application.objects.create(
                partner=get_partner(),
                eoi=self,
                submitter=get_agency_member(),
                did_win=True,
                did_accept=True,
                ds_justification_select=[JUSTIFICATION_FOR_DIRECT_SELECTION.local],
                justification_reason="good reason",
            )
            self.selected_source = DIRECT_SELECTION_SOURCE.cso
            self.save()
        elif self.status == EOI_TYPES.open:
            Application.objects.create(
                partner=get_partner(),
                eoi=self,
                submitter=get_partner_member(),
            )

    @factory.post_generation
    def assessments_criteria(self, create, extracted, **kwargs):
        AssessmentCriteria.objects.create(
            eoi=self,
            options=[
                {'selection_criteria': SELECTION_CRITERIA_CHOICES.sector, 'weight': 10},
                {'selection_criteria': SELECTION_CRITERIA_CHOICES.local, 'weight': 40},
                {'selection_criteria': SELECTION_CRITERIA_CHOICES.cost, 'weight': 30},
                {'selection_criteria': SELECTION_CRITERIA_CHOICES.innovative, 'weight': 20}
            ]
        )


class PartnerFlagFactory(factory.django.DjangoModelFactory):
    submitter = factory.LazyFunction(get_agency_member)
    partner = factory.LazyFunction(get_partner)
    contact_phone = factory.Sequence(lambda n: "+48 22 568 03 0{}".format(n))
    contact_email = factory.Sequence(lambda n: "fake-contact-{}@unicef.org".format(n))
    comment = factory.Sequence(lambda n: "fake comment {}".format(n))
    contact_person = "Person Name"

    class Meta:
        model = PartnerFlag


class PartnerVerificationFactory(factory.django.DjangoModelFactory):
    partner = factory.LazyFunction(get_partner)
    submitter = factory.LazyFunction(get_agency_member)
    is_mm_consistent = True
    is_indicate_results = True
    cert_uploaded_comment = factory.Sequence(lambda n: "cert comment {}".format(n))
    indicate_results_comment = factory.Sequence(lambda n: "indicate results comment {}".format(n))
    yellow_flag_comment = factory.Sequence(lambda n: "yellow flag {}".format(n))
    mm_consistent_comment = factory.Sequence(lambda n: "mm comment {}".format(n))
    is_valid = True
    is_cert_uploaded = True
    rep_risk_comment = factory.Sequence(lambda n: "rep risk comment {}".format(n))
    is_yellow_flag = False
    is_rep_risk = False

    class Meta:
        model = PartnerVerification

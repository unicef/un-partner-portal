import random
import os
from datetime import date, timedelta
from coolname import generate
from dateutil.relativedelta import relativedelta
from django.utils import timezone
from django.conf import settings
from django.contrib.auth.models import Group
from django.db.models.signals import post_save
import factory
from factory import fuzzy
from faker import Faker

from account.models import User, UserProfile
from agency.agencies import AGENCIES
from agency.models import OtherAgency, Agency, AgencyOffice, AgencyMember
from agency.roles import AgencyRole
from common.models import Specialization, Point, AdminLevel1, CommonFile
from partner.models import (
    Partner,
    PartnerMailingAddress,
    PartnerDirector,
    PartnerAuthorisedOfficer,
    PartnerHeadOrganization,
    PartnerMandateMission,
    PartnerExperience,
    PartnerBudget,
    PartnerFunding,
    PartnerCollaborationPartnership,
    PartnerCollaborationEvidence,
    PartnerOtherInfo,
    PartnerInternalControl,
    PartnerPolicyArea,
    PartnerAuditAssessment,
    PartnerAuditReport,
    PartnerReporting,
    PartnerMember,
    PartnerCapacityAssessment,
    PartnerGoverningDocument, PartnerRegistrationDocument)
from partner.roles import PartnerRole
from project.models import EOI, Application, Assessment
from review.models import PartnerFlag, PartnerVerification
from common.consts import (
    PARTNER_TYPES,
    CONCERN_CHOICES,
    YEARS_OF_EXP_CHOICES,
    PARTNER_DONORS_CHOICES,
    COLLABORATION_EVIDENCE_MODES,
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    POLICY_AREA_CHOICES,
    ORG_AUDIT_CHOICES,
    AUDIT_ASSESSMENT_CHOICES,
    JUSTIFICATION_FOR_DIRECT_SELECTION,
    CFEI_TYPES,
    DIRECT_SELECTION_SOURCE,
    BUDGET_CHOICES,
    SELECTION_CRITERIA_CHOICES,
    STAFF_GLOBALLY_CHOICES,
    FINANCIAL_CONTROL_SYSTEM_CHOICES,
)
from common.countries import COUNTRIES_ALPHA2_CODE
from sanctionslist.models import SanctionedNameMatch, SanctionedItem, SanctionedName

COUNTRIES = [x[0] for x in COUNTRIES_ALPHA2_CODE]

filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'test.doc')


fake = Faker()


def get_random_agency():
    return random.choice(AGENCIES).model_instance


def get_random_agency_office():
    return AgencyOffice.objects.order_by("?").first() or AgencyOfficeFactory()


def get_agency_member(agency=None):
    users_queryset = User.objects.filter(agency_members__isnull=False)
    if agency:
        users_queryset = users_queryset.filter(agency_members__office__agency=agency)

    member = users_queryset.order_by("?").first()
    if member:
        return member
    if agency:
        return AgencyMemberFactory(
            office=AgencyOfficeFactory(agency=agency)
        ).user
    else:
        return AgencyMemberFactory().user


def get_partner_member():
    member = User.objects.filter(is_superuser=False, partner_members__isnull=False).order_by("?").first()
    return member or PartnerMemberFactory().user


def get_new_common_file():
    cfile = CommonFile.objects.create()
    cfile.file_field.save('test.csv', open(filename))
    return cfile


def get_cfei_title():
    return f'Help the {generate(2)[-1].title()}'


def get_partner_name():
    return f'Save the {generate(2)[-1].title()}'


def get_random_partner():
    return Partner.objects.all().order_by("?").first() or PartnerFactory()


def get_country_list(quantity=3):
    return [random.choice(COUNTRIES) for _ in range(0, quantity)]


def get_country():
    return random.choice(COUNTRIES)


def get_fullname():
    return random.choice([
        "William Turner",
        "Elizabeth Swann",
        "Jack Sparrow"
    ])


def get_job_title():
    return random.choice([
        'Project Manager',
        'PM Assistant',
        'Head'
    ])


def get_concerns(quantity=2):
    return [random.choice(list(CONCERN_CHOICES._db_values)) for _ in range(0, quantity)]


def get_year_of_exp():
    return random.choice(list(YEARS_OF_EXP_CHOICES._db_values))


def get_donors(quantity=2):
    return [random.choice(list(PARTNER_DONORS_CHOICES._db_values)) for _ in range(0, quantity)]


def get_budget_choice():
    return random.choice(list(BUDGET_CHOICES._db_values))


def get_random_lat():
    result = random.randint(-90, 90)
    return result


def get_random_lon():
    result = random.randint(-180, 180)
    return result


class GroupFactory(factory.django.DjangoModelFactory):
    name = "UNICEF User"

    class Meta:
        model = Group


class UserProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = UserProfile
        django_get_or_create = ('user', )


class UserFactory(factory.django.DjangoModelFactory):
    fullname = factory.LazyFunction(get_fullname)
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


class AdminLevel1Factory(factory.django.DjangoModelFactory):
    name = factory.Sequence(lambda n: "admin level 1 name {}".format(n))
    country_code = fuzzy.FuzzyChoice(COUNTRIES)

    class Meta:
        model = AdminLevel1
        django_get_or_create = ('name', 'country_code')


class PointFactory(factory.django.DjangoModelFactory):
    lat = factory.LazyFunction(get_random_lat)
    lon = factory.LazyFunction(get_random_lon)
    admin_level_1 = factory.SubFactory(AdminLevel1Factory)

    class Meta:
        model = Point


class PartnerSimpleFactory(factory.django.DjangoModelFactory):
    legal_name = factory.Sequence(lambda n: "legal name {}".format(n))
    display_type = PARTNER_TYPES.national
    country_code = fuzzy.FuzzyChoice(COUNTRIES)

    class Meta:
        model = Partner


class PartnerGoverningDocumentFactory(factory.django.DjangoModelFactory):
    created_by = factory.LazyFunction(lambda: User.objects.order_by('?').first())
    profile = factory.LazyFunction(lambda: get_random_partner().profile)
    document = factory.LazyFunction(get_new_common_file)

    class Meta:
        model = PartnerGoverningDocument


class PartnerRegistrationDocumentFactory(factory.django.DjangoModelFactory):
    created_by = factory.LazyFunction(lambda: User.objects.order_by('?').first())
    profile = factory.LazyFunction(lambda: get_random_partner().profile)
    document = factory.LazyFunction(get_new_common_file)
    registration_number = factory.Sequence(lambda n: f"registration_number {n}")
    issue_date = factory.LazyFunction(lambda: date.today() - relativedelta(years=random.randint(1, 4)))
    expiry_date = factory.LazyFunction(lambda: date.today() + relativedelta(years=random.randint(5, 20)))

    class Meta:
        model = PartnerRegistrationDocument


class PartnerFactory(factory.django.DjangoModelFactory):
    legal_name = factory.LazyFunction(get_partner_name)
    display_type = PARTNER_TYPES.cbo
    country_code = fuzzy.FuzzyChoice(COUNTRIES)

    # hq information
    country_presence = factory.LazyFunction(get_country_list)
    staff_globally = STAFF_GLOBALLY_CHOICES.to200

    # country profile information
    staff_in_country = STAFF_GLOBALLY_CHOICES.to100
    engagement_operate_desc = factory.Sequence(lambda n: "engagement with the communities {}".format(n))
    location_of_office = factory.SubFactory(PointFactory)

    @factory.post_generation
    def mailing_address(self, create, extracted, **kwargs):
        PartnerMailingAddress.objects.filter(partner=self).update(
            street=fake.street_name(),
            city=fake.city(),
            country=random.choice(COUNTRIES),
            zip_code=fake.postalcode(),
            telephone=fake.phone_number(),
            fax=fake.phone_number(),
            website=fake.url(),
            org_email=fake.company_email(),
        )

    @factory.post_generation
    def directors(self, create, extracted, **kwargs):
        for x in range(0, 2):
            PartnerDirector.objects.create(
                partner=self,
                fullname=get_fullname(),
                job_title=get_job_title(),
            )

    @factory.post_generation
    def authorised_officers(self, create, extracted, **kwargs):
        for x in range(0, 2):
            PartnerAuthorisedOfficer.objects.create(
                partner=self,
                fullname=get_fullname(),
                job_title=get_job_title(),
                telephone='(123) 234 569',
                fax='(123) 234 566',
                email="office@partner.website.org",
            )

    @factory.post_generation
    def experiences(self, create, extracted, **kwargs):
        for x in range(1, random.randint(2, 3)):
            PartnerExperience.objects.create(
                partner=self,
                specialization=Specialization.objects.all().order_by("?").first(),
                years=get_year_of_exp(),
            )

    @factory.post_generation
    def budgets(self, create, extracted, **kwargs):
        # we want to have last 3 year (with current)
        for year in [date.today().year, date.today().year-1, date.today().year-2]:
            PartnerBudget.objects.create(
                partner=self,
                year=year,
                budget=get_budget_choice()
            )

    @factory.post_generation
    def collaborations_partnership(self, create, extracted, **kwargs):
        PartnerCollaborationPartnership.objects.create(
            partner=self,
            created_by=User.objects.first(),
            agency=Agency.objects.all().order_by("?").first(),
            description="description"
        )

    @factory.post_generation
    def collaboration_evidences(self, create, extracted, **kwargs):
        cfile = CommonFile.objects.create()
        cfile.file_field.save('test.csv', open(filename))

        PartnerCollaborationEvidence.objects.create(
            partner=self,
            created_by=User.objects.first(),
            mode=COLLABORATION_EVIDENCE_MODES.accreditation,
            organization_name="accreditation organization name",
            evidence_file=cfile,
            date_received=date.today()
        )

        PartnerCollaborationEvidence.objects.create(
            partner=self,
            created_by=User.objects.first(),
            mode=COLLABORATION_EVIDENCE_MODES.reference,
            organization_name="reference organization name",
            evidence_file=cfile,
            date_received=date.today()
        )

    @factory.post_generation
    def internal_controls(self, create, extracted, **kwargs):
        PartnerInternalControl.objects.create(
            partner=self,
            functional_responsibility=FUNCTIONAL_RESPONSIBILITY_CHOICES.procurement,
            segregation_duties=True,
            comment="fake comment"
        )
        PartnerInternalControl.objects.create(
            partner=self,
            functional_responsibility=FUNCTIONAL_RESPONSIBILITY_CHOICES.authorization,
            segregation_duties=True,
            comment="fake comment"
        )
        PartnerInternalControl.objects.create(
            partner=self,
            functional_responsibility=FUNCTIONAL_RESPONSIBILITY_CHOICES.recording,
            segregation_duties=True,
            comment="fake comment"
        )
        PartnerInternalControl.objects.create(
            partner=self,
            functional_responsibility=FUNCTIONAL_RESPONSIBILITY_CHOICES.payment,
            segregation_duties=True,
            comment="fake comment"
        )
        PartnerInternalControl.objects.create(
            partner=self,
            functional_responsibility=FUNCTIONAL_RESPONSIBILITY_CHOICES.custody,
            segregation_duties=True,
            comment="fake comment"
        )
        PartnerInternalControl.objects.create(
            partner=self,
            functional_responsibility=FUNCTIONAL_RESPONSIBILITY_CHOICES.bank,
            segregation_duties=True,
            comment="fake comment"
        )

    @factory.post_generation
    def area_policies(self, create, extracted, **kwargs):
        PartnerPolicyArea.objects.create(
            partner=self,
            area=POLICY_AREA_CHOICES.human,
            document_policies=bool(random.getrandbits(1))
        )
        PartnerPolicyArea.objects.create(
            partner=self,
            area=POLICY_AREA_CHOICES.procurement,
            document_policies=bool(random.getrandbits(1))
        )
        PartnerPolicyArea.objects.create(
            partner=self,
            area=POLICY_AREA_CHOICES.asset,
            document_policies=bool(random.getrandbits(1))
        )

    @factory.post_generation
    def org_head(self, create, extracted, **kwargs):
        if self.is_country_profile:
            return
        PartnerHeadOrganization.objects.create(
            partner=self,
            fullname=get_fullname(),
            email="fake-partner-head-{}@unicef.org".format(self.id),
            job_title=get_job_title(),
            telephone="+48 22 568 03 0{}".format(self.id)
        )

    @factory.post_generation
    def profile(self, create, extracted, **kwargs):
        self.profile.alias_name = "alias name {}".format(self.id)
        self.profile.registration_number = "reg-number {}".format(self.id)

        self.profile.working_languages = get_country_list()
        self.profile.connectivity = True

        self.profile.acronym = "acronym {}".format(self.id)
        self.profile.former_legal_name = "former legal name {}".format(self.id)
        self.profile.connectivity_excuse = "connectivity excuse {}".format(self.id)
        self.profile.year_establishment = date.today().year - random.randint(1, 30)
        self.profile.explain = "explain {}".format(self.id)
        self.profile.experienced_staff_desc = "experienced staff desc {}".format(self.id)

        # programme management
        self.profile.have_board_directors = False
        self.profile.have_authorised_officers = False
        self.profile.have_management_approach = True
        self.profile.management_approach_desc = "management approach desc {}".format(self.id)
        self.profile.have_system_monitoring = True
        self.profile.system_monitoring_desc = "system monitoring desc {}".format(self.id)
        self.profile.have_feedback_mechanism = True
        self.profile.feedback_mechanism_desc = "feedback mechanism desc {}".format(self.id)
        self.profile.financial_control_system_desc = "financial control system desc {}".format(self.id)
        self.profile.partnership_collaborate_institution_desc = "collaborate institution {}".format(self.id)
        self.profile.explain = "explain {}".format(self.id)

        # financial controls
        self.profile.org_acc_system = FINANCIAL_CONTROL_SYSTEM_CHOICES.computerized
        self.profile.have_system_track = True
        self.profile.have_bank_account = True
        self.profile.have_separate_bank_account = True
        self.profile.financial_control_system_desc = "financial control system desc {}".format(self.id)

        # collaboration
        self.profile.any_partnered_with_un = False
        self.profile.any_accreditation = False
        self.profile.any_reference = False
        self.profile.partnership_collaborate_institution = False

        # project implementation
        self.profile.experienced_staff = False
        self.profile.experienced_staff = False

        self.profile.have_governing_document = True
        PartnerGoverningDocumentFactory(profile=self.profile)

        self.profile.registered_to_operate_in_country = random.randint(0, 1) == 0
        if self.profile.registered_to_operate_in_country:
            PartnerRegistrationDocumentFactory(profile=self.profile)
        else:
            self.profile.missing_registration_document_comment = "registration comment {}".format(self.id)

        self.profile.save()

    @factory.post_generation
    def mandate_mission(self, create, extracted, **kwargs):
        cfile = CommonFile.objects.create()
        cfile.file_field.save('test.csv', open(filename))

        PartnerMandateMission.objects.filter(partner=self).update(
            background_and_rationale="background and rationale {}".format(self.id),
            mandate_and_mission="mandate and mission {}".format(self.id),
            governance_structure="governance structure {}".format(self.id),
            governance_hq="reporting requirements of the country office to HQ {}".format(self.id),
            concern_groups=get_concerns(),
            security_desc="rapid response {}".format(self.id),
            population_of_concern=False,
            ethic_safeguard_comment="fake comment {}".format(self.id),
            governance_organigram=cfile,
            ethic_safeguard=False,
            ethic_fraud=True,
            ethic_fraud_policy=get_new_common_file(),
            security_high_risk_locations=True,
            security_high_risk_policy=True,
        )

    @factory.post_generation
    def fund(self, create, extracted, **kwargs):
        PartnerFunding.objects.filter(partner=self).update(
            source_core_funding="source(s) of core funding {}".format(self.id),
            major_donors=get_donors(),
            main_donors_list="main donors {}".format(self.id),
        )

    @factory.post_generation
    def audit(self, create, extracted, **kwargs):
        PartnerAuditAssessment.objects.filter(partner=self).update(
            regular_audited_comment="fake regular audited comment {}".format(self.id),
            regular_audited=False,
            regular_capacity_assessments=False,
            major_accountability_issues_highlighted=True,
            comment="fake comment {}".format(self.id),
        )

    @factory.post_generation
    def audit_reports(self, create, extracted, **kwargs):
        PartnerAuditReport.objects.create(
            created_by=User.objects.first(),
            partner=self,
            org_audit=ORG_AUDIT_CHOICES.donor,
            most_recent_audit_report=get_new_common_file(),
            link_report="http://fake.unicef.org/fake_uri{}_1".format(self.id),
        )
        PartnerAuditReport.objects.create(
            created_by=User.objects.first(),
            partner=self,
            org_audit=ORG_AUDIT_CHOICES.internal,
            most_recent_audit_report=get_new_common_file(),
            link_report="http://fake.unicef.org/fake_uri{}_2".format(self.id),
        )

    @factory.post_generation
    def capacity_assessments(self, create, extracted, **kwargs):
        PartnerCapacityAssessment.objects.create(
            created_by=User.objects.first(),
            partner=self,
            assessment_type=AUDIT_ASSESSMENT_CHOICES.micro,
            report_file=get_new_common_file(),
        )
        PartnerCapacityAssessment.objects.create(
            created_by=User.objects.first(),
            partner=self,
            assessment_type=AUDIT_ASSESSMENT_CHOICES.unhcr,
            report_url="http://fake.unicef.org/fake_uri{}_2".format(self.id),
        )

    @factory.post_generation
    def report(self, create, extracted, **kwargs):
        PartnerReporting.objects.filter(partner=self).update(
            publish_annual_reports=False,
            key_result="fake key result {}".format(self.id),
            last_report=date.today(),
            link_report="Http://fake.unicef.org/fake_uri{}".format(self.id),
            report=get_new_common_file()
        )

    @factory.post_generation
    def other_info(self, create, extracted, **kwargs):
        cfile = CommonFile.objects.create()
        cfile.file_field.save('test.csv', open(filename, 'rb'))
        logo_filename = os.path.join(settings.PROJECT_ROOT, 'apps', 'common', 'tests', 'logo.png')
        logo_file = CommonFile.objects.create()
        logo_file.file_field.save('logo.png', open(logo_filename, 'rb'))
        PartnerOtherInfo.objects.filter(partner=self).update(
            info_to_share="fake info to share {}".format(self.id),
            confirm_data_updated=True,
            org_logo=logo_file,
            other_doc_1=cfile,
            other_doc_2=cfile,
            other_doc_3=cfile,
        )

    @factory.post_generation
    def location_field_offices(self, create, extracted, **kwargs):
        field_offices_count = random.randint(0, 1) * random.randint(1, 4)
        if field_offices_count:
            self.more_office_in_country = True
            self.location_field_offices.add(*PointFactory.create_batch(field_offices_count))

            self.save()

    class Meta:
        model = Partner


class PartnerMemberFactory(factory.django.DjangoModelFactory):
    user = factory.SubFactory(UserFactory)
    partner = factory.LazyFunction(get_random_partner)
    title = factory.LazyFunction(get_job_title)
    role = PartnerRole.ADMIN.name

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

    agency = factory.LazyFunction(get_random_agency)
    country = factory.LazyFunction(get_country)

    class Meta:
        model = AgencyOffice
        django_get_or_create = ('agency', 'country')


class AgencyMemberFactory(factory.django.DjangoModelFactory):
    user = factory.SubFactory(UserFactory)
    office = factory.LazyFunction(get_random_agency_office)
    role = AgencyRole.ADMINISTRATOR.name

    class Meta:
        model = AgencyMember


class OpenEOIFactory(factory.django.DjangoModelFactory):
    title = factory.LazyFunction(get_cfei_title)
    agency = factory.LazyFunction(get_random_agency)
    created_by = factory.LazyFunction(get_agency_member)
    agency_office = factory.LazyFunction(get_random_agency_office)
    description = factory.Sequence(lambda n: "Brief background of the project {}".format(n))
    start_date = date.today()
    end_date = date.today() + timedelta(days=random.randint(90, 100))
    deadline_date = date.today() + timedelta(days=random.randint(75, 85))
    notif_results_date = date.today() + timedelta(days=random.randint(100, 111))

    class Meta:
        model = EOI

    @factory.post_generation
    def assessments_criteria(self, create, extracted, **kwargs):
        count = random.randint(3, 5)
        values = []
        while count:
            count -= 1
            criterion = random.choice(list(SELECTION_CRITERIA_CHOICES._db_values))
            if criterion not in map(lambda x: x['selection_criteria'], values):
                values.append(
                    {'selection_criteria': criterion, 'weight': random.randrange(10, 20, 5)}
                )

        result = sum(map(lambda x: x.get('weight'), values))
        values[-1]['weight'] += 100 - result
        self.assessments_criteria = values
        self.save()

    @factory.post_generation
    def reviewers(self, create, extracted, **kwargs):
        agency_members = User.objects.filter(is_superuser=False, agency_members__isnull=False).order_by("?")
        count = random.randint(2, 4)
        idx = agency_members.count()
        while count and idx:
            count -= 1
            idx -= 1
            self.reviewers.add(agency_members[idx])

    @factory.post_generation
    def focal_points(self, create, extracted, **kwargs):
        focal_point = get_agency_member(agency=self.agency)
        if focal_point:
            self.focal_points.add(focal_point)

    @factory.post_generation
    def invited_partners(self, create, extracted, **kwargs):
        partner = get_random_partner()
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
        cfile = CommonFile.objects.create()
        cfile.file_field.save('test.csv', open(filename))
        if self.display_type == CFEI_TYPES.direct:
            partner = get_random_partner()
            Application.objects.create(
                partner=partner,
                eoi=self,
                agency=self.agency,
                submitter=self.focal_points.first(),
                did_win=True,
                did_accept=True,
                ds_justification_select=[random.choice(list(JUSTIFICATION_FOR_DIRECT_SELECTION._db_values))],
                justification_reason="good reason",
            )
            self.selected_source = DIRECT_SELECTION_SOURCE.un
            self.save()
        elif self.display_type == CFEI_TYPES.open:
            for partner in Partner.objects.all().order_by("?")[:random.randint(16, 24)]:
                app = Application.objects.create(
                    partner=partner,
                    eoi=self,
                    agency=self.agency,
                    cn=cfile,
                    submitter=self.focal_points.first(),
                )
                for reviewer in self.reviewers.all():
                    scores = []
                    for criterion in self.assessments_criteria:
                        scores.append(
                            {'selection_criteria': criterion['selection_criteria'], 'score': random.randint(1, 10)}
                        )
                    Assessment.objects.create(
                        created_by=reviewer,
                        reviewer=reviewer,
                        application=app,
                        scores=scores,
                        date_reviewed=date.today(),
                        note='Note for application id: {}'.format(app.id)
                    )

    @factory.post_generation
    def locations(self, create, extracted, **kwargs):
        self.locations.add(*PointFactory.create_batch(random.randint(2, 3)))


class DirectEOIFactory(OpenEOIFactory):
    display_type = CFEI_TYPES.direct


class PartnerFlagFactory(factory.django.DjangoModelFactory):
    submitter = factory.LazyFunction(get_agency_member)
    partner = factory.LazyFunction(get_random_partner)
    contact_phone = factory.Sequence(lambda n: "+48 22 568030{}".format(n))
    contact_email = factory.Sequence(lambda n: "fake-contact-{}@unicef.org".format(n))
    comment = factory.Sequence(lambda n: "fake comment {}".format(n))
    contact_person = "Person Name"

    class Meta:
        model = PartnerFlag


class PartnerVerificationFactory(factory.django.DjangoModelFactory):
    partner = factory.LazyFunction(get_random_partner)
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


class UnsolicitedFactory(factory.django.DjangoModelFactory):
    is_unsolicited = True
    is_published = True
    partner = factory.LazyFunction(get_random_partner)
    submitter = factory.LazyFunction(get_partner_member)
    agency = factory.LazyFunction(get_random_agency)
    published_timestamp = factory.LazyFunction(timezone.now)

    class Meta:
        model = Application

    @factory.post_generation
    def proposal_of_eoi_details(self, create, extracted, **kwargs):
        self.proposal_of_eoi_details = {
            'specializations': [
                Specialization.objects.all().order_by("?").first().id,
            ],
            'title': 'fake title'
        }
        self.save()


class SanctionedItemFactory(factory.django.DjangoModelFactory):
    data_id = factory.Sequence(lambda n: n)

    class Meta:
        model = SanctionedItem
        django_get_or_create = ('data_id', )


class SanctionedNameFactory(factory.django.DjangoModelFactory):
    item = factory.SubFactory(SanctionedItemFactory)

    class Meta:
        model = SanctionedName


class SanctionedNameMatchFactory(factory.django.DjangoModelFactory):

    name = factory.SubFactory(SanctionedNameFactory)
    partner = factory.LazyFunction(get_random_partner)

    class Meta:
        model = SanctionedNameMatch
        django_get_or_create = ('name', 'partner')

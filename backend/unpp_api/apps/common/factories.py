import random
from datetime import date
from django.contrib.auth.models import Group
from django.db.models.signals import post_save
import factory
from factory import fuzzy
from account.models import User, UserProfile
from agency.models import Agency, AgencyOffice, AgencyMember
from common.models import Sector, Specialization
from partner.models import Partner, PartnerProfile, PartnerMember
from project.models import EOI
from .consts import (
    PARTNER_TYPES,
    MEMBER_STATUSES,
)
from .countries import COUNTRIES_ALPHA2_CODE


COUNTRIES = [x[0] for x in COUNTRIES_ALPHA2_CODE]


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

    class Meta:
        model = Partner


class PartnerProfileFactory(factory.django.DjangoModelFactory):
    partner = factory.Iterator(Partner.objects.all())
    alias_name = factory.Sequence(lambda n: "aliast name {}".format(n))
    org_head_first_name = factory.LazyFunction(get_first_name)
    org_head_last_name = factory.LazyFunction(get_last_name)
    org_head_email = factory.Sequence(lambda n: "fake-partner-head-{}@unicef.org".format(n))
    org_head_job_title = factory.LazyFunction(get_job_title)
    org_head_telephonee = "+48 22 568 03 00"
    working_languages = factory.LazyFunction(get_country_list)

    class Meta:
        model = PartnerProfile


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


class AgencyOfficeFactory(factory.django.DjangoModelFactory):

    name = factory.Sequence(lambda n: "agency office {}".format(n))
    agency = factory.SubFactory(AgencyFactory)
    # post generated - TODO when right time will come (when we need them - depending on endpoint)
    # countries_code = ArrayField(
    #     models.CharField(max_length=3, choices=COUNTRIES_ALPHA2_CODE),
    #     default=list
    # )
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
    agency = factory.SubFactory(AgencyFactory)
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

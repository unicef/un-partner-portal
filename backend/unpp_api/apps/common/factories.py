import random
from datetime import date
from django.contrib.auth.models import Group
from django.db.models.signals import post_save
import factory
from factory import fuzzy
from account.models import User, UserProfile
from agency.models import Agency, AgencyOffice
from partner.models import Partner, PartnerMember
from project.models import EOI
from .consts import (
    PARTNER_TYPES,
    MEMBER_STATUSES,
)
from .countries import COUNTRIES_ALPHA2_CODE


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
    country_code = random.choice(COUNTRIES_ALPHA2_CODE)[0]
    registration_number = factory.Sequence(lambda n: "reg-number {}".format(n))

    class Meta:
        model = Partner


class PartnerMemberFactory(factory.django.DjangoModelFactory):
    user = factory.SubFactory(UserFactory)
    partner = factory.SubFactory(PartnerFactory)
    title = random.choice(['Project Manager', 'PM Assistant', 'Agent'])
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

    class Meta:
        model = AgencyOffice


class EOIFactory(factory.django.DjangoModelFactory):
    title = factory.Sequence(lambda n: "title {}".format(n))
    country_code = random.choice(COUNTRIES_ALPHA2_CODE)[0]
    agency = factory.SubFactory(AgencyFactory)
    created_by = factory.SubFactory(UserFactory)
    focal_point = factory.SubFactory(UserFactory)
    # locations ... TODO when right time will come (when we need them - depending on endpoint)
    agency_office = factory.SubFactory(AgencyOfficeFactory)
    # specializations ... TODO when right time will come (when we need them - depending on endpoint)
    description = factory.Sequence(lambda n: "Brief background of the project {}".format(n))
    start_date = date.today()
    end_date = date.today()
    deadline_date = date.today()
    # invited_partners ... TODO when right time will come (when we need them - depending on endpoint)
    # reviewers ... TODO when right time will come (when we need them - depending on endpoint)

    class Meta:
        model = EOI

import random
from django.contrib.auth.models import Group
from django.db.models.signals import post_save
import factory
from factory import fuzzy
from account.models import User, UserProfile
from partner.models import Partner, PartnerMember
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

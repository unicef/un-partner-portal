from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save

from model_utils.models import TimeStampedModel


class User(AbstractUser):
    """
    User model inherited after AbstractUser class.
    """
    __partner_ids = None

    def __str__(self):
        return "{} - User".format(self.get_fullname())

    @property
    def is_agency_user(self):
        return self.agency_members.exists()

    @property
    def is_partner_user(self):
        return self.partner_members.exists()

    @property
    def is_account_locked(self):
        from partner.models import Partner
        # If associated w/ any partners accounts who are locked
        if self.is_partner_user:
            partner_ids = self.get_partner_ids_i_can_access()
            return Partner.objects.filter(id__in=partner_ids, is_locked=True).exists()
        return False

    def get_agency(self):
        if self.is_agency_user:
            return self.agency_members.first().office.agency

    def get_partner_ids_i_can_access(self):
        # Returns country partners if member of HQ (since no db relation there)
        if self.__partner_ids is not None:
            return self.__partner_ids

        partner_members = self.partner_members.all()
        self.__partner_ids = []
        for partner_member in partner_members:
            self.__partner_ids.append(partner_member.partner.id)
            if partner_member.partner.is_hq:
                self.__partner_ids.extend(
                    [p.id for p in partner_member.partner.country_profiles])

        return self.__partner_ids

    def get_fullname(self):
        return self.username

    def get_user_name(self):
        return "{} {}".format(self.first_name, self.last_name)


class UserProfile(TimeStampedModel):
    """
    User Profile model related with user as profile.

    related models:
        account.User (OneToOne): "user"
    """
    user = models.OneToOneField(User, related_name="profile")

    def __str__(self):
        return "{} - Profile".format(self.user.get_fullname())

    @classmethod
    def create_user_profile(cls, sender, instance, created, **kwargs):
        """
        Signal handler to create user profiles automatically
        """
        if created:
            cls.objects.create(user=instance)


post_save.connect(UserProfile.create_user_profile, sender=User)

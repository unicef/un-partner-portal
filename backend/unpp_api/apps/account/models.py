from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save

from model_utils.models import TimeStampedModel


class User(AbstractUser):
    """
    User model inherited after AbstractUser class.
    """

    def __str__(self):
        return "{} - User".format(self.get_fullname())

    @property
    def is_agency_user(self):
        return self.agency_members.exists()

    @property
    def is_partner_user(self):
        return self.partner_members.exists()

    def get_agency(self):
        if self.is_agency_user:
            return self.agency_members.first().office.agency

    def get_partner_ids_i_can_access(self):
        # Returns country partners if member of HQ (since no db relation there)
        partner_members = self.partner_members.all()
        partner_ids = []
        for partner_member in partner_members:
            partner_ids.append(partner_member.partner.id)
            if partner_member.partner.is_hq:
                partner_ids.extend(
                    [p.id for p in partner_member.partner.country_profiles])

        return partner_ids

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

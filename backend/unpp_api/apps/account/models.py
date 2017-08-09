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

    def get_fullname(self):
        return self.username


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

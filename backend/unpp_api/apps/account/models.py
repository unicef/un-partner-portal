from __future__ import unicode_literals

import random
import string

from cached_property import threaded_cached_property
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.db.models.signals import post_save
from django.utils import timezone

from model_utils.models import TimeStampedModel

from common.consts import NOTIFICATION_FREQUENCY_CHOICES
from common.database_fields import FixedTextField


class UserManager(BaseUserManager):

    def _create_user(self, fullname, email, password,
                     is_staff, is_superuser, **extra_fields):
        now = timezone.now()
        email = self.normalize_email(email)
        user = self.model(fullname=fullname, email=email,
                          is_staff=is_staff, is_active=True,
                          is_superuser=is_superuser, last_login=now,
                          date_joined=now, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, fullname, email, password=None, **extra_fields):
        return self._create_user(fullname, email, password, False, False, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(None, email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):

    fullname = models.CharField(
        'fullname',
        null=True,
        blank=True,
        max_length=512,
        help_text='Your fullname like first and last name, 512 characters.')

    email = models.EmailField('email address', max_length=254, unique=True)

    is_staff = models.BooleanField(
        'staff status',
        default=False,
        help_text='Designates whether the user can log into this admin site.',
    )
    is_active = models.BooleanField(
        'active',
        default=True,
        help_text=(
            'Designates whether this user should be treated as active. '
            'Deselect this instead of deleting accounts.'
        ),
    )

    date_joined = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = UserManager()

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'
        ordering = ['id']

    def get_short_name(self):
        return self.fullname

    def get_fullname(self):
        return self.fullname

    def __str__(self):
        return "{} ({})".format(self.get_fullname(), self.email)

    @property
    def is_agency_user(self):
        return self.agency_members.exists()

    @property
    def is_partner_user(self):
        return self.partner_members.exists()

    @property
    def member(self):
        return self.partner_members.first() if self.is_partner_user else self.agency_members.first()

    @threaded_cached_property
    def agency(self):
        from agency.models import Agency
        agencies = Agency.objects.filter(agency_offices__agency_members__user=self).distinct()
        if len(agencies) > 1:
            raise Exception('User belongs to more than 1 agency!')
        return agencies[0] if agencies else None

    @threaded_cached_property
    def partner_ids(self):
        partner_members = self.partner_members.exclude(partner__is_locked=True)
        partner_ids = []
        for partner_member in partner_members:
            partner_ids.append(partner_member.partner.id)
            if partner_member.partner.is_hq:
                partner_ids.extend(partner_member.partner.country_profiles.values_list('id', flat=True))

        return partner_ids

    def get_partner_ids_i_can_access(self):
        return self.partner_ids

    @threaded_cached_property
    def status(self):
        if not self.is_active:
            return 'Deactivated'
        elif not self.last_login:
            return 'Invited'
        else:
            return 'Active'

    def set_random_password(self):
        self.set_password(''.join(random.choices(string.printable, k=256)))


class UserProfile(TimeStampedModel):
    """
    User Profile model related with user as profile.

    related models:
        account.User (OneToOne): "user"
    """
    user = models.OneToOneField(User, related_name="profile")
    notification_frequency = FixedTextField(
        choices=NOTIFICATION_FREQUENCY_CHOICES, null=True, default=NOTIFICATION_FREQUENCY_CHOICES.daily
    )
    accepted_tos = models.BooleanField(default=False)

    def __str__(self):
        return "[{}] {}".format(self.user.email, self.user.get_fullname())

    @classmethod
    def create_user_profile(cls, sender, instance, created, **kwargs):
        """
        Signal handler to create user profiles automatically
        """
        if created:
            cls.objects.create(user=instance)


post_save.connect(UserProfile.create_user_profile, sender=User)

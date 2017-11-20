# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin

from .models import (
    User,
    UserProfile,
)

admin.site.register(User)
admin.site.register(UserProfile)

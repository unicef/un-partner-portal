# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from django.utils.html import format_html
from django.core.urlresolvers import reverse
from django.core.exceptions import PermissionDenied
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.admin import UserAdmin

from .models import (
    User,
    UserProfile,
)

admin.site.register(User, UserAdmin)
admin.site.register(UserProfile)

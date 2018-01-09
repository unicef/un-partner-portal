# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from account.models import User


class UserAdmin(BaseUserAdmin):
    list_display = ('fullname', 'email', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('fullname', 'email')
    ordering = ('email', )


admin.site.register(User, UserAdmin)

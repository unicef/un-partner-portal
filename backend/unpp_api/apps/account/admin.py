# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin

from account.models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ('fullname', 'email', 'is_staff')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('fullname', 'email')
    ordering = ('email', )


admin.site.register(User, UserAdmin)

# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from .models import (
    OtherAgency,
    Agency,
    AgencyProfile,
    AgencyOffice,
    AgencyMember,
)


class AgencyMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'office')
    list_filter = ('role', 'office__agency')
    search_fields = ('user__fullname', 'user__email')


admin.site.register(OtherAgency)
admin.site.register(Agency)
admin.site.register(AgencyProfile)
admin.site.register(AgencyOffice)
admin.site.register(AgencyMember, AgencyMemberAdmin)

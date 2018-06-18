# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import SanctionedItem, SanctionedName, SanctionedNameMatch


class SanctionedNameInline(admin.TabularInline):
    model = SanctionedName
    extra = 1


class SanctionedItemAdmin(admin.ModelAdmin):
    list_display = ('data_id', 'sanctioned_type', 'listed_on', 'is_active', 'names_count',)
    list_filter = ('sanctioned_type', 'is_active',)
    inlines = [
        SanctionedNameInline
    ]

    def names_count(self, obj):
        return obj.check_names.count()


class SanctionedNameMatchAdmin(admin.ModelAdmin):
    list_display = ('partner', 'name', 'match_type',
                    'match_text',
                    'created',
                    'can_ignore',)
    list_filter = ('can_ignore', 'match_type',)


admin.site.register(SanctionedItem, SanctionedItemAdmin)
admin.site.register(SanctionedNameMatch, SanctionedNameMatchAdmin)

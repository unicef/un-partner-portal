# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from project.models import (
    EOI,
    Pin,
    Application,
    ApplicationFeedback,
    Assessment,
)


class ApplicationAdmin(admin.ModelAdmin):
    search_fields = ('partner__legal_name', 'eoi__title')
    list_display = ('id', 'partner', 'eoi', 'agency', 'did_win', 'did_accept')
    list_filter = ('is_unsolicited', 'agency', 'status', 'did_win', 'did_accept', 'did_decline', 'did_withdraw')


admin.site.register(EOI)
admin.site.register(Pin)
admin.site.register(Application, ApplicationAdmin)
admin.site.register(ApplicationFeedback)
admin.site.register(Assessment)

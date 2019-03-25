# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from project.models import (
    EOI,
    ClarificationRequestQuestion,
    ClarificationRequestAnswerFile,
    EOIAttachment,
    Pin,
    Application,
    ApplicationFeedback,
    Assessment,
)


class ApplicationAdmin(admin.ModelAdmin):
    search_fields = ('partner__legal_name', 'eoi__title')
    list_display = ('id', 'partner', 'eoi', 'agency', 'did_win', 'did_accept')
    list_filter = ('is_unsolicited', 'agency', 'status', 'did_win', 'did_accept', 'did_decline', 'did_withdraw')


class EOIAdmin(admin.ModelAdmin):
    search_fields = ('displayID', 'title')
    list_display = ('displayID', 'display_type', 'title', 'agency')
    list_filter = ('display_type', 'agency', 'sent_for_publishing', 'is_published')
    exclude = (
        'preselected_partners',
    )


admin.site.register(EOI, EOIAdmin)
admin.site.register(EOIAttachment)
admin.site.register(ClarificationRequestQuestion)
admin.site.register(ClarificationRequestAnswerFile)
admin.site.register(Pin)
admin.site.register(Application, ApplicationAdmin)
admin.site.register(ApplicationFeedback)
admin.site.register(Assessment)

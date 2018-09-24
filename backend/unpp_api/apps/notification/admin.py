# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from notification.models import Notification, NotifiedUser


class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'source')
    list_filter = ('source', )


class NotifiedUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'recipient', 'get_source')
    list_filter = ('did_read', 'sent_as_email', 'notification__source')

    def get_source(self, obj: NotifiedUser):
        return obj.notification.source

    get_source.admin_order_field = 'notification__source'
    get_source.short_description = 'Source'


admin.site.register(Notification, NotificationAdmin)
admin.site.register(NotifiedUser, NotifiedUserAdmin)

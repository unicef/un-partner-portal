# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from notification.models import Notification, NotifiedUser


class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'source')
    list_filter = ('source', )


admin.site.register(Notification, NotificationAdmin)
admin.site.register(NotifiedUser)

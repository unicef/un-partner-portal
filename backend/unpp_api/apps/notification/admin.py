# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Notification, NotifiedUser


admin.site.register(Notification)
admin.site.register(NotifiedUser)

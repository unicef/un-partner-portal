# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from .models import (
    AdminLevel1,
    Point,
    Sector,
    Specialization,
    CommonFile,
)


class PointAdmin(admin.ModelAdmin):
    list_display = ('id', 'admin_level_1', 'lat', 'lon')


admin.site.register(AdminLevel1)
admin.site.register(Point, PointAdmin)
admin.site.register(Sector)
admin.site.register(Specialization)
admin.site.register(CommonFile)

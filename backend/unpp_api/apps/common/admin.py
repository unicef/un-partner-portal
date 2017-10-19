# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from .models import (
    AdminLevel1,
    Point,
    Sector,
    Specialization,
)

admin.site.register(AdminLevel1)
admin.site.register(Point)
admin.site.register(Sector)
admin.site.register(Specialization)

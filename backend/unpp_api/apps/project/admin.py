# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from .models import (
    EOI,
    Pin,
    Application,
    ApplicationFeedback,
    Assessment,
)

admin.site.register(EOI)
admin.site.register(Pin)
admin.site.register(Application)
admin.site.register(ApplicationFeedback)
admin.site.register(Assessment)

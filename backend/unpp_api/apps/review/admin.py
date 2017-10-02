# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import PartnerFlag, PartnerVerification

admin.site.register(PartnerFlag)
admin.site.register(PartnerVerification)

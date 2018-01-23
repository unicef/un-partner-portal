# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from partner.models import (
    Partner,
    PartnerProfile,
    PartnerHeadOrganization,
    PartnerMandateMission,
    PartnerExperience,
    PartnerMailingAddress,
    PartnerInternalControl,
    PartnerBudget,
    PartnerFunding,
    PartnerCollaborationPartnership,
    PartnerCollaborationEvidence,
    PartnerOtherInfo,
    PartnerMember,
    PartnerReview,
)


class PartnerAdmin(admin.ModelAdmin):
    search_fields = ('legal_name', 'country_code')
    list_display = ('legal_name', 'display_type', 'country_code', 'hq')
    list_filter = ('display_type', 'is_active', 'is_locked')


admin.site.register(Partner, PartnerAdmin)
admin.site.register(PartnerProfile)
admin.site.register(PartnerHeadOrganization)
admin.site.register(PartnerMandateMission)
admin.site.register(PartnerExperience)
admin.site.register(PartnerMailingAddress)
admin.site.register(PartnerInternalControl)
admin.site.register(PartnerBudget)
admin.site.register(PartnerFunding)
admin.site.register(PartnerCollaborationPartnership)
admin.site.register(PartnerCollaborationEvidence)
admin.site.register(PartnerOtherInfo)
admin.site.register(PartnerMember)
admin.site.register(PartnerReview)

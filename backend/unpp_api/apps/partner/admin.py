# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from partner.models import (
    Partner,
    PartnerProfile,
    PartnerHeadOrganization,
    PartnerAuthorisedOfficer,
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
    PartnerAuditAssessment,
    PartnerRegistrationDocument,
)


class PartnerAdmin(admin.ModelAdmin):
    search_fields = ('legal_name', 'country_code', 'migrated_original_id')
    list_display = ('legal_name', 'display_type', 'country_code', 'hq')
    list_filter = ('display_type', 'is_active', 'is_locked', 'migrated_from')


class PartnerMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'role', 'partner')
    list_filter = ('role', 'partner__display_type', )
    search_fields = ('user__fullname', 'user__email', 'partner__legal_name')


class PartnerRegistrationDocumentAdmin(admin.ModelAdmin):
    list_display = ('profile', 'registration_number', 'issue_date', 'expiry_date', )
    search_fields = ('profile__id', 'profile__partner__legal_name', 'registration_number')
    list_filter = ('profile__partner__country_code',)


admin.site.register(Partner, PartnerAdmin)
admin.site.register(PartnerProfile)
admin.site.register(PartnerHeadOrganization)
admin.site.register(PartnerAuthorisedOfficer)
admin.site.register(PartnerMandateMission)
admin.site.register(PartnerExperience)
admin.site.register(PartnerMailingAddress)
admin.site.register(PartnerInternalControl)
admin.site.register(PartnerBudget)
admin.site.register(PartnerFunding)
admin.site.register(PartnerCollaborationPartnership)
admin.site.register(PartnerCollaborationEvidence)
admin.site.register(PartnerOtherInfo)
admin.site.register(PartnerMember, PartnerMemberAdmin)
admin.site.register(PartnerReview)
admin.site.register(PartnerAuditAssessment)
admin.site.register(PartnerRegistrationDocument, PartnerRegistrationDocumentAdmin)

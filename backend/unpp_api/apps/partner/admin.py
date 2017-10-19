# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from .models import (
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
    PartnerCollaborationPartnershipOther,
    PartnerCollaborationEvidence,
    PartnerOtherInfo,
    PartnerMember,
    PartnerReview,
)

admin.site.register(Partner)
admin.site.register(PartnerProfile)
admin.site.register(PartnerHeadOrganization)
admin.site.register(PartnerMandateMission)
admin.site.register(PartnerExperience)
admin.site.register(PartnerMailingAddress)
admin.site.register(PartnerInternalControl)
admin.site.register(PartnerBudget)
admin.site.register(PartnerFunding)
admin.site.register(PartnerCollaborationPartnership)
admin.site.register(PartnerCollaborationPartnershipOther)
admin.site.register(PartnerCollaborationEvidence)
admin.site.register(PartnerOtherInfo)
admin.site.register(PartnerMember)
admin.site.register(PartnerReview)

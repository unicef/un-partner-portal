# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from .models import (
    Partner,
    PartnerProfile,
    PartnerMailingAddress,
    PartnerInternalControl,
    PartnerBudget,
    PartnerFunding,
    PartnerCollaborationPartnership,
    PartnerCollaborationPartnershipOther,
    PartnerCollaborationEvidence,
    PartnerMember,
    PartnerReview,
)

admin.site.register(Partner)
admin.site.register(PartnerProfile)
admin.site.register(PartnerMailingAddress)
admin.site.register(PartnerInternalControl)
admin.site.register(PartnerBudget)
admin.site.register(PartnerFunding)
admin.site.register(PartnerCollaborationPartnership)
admin.site.register(PartnerCollaborationPartnershipOther)
admin.site.register(PartnerCollaborationEvidence)
admin.site.register(PartnerMember)
admin.site.register(PartnerReview)

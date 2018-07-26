from django.contrib import admin

from externals.models import PartnerVendorNumber


class PartnerVendorNumberAdmin(admin.ModelAdmin):
    list_display = ('id', 'partner', 'agency', 'number')
    list_filter = ('agency', )


admin.site.register(PartnerVendorNumber, PartnerVendorNumberAdmin)

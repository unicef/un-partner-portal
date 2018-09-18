from django.contrib import admin

from externals.models import PartnerVendorNumber, UNICEFVendorData


class PartnerVendorNumberAdmin(admin.ModelAdmin):
    list_display = ('id', 'partner', 'agency', 'number')
    list_filter = ('agency', )


class UNICEFVendorDataAdmin(admin.ModelAdmin):
    list_display = (
        'vendor_number', 'vendor_name', 'business_area', 'year',
        'cash_transfers_this_year', 'total_cash_transfers'
    )
    list_filter = ('business_area', 'year')


admin.site.register(PartnerVendorNumber, PartnerVendorNumberAdmin)
admin.site.register(UNICEFVendorData, UNICEFVendorDataAdmin)

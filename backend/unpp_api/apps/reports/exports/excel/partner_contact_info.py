from partner.models import Partner
from reports.exports.excel.base import BaseXLSXExporter


class PartnerContactInformationXLSLExport(BaseXLSXExporter):

    def get_display_name(self):
        return f'{self.queryset.count()} Partners(s) Contact Information Report'

    def fill_worksheet(self):
        header_format = self.workbook.add_format({
            'bold': True,
            'text_wrap': True,
            'border': 1,
            'bg_color': '#3195EE',
            'align': 'center',
            'valign': 'vcenter',
            'font_color': '#FFFFFF'
        })

        header = [
            'Organization\'s Legal Name',
            'Acronym',
            'Type of Organization',
            'Contact Type',
            'Street',
            'PO Box',
            'Zip Code',
            'City',
            'Country',
            'Phone',
            'Fax',
            'Website',
            'Email',
        ]
        worksheet = self.workbook.add_worksheet('Partner Profile Report')

        current_row = 0

        for column, header_text in enumerate(header):
            worksheet.write(current_row, column, header_text, header_format)
            worksheet.set_column(column, column, len(header_text) + 5)

        current_row += 1

        partner: Partner
        for partner in self.queryset:
            worksheet.write_row(current_row, 0, (
                partner.legal_name,
                partner.profile.acronym,
                partner.get_display_type_display(),
                partner.mailing_address.get_mailing_type_display(),
                partner.mailing_address.street,
                partner.mailing_address.po_box,
                partner.mailing_address.zip_code,
                partner.mailing_address.city,
                partner.mailing_address.get_country_display(),
                partner.mailing_address.telephone,
                partner.mailing_address.fax,
                partner.mailing_address.website,
                partner.mailing_address.org_email,
            ))
            current_row += 1

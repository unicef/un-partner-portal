from partner.models import Partner, PartnerHeadOrganization
from reports.exports.excel.base import BaseXLSXExporter


class PartnerContactInformationXLSLExporter(BaseXLSXExporter):

    def get_display_name(self):
        return f'{self.queryset.count()} Partners(s) Contact Information Report'

    def fill_worksheet(self):
        boolean_display = {
            True: 'Yes',
            False: 'No',
            None: 'N/A',
        }
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
            'Partner Name',
            'Partner\nAcronym / Alias',
            'Partner Type',
            'Profile Type',
            'Partner Country of\nOrigin/Operation',
            'Name',
            'Title',
            'Authorized Officer?',
            'E-mail',
            'Telephone',
            'Address Type',
            'Street Address',
            'PO Box',
            'City',
            'Country',
            'Zip Code',
            'Website',
        ]
        worksheet = self.workbook.add_worksheet('Partner Profile Report')

        current_row = 0

        for column, header_text in enumerate(header):
            worksheet.write(current_row, column, header_text, header_format)
            worksheet.set_column(column, column, len(header_text) + 5)

        current_row += 1

        partner: Partner
        for partner in self.queryset:
            org_head: PartnerHeadOrganization = getattr(partner, 'org_head', None)
            worksheet.write_row(current_row, 0, (
                partner.legal_name,
                partner.profile.acronym,
                partner.get_display_type_display(),
                'HQ' if partner.is_hq else 'Country',
                partner.get_country_code_display(),
                org_head and org_head.fullname,
                org_head and org_head.job_title,
                org_head and boolean_display[partner.authorised_officers.filter(email=org_head.email).exists()],
                org_head and org_head.email,
                org_head and org_head.telephone,
                partner.mailing_address.get_mailing_type_display(),
                partner.mailing_address.street,
                partner.mailing_address.po_box,
                partner.mailing_address.city,
                partner.mailing_address.get_country_display(),
                partner.mailing_address.zip_code,
                partner.mailing_address.website,
            ))
            current_row += 1

from xlsxwriter.utility import xl_rowcol_to_cell

from agency.agencies import UNICEF, UNHCR, WFP
from partner.models import Partner, PartnerHeadOrganization
from reports.exports.excel.base import BaseXLSXExporter


class PartnerMappingReportXLSLExporter(BaseXLSXExporter):

    def get_display_name(self):
        return f'{self.queryset.count()} Partners(s) Mapping Report'

    def fill_worksheet(self):
        boolean_display = {
            True: 'Yes',
            False: 'No',
            None: 'Pending',
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
        headers = (
            ('', (
                'CSO Type',
                'Profile Type',
                'Country of Origin / Operation',
            )),
            ('', (
                'CSO Name',
                'CSO Acronym / Alias',
                'UNHCR\nVendor Number',
                'UNICEF\nVendor Number',
                'WFP\nVendor Number',
                'Registered in Country',
                'Sector',
                'Area of Specialization',
                'Emergencies',
            )),
            ('Point of Contact', (
                'Name',
                'Title',
                'E-mail',
                'Telephone',
            )),
            ('Address', (
                'Address Type',
                'Street Address',
                'PO Box',
                'Country',
                'City',
                'Zip Code',
            )),
            ('', (
                'Location(s) of field office',
                'Website',
                'Profile Completed?',
                'Last Profile Update',
            )),
        )
        worksheet = self.workbook.add_worksheet('Partner Mapping Report')

        current_row = 0
        header_column = 0

        for title, subtitles in headers:
            worksheet.merge_range(
                xl_rowcol_to_cell(
                    current_row, header_column
                ) + ':' + xl_rowcol_to_cell(
                    current_row, header_column + len(subtitles) - 1
                ),
                title,
                header_format
            )
            for column_offset, subtitle in enumerate(subtitles):
                worksheet.write(current_row + 1, header_column + column_offset, subtitle, header_format)

            header_column += len(subtitles)

        current_row += 2

        partner: Partner
        for partner in self.queryset:
            field_offices = "\n".join(set([
                l.admin_level_1.country_name for l in partner.location_field_offices.all()
            ]))
            sectors = "\n".join(set([
                e.specialization.category.name for e in partner.experiences.all()
            ]))
            specializations = "\n".join(set([
                e.specialization.name for e in partner.experiences.all()
            ]))

            vendor_numbers = dict(partner.vendor_numbers.values_list('agency__name', 'number'))

            org_head: PartnerHeadOrganization = getattr(partner, 'org_head', None)

            worksheet.write_row(current_row, 0, (
                partner.get_display_type_display(),
                'HQ' if partner.is_hq else 'Organization',
                partner.get_country_code_display(),
                partner.legal_name,
                partner.profile.acronym,
                vendor_numbers.get(UNHCR.name),
                vendor_numbers.get(UNICEF.name),
                vendor_numbers.get(WFP.name),
                boolean_display[partner.profile.registration_to_operate_in_country],
                sectors,
                specializations,
                boolean_display[partner.mandate_mission.security_high_risk_locations],
                org_head and org_head.fullname,
                org_head and org_head.job_title,
                org_head and org_head.email,
                org_head and org_head.telephone,
                partner.mailing_address.get_mailing_type_display(),
                partner.mailing_address.street,
                partner.mailing_address.po_box,
                partner.mailing_address.get_country_display(),
                partner.mailing_address.city,
                partner.mailing_address.zip_code,
                field_offices,
                partner.mailing_address.website,
                boolean_display[partner.profile_is_complete],
                partner.last_update_timestamp,
            ))
            current_row += 1

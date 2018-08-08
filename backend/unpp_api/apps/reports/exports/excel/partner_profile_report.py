from agency.agencies import UNHCR, UNICEF, WFP
from partner.models import Partner
from reports.exports.excel.base import BaseXLSXExporter


class PartnerProfileReportXLSLExporter(BaseXLSXExporter):

    def get_display_name(self):
        return f'{self.queryset.count()} Partners(s) Profile Report'

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

        header = [
            'CSO Type',
            'Profile Type',
            'Country of Origin / Operation',
            'CSO Name',
            'Acronym / Alias',
            'UNHCR Partner Code',
            'UNICEF Partner Code',
            'WFP Partner Code',
            'Registered in Country',
            'Registration Certificate Issuance Date',
            'Registration Certificate Expiration Date',
            'Location(s) of field office',
            'Sectors',
            'Areas of Specialization',
            'Number of Staff',
            'Most recent annual budget',
            'Date of Account Registration',
            'Experience working with UN',
            'Profile Completed?',
            'Last Profile Update',
            'Is Verified',
        ]
        worksheet = self.workbook.add_worksheet('Partner Profile Report')

        current_row = 0

        for column, header_text in enumerate(header):
            worksheet.write(current_row, column, header_text, header_format)
            worksheet.set_column(column, column, len(header_text) + 5)

        current_row += 1

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

            worksheet.write_row(current_row, 0, (
                partner.get_display_type_display(),
                'HQ' if partner.is_hq else 'Country',
                partner.get_country_code_display(),
                partner.legal_name,
                partner.profile.acronym,
                vendor_numbers.get(UNHCR.name),
                vendor_numbers.get(UNICEF.name),
                vendor_numbers.get(WFP.name),
                boolean_display[partner.profile.registered_to_operate_in_country],
                partner.profile.registration_date,
                'N/A',  # TODO: Registration Certificate Expiration Date
                field_offices,
                sectors,
                specializations,
                partner.get_staff_globally_display(),
                partner.profile.annual_budget_display,
                partner.created,
                ", ".join(partner.collaborations_partnership.values_list('agency__name', flat=True).distinct()),
                boolean_display[partner.profile_is_complete],
                partner.last_update_timestamp,
                boolean_display[partner.is_verified],
            ))
            current_row += 1

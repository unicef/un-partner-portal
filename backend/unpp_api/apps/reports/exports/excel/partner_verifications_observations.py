from partner.models import Partner
from reports.exports.excel.base import BaseXLSXExporter


class PartnerVerificationsObservationsReportXLSLExporter(BaseXLSXExporter):

    def get_display_name(self):
        return f'{self.queryset.count()} Partners(s) Profile Report'

    def fill_worksheet(self):
        verified_display = {
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
            'Organization\'s Legal Name',
            'Acronym',
            'Type of Organization',
            'Country',
            'Experience working with UN',
            'Verified',
            'Observations',
            'Yellow Flags',
            'Escalated Flags',
            'Red Flags',
        ]
        worksheet = self.workbook.add_worksheet('Partner Profile Report')

        current_row = 0

        for column, header_text in enumerate(header):
            worksheet.write(current_row, column, header_text, header_format)
            worksheet.set_column(column, column, len(header_text) + 5)

        current_row += 1

        partner: Partner
        for partner in self.queryset:
            flagging_status = partner.flagging_status

            worksheet.write_row(current_row, 0, (
                partner.legal_name,
                partner.profile.acronym,
                partner.get_display_type_display(),
                partner.get_country_code_display(),
                ", ".join(partner.collaborations_partnership.values_list('agency__name', flat=True).distinct()),
                verified_display[partner.is_verified],
                flagging_status['observation'],
                flagging_status['yellow'],
                flagging_status['escalated'],
                flagging_status['red'],
            ))
            current_row += 1

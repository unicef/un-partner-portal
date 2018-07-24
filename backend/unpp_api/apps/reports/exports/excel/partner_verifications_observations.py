from partner.models import Partner
from reports.exports.excel.base import BaseXLSXExporter


class PartnerVerificationsObservationsReportXLSLExporter(BaseXLSXExporter):

    def get_display_name(self):
        return f'{self.queryset.count()} Partners(s) Verifications and Observations Report'

    def fill_worksheet(self):
        boolean_display = {
            True: 'Yes',
            False: 'No',
            None: 'No',
        }
        verified_display = {
            True: 'Verified',
            False: 'Not Verified',
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
            'Partner Name',
            'Partner Acronym / Alias',
            'Partner Type',
            'INGO HQ?',
            'UNHCR-Entered\nPartner Code',
            'UNICEF-Entered\nVendor Number',
            'WFP-Entered\nVendor Number',
            'CSO Country of\nOrigin / Operation',
            'Last Profile Update',
            'Profile Verification Status',
            'Date of Verification Status',
            'Does Profile Include Risk Flags?',
            'Risk Flag Comments',
            'Date of Risk Flag\n(if applicable)',
            'Agency Raising\nRisk Flag',
            'Has Risk Flag been Escalated?',
            '# Partner Selections\nin the Last Year?'
        ]
        worksheet = self.workbook.add_worksheet('Verifications and Observations')

        current_row = 0

        for column, header_text in enumerate(header):
            worksheet.write(current_row, column, header_text, header_format)
            worksheet.set_column(column, column, len(header_text) + 5)

        current_row += 1

        partner: Partner
        for partner in self.queryset:
            latest_verification = partner.verifications.order_by('-created').last()
            flags = partner.flags.exclude(is_valid=False).exclude(submitter=None).order_by('created')
            comments_display = '\n\n'.join([f.comment for f in flags])
            flag_dates_display = '\n\n'.join([str(f.created.date()) for f in flags])
            flag_agencies_display = '\n\n'.join([f.submitter.agency.name for f in flags])
            flag_has_been_escalated_display = '\n\n'.join([
                boolean_display[f.has_been_escalated] for f in flags
            ])

            worksheet.write_row(current_row, 0, (
                partner.legal_name,
                partner.profile.acronym,
                partner.get_display_type_display(),
                boolean_display[partner.is_hq],
                'N/A',  # TODO: UNHCR Vendor Code
                'N/A',  # TODO: UNICEF Vendor Code
                'N/A',  # TODO: WFP Vendor Code
                partner.get_country_code_display(),
                partner.last_update_timestamp,
                verified_display[getattr(latest_verification, 'is_verified', None)],
                getattr(latest_verification, 'created', None),
                boolean_display[flags.exists()],
                comments_display,
                flag_dates_display,
                flag_agencies_display,
                flag_has_been_escalated_display,
                partner.applications.winners().count(),
            ))
            current_row += 1

        red_text_format = self.workbook.add_format({'font_color': 'red'})
        verification_column = header.index('Profile Verification Status')
        worksheet.conditional_format(
            1, verification_column, current_row, verification_column, {
                'type': 'text',
                'criteria': 'begins with',
                'value': verified_display[False],
                'format': red_text_format
            }
        )

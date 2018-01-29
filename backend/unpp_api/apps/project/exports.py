import os
import tempfile

import xlsxwriter
from django.utils import timezone
from xlsxwriter.utility import xl_rowcol_to_cell

from common.consts import BUDGET_CHOICES


class ApplicationCompareSpreadsheetGenerator(object):

    def __init__(self, applications, write_to=None):
        self.applications = applications
        eoi_name = applications.first().eoi.title if applications else None
        self.display_name = '[{:%a %-d %b %-H-%M-%S %Y}] {} selected concept notes summary'.format(
            timezone.now(), eoi_name
        )

        self.filename = self.display_name + '.xlsx'

        self.file_path = None if write_to else os.path.join(tempfile.gettempdir(), self.filename)

        if write_to:
            self.workbook = xlsxwriter.Workbook(write_to, {'in_memory': True})
        else:
            self.workbook = xlsxwriter.Workbook(self.file_path)

        self.header_format = self.workbook.add_format({
            'bold': True,
            'text_wrap': True,
            'border': 1,
            'bg_color': '#3195EE',
            'align': 'center',
            'valign': 'vcenter',
            'font_color': '#FFFFFF'
        })

        self.success_format = self.workbook.add_format({
            'text_wrap': True,
            'bg_color': '#259A5C',
            'font_color': '#FFFFFF',
            'border': 1,
        })

        self.error_format = self.workbook.add_format({
            'text_wrap': True,
            'bg_color': '#D20415',
            'font_color': '#FFFFFF',
            'border': 1,
        })

        self.warning_format = self.workbook.add_format({
            'text_wrap': True,
            'bg_color': '#FDC539',
            'font_color': '#FFFFFF',
            'border': 1,
        })

        self.neutral_format = self.workbook.add_format({
            'text_wrap': True,
            'bg_color': '#9E9E9E',
            'font_color': '#FFFFFF',
            'border': 1,
        })

    def generate(self):
        header = [
            'Partner Name',
            'Concept Note ID',
            'Average score',
            'Verification status',
            'Flagging status',
            'Year of Establishment',
            'UN Experience',
            'Annual Budget (USD)'
        ]
        worksheet = self.workbook.add_worksheet('Summary')

        current_row = 0
        current_column = 0
        for header_text in header:
            if header_text == 'Flagging status':
                worksheet.merge_range(
                    xl_rowcol_to_cell(
                        current_row, current_column
                    ) + ':' + xl_rowcol_to_cell(
                        current_row, current_column + 2
                    ),
                    header_text, self.header_format
                )
                worksheet.write(
                    current_row + 1, current_column, 'Yellow', self.warning_format
                )
                worksheet.set_column(current_column, current_column, 10)
                current_column += 1

                worksheet.write(
                    current_row + 1, current_column, 'Red', self.error_format
                )
                worksheet.set_column(current_column, current_column, 10)
                current_column += 1

                worksheet.write(
                    current_row + 1, current_column, 'Invalid', self.neutral_format
                )
                worksheet.set_column(current_column, current_column, 10)
            else:
                worksheet.merge_range(
                    xl_rowcol_to_cell(
                        current_row, current_column
                    ) + ':' + xl_rowcol_to_cell(
                        current_row + 1, current_column
                    ),
                    header_text, self.header_format
                )

                if header_text == 'Annual Budget (USD)':
                    column_width = max(map(lambda x: len(x[-1]), BUDGET_CHOICES))
                else:
                    column_width = len(header_text)
                worksheet.set_column(current_column, current_column, column_width)

            current_column += 1

        current_row += 2

        for application in self.applications:
            worksheet.write(current_row, 0, application.partner.legal_name)
            worksheet.write_url(current_row, 1, application.get_absolute_url(), string=str(application.pk))
            worksheet.write(current_row, 2, application.average_total_score)

            verification_status = application.partner_is_verified
            if verification_status:
                verification_text, verification_format = 'Verified', self.success_format
            elif verification_status is False:
                verification_text, verification_format = 'Not Verified', self.error_format
            else:
                verification_text, verification_format = 'Pending', self.neutral_format

            worksheet.write(current_row, 3, verification_text, verification_format)

            flagging_status = application.partner.flagging_status
            yellow_flags = flagging_status['yellow']
            worksheet.write(current_row, 4, yellow_flags, self.warning_format if yellow_flags else None)

            red_flags = flagging_status['red']
            worksheet.write(current_row, 5, red_flags, self.error_format if red_flags else None)

            invalid_flags = flagging_status['invalid']
            worksheet.write(current_row, 6, invalid_flags, self.neutral_format if invalid_flags else None)

            worksheet.write(current_row, 7, application.partner.profile.year_establishment)
            worksheet.write(
                current_row, 8,
                ", ".join(application.partner.collaborations_partnership.all().values_list('agency__name', flat=True))
            )

            budget = application.partner.budgets.filter(year=timezone.now().year).first()
            if budget:
                worksheet.write(current_row, 9, budget.get_budget_display())

            current_row += 1

        self.workbook.close()
        return self.file_path

    def cleanup(self):
        if self.file_path:
            os.remove(self.file_path)

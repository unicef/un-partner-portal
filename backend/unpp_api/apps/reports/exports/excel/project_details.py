from project.models import EOI
from reports.exports.excel.base import BaseXLSXExporter


class ProjectDetailsXLSLExporter(BaseXLSXExporter):

    def get_display_name(self):
        return f'{self.queryset.count()} Project(s) Information Report'

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
            'Project Name',
            'Type',
            'Agency',
            'Location(s)',
        ]
        worksheet = self.workbook.add_worksheet('Partner Profile Report')

        current_row = 0

        for column, header_text in enumerate(header):
            worksheet.write(current_row, column, header_text, header_format)
            worksheet.set_column(column, column, len(header_text) + 5)

        current_row += 1

        eoi: EOI
        for eoi in self.queryset:
            location_names = ", ".join(set([
                l.admin_level_1.country_name for l in eoi.locations.all()
            ]))

            worksheet.write_row(current_row, 0, (
                eoi.title,
                eoi.get_display_type_display(),
                eoi.agency.name,
                location_names,
            ))
            current_row += 1

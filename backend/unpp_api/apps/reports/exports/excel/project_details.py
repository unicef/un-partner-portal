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
            'ID',
            'Project Name',
            'Type',
            'Agency',
            'Location(s)',
            'Posted',
            'Application Deadline',
            'Notification of results',
            'Estimated start date',
            'Estimated end date',
            'Focal Point(s)',
        ]
        worksheet = self.workbook.add_worksheet('Project Details Report')

        current_row = 0

        for column, header_text in enumerate(header):
            worksheet.write(current_row, column, header_text, header_format)
            worksheet.set_column(column, column, len(header_text) + 5)

        current_row += 1

        eoi: EOI
        for eoi in self.queryset:
            location_names = "\n".join(set([
                l.admin_level_1.country_name for l in eoi.locations.all()
            ]))
            focal_points = "\n".join(set([
                f"{fp.fullname} ({fp.email})" for fp in eoi.focal_points.all()
            ]))

            worksheet.write_row(current_row, 0, (
                eoi.pk,
                eoi.title,
                eoi.get_display_type_display(),
                eoi.agency.name,
                location_names,
                eoi.published_timestamp,
                eoi.deadline_date,
                eoi.notif_results_date,
                eoi.start_date,
                eoi.end_date,
                focal_points,
            ))
            current_row += 1

from django.db.models import Count

from common.consts import PARTNER_TYPES
from project.models import EOI
from reports.exports.excel.base import BaseXLSXExporter


class ProjectDetailsXLSLExporter(BaseXLSXExporter):

    def get_display_name(self):
        return f'{self.queryset.count()} Project(s) Information Report'

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
            'ID',
            'Project Name',
            'Date of Publication',
            'Partnership Selection Modality',
            'Country',
            'Location(s)',
            'Sector(s)',
            'Area(s) of Specialization',
            'Status',
            'Date of Finalization',
            'Total # of Applicants',
            '# of ICSO\nApplicants',
            '# of NNGO\nApplicants',
            '# of CBO\nApplicants',
            '# of Academic\nApplicants',
            '# of Red Cross/Red\nCrescent National Society Applicants',
            '# of Applicants\nwithout UN Experience',
            'Name of Selected Partner(s)',
            'Selected Partner\'s\nVendor Number/Partner Code',
            'Selected Partner(s) Type',
            'Selected Partner\nhas UN experience',
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
                f"{l.admin_level_1.name} ({l.admin_level_1.country_name})" for l in eoi.locations.all()
            ]))
            country_names = "\n".join(set([
                l.admin_level_1.country_name for l in eoi.locations.all()
            ]))

            sectors_specializations = eoi.specializations.values('name', 'category__name').distinct()
            sectors = "\n".join(set([s['category__name'] for s in sectors_specializations]))
            specializations = "\n".join(set([s['name'] for s in sectors_specializations]))

            partner_type_application = dict(
                eoi.applications.values_list('partner__display_type').annotate(Count('id')).order_by()
            )

            winners = []
            winner_types = []
            winner_experiences = []
            winner_vendor_numbers = []
            for application in eoi.applications.winners():
                winners.append(application.partner.legal_name)
                winner_types.append(application.partner.get_display_type_display())
                winner_experiences.append(boolean_display[application.partner.experiences.exists()])
                winner_vendor_numbers.append('; '.join(
                    f'{agency}: {number}' for agency, number in
                    application.partner.vendor_numbers.values_list('agency__name', 'number')
                ))

            worksheet.write_row(current_row, 0, (
                eoi.pk,
                eoi.title,
                eoi.published_timestamp,
                eoi.selection_mode,
                country_names,
                location_names,
                sectors,
                specializations,
                eoi.status_display,
                eoi.completed_date,
                sum(partner_type_application.values()),
                partner_type_application.get(PARTNER_TYPES.international, 0),
                partner_type_application.get(PARTNER_TYPES.national, 0),
                partner_type_application.get(PARTNER_TYPES.cbo, 0),
                partner_type_application.get(PARTNER_TYPES.academic, 0),
                partner_type_application.get(PARTNER_TYPES.red_cross, 0),
                eoi.applications.filter(partner__experiences=None).count(),
                '\n'.join(winners),
                '\n'.join(winner_vendor_numbers),
                '\n'.join(winner_types),
                '\n'.join(winner_experiences),
            ))
            current_row += 1

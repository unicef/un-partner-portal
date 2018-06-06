import hashlib
import tempfile

import os
from collections import defaultdict

from babel.dates import get_timezone, format_datetime, format_date
from django.http import HttpResponse
from django.utils import timezone
from reportlab.lib import colors

from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, ListFlowable, ListItem

from common.consts import SELECTION_CRITERIA_CHOICES


CRITERIA_DISPLAY_DICT = dict(SELECTION_CRITERIA_CHOICES)


class CFEIPDFExporter:

    def __init__(self, cfei, timezone_name='UTC'):
        self.cfei = cfei
        self.tzinfo = get_timezone(timezone_name)
        filename = hashlib.sha256(str(cfei.id).encode()).hexdigest()
        self.file_path = os.path.join(tempfile.gettempdir(), filename + '.pdf')
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER))
        styles.add(ParagraphStyle(name='SmallRight', alignment=TA_CENTER))

        self.style_center = styles["Center"]
        self.style_normal = styles["Normal"]
        self.style_right = styles["SmallRight"]
        self.style_h1 = styles["Heading1"]
        self.style_h3 = styles["Heading3"]
        self.style_h4 = styles["Heading4"]

        self.style_h1.alignment = TA_CENTER
        self.style_h3.alignment = TA_CENTER
        self.style_right.alignment = TA_RIGHT
        self.style_right.fontSize = 8

        self.margin = 24

    def get_timeline_table(self):
        table_rows = [
            ['Posted', 'Application Deadline', 'Notification of Results', 'Start Date', 'End Date'],
            [
                format_date(self.cfei.published_timestamp),
                format_date(self.cfei.deadline_date),
                format_date(self.cfei.notif_results_date),
                format_date(self.cfei.start_date),
                format_date(self.cfei.end_date),
            ],
        ]
        table = Table(table_rows, colWidths='*')

        table.setStyle(TableStyle([
            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
            ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ]))
        return table

    def get_selection_criteria_table(self):
        table_rows = [
            ['Name', 'Weight'],
        ]
        for criteria in self.cfei.assessments_criteria:
            table_rows.append([
                CRITERIA_DISPLAY_DICT[criteria['selection_criteria']],
                criteria['weight'],
            ])

        table = Table(table_rows, colWidths='*')

        table.setStyle(TableStyle([
            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
            ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ]))
        return table

    def get_specializations_grouped_by_sector(self):
        grouped = defaultdict(list)
        for specialization in self.cfei.specializations.all():
            grouped[specialization.category.name].append(specialization.name)

        paragraph = ListFlowable(([
            *[
                Paragraph(sector_name, style=self.style_normal),
                ListFlowable([
                     Paragraph(spec, style=self.style_normal) for spec in sorted(grouped[sector_name])
                ], bulletType='a'),
                Spacer(1, self.margin / 3),
            ]
        ] for sector_name in sorted(grouped.keys())), bulletType='A')

        return paragraph

    def generate(self):
        document = SimpleDocTemplate(
            self.file_path,
            title=self.cfei.title,
            rightMargin=self.margin,
            leftMargin=self.margin,
            topMargin=self.margin,
            bottomMargin=self.margin
        )

        paragraphs = []
        timestamp = timezone.now()

        paragraphs.append(Paragraph(
            format_datetime(timestamp, 'medium', tzinfo=self.tzinfo), self.style_right
        ))

        if self.cfei.is_open:
            header = 'Call for Expression of Interest'
        else:
            header = 'Direct Selection / Retention'

        paragraphs.append(Paragraph(header, self.style_h3))
        paragraphs.append(Paragraph(self.cfei.title, self.style_h1))
        paragraphs.append(Spacer(1, self.margin))

        focal_points_display = [
            f'{focal_point.fullname} ({focal_point.email})' for focal_point in self.cfei.focal_points.all()
        ]

        main_content = ListFlowable([
            ListItem([
                Paragraph('Timeline', style=self.style_h4),
                self.get_timeline_table(),
                Spacer(1, self.margin / 2)
            ]),
            ListItem([
                Paragraph(f'Focal Point{"s" if len(focal_points_display) > 1 else ""}', style=self.style_h4),
                *map(lambda fc: Paragraph(fc, style=self.style_normal), focal_points_display),
                Spacer(1, self.margin / 2)
            ]),
            ListItem([
                Paragraph('Sector(s) and area(s) of specialization', style=self.style_h4),
                self.get_specializations_grouped_by_sector(),
                Spacer(1, self.margin / 2)
            ]),
            ListItem([
                Paragraph('Issued By', style=self.style_h4),
                Paragraph(self.cfei.agency.name, style=self.style_normal),
                Spacer(1, self.margin / 2)
            ]),
            ListItem([
                Paragraph('Project Background', style=self.style_h4),
                Paragraph(self.cfei.description, style=self.style_normal),
                Spacer(1, self.margin / 2)
            ]),
            ListItem([
                Paragraph('Expected Results', style=self.style_h4),
                Paragraph(self.cfei.goal or '-', style=self.style_normal),
                Spacer(1, self.margin / 2)
            ]),
            ListItem([
                Paragraph('Other Information', style=self.style_h4),
                Paragraph(self.cfei.other_information or '-', style=self.style_normal),
                Spacer(1, self.margin / 2)
            ]),
            ListItem([
                Paragraph('Selection Criteria', style=self.style_h4),
                self.get_selection_criteria_table(),
                Spacer(1, self.margin / 2)
            ]),
        ])

        paragraphs.append(main_content)
        document.build(paragraphs)

    def get_as_response(self):
        self.generate()
        response = HttpResponse()
        response.content_type = 'application/pdf'
        with open(self.file_path, 'rb') as content:
            response.write(content.read())
        self.cleanup()
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(f'{self.cfei.title}.pdf')
        return response

    def cleanup(self):
        os.remove(self.file_path)

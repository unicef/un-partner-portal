import hashlib
import os
import tempfile
from urllib.parse import quote
from collections import defaultdict

from babel.dates import get_timezone, format_datetime, format_date
from django.http import HttpResponse
from django.utils import timezone
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, ListFlowable, ListItem, Image

from common.consts import SELECTION_CRITERIA_CHOICES
from common.mapping import render_point_to_image_file
from common.models import Point
from project.models import EOI, EOIAttachment

CRITERIA_DISPLAY_DICT = dict(SELECTION_CRITERIA_CHOICES)
IMAGE_WIDTH = 450


class CFEIPDFExporter:

    def __init__(self, cfei, timezone_name='UTC'):
        self.cfei: EOI = cfei
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
        if self.cfei.is_open:
            table_rows = [
                [
                    'Posted',
                    format_date(self.cfei.published_timestamp),
                ],
                [
                    'Clarification Request Deadline',
                    format_date(self.cfei.clarification_request_deadline_date),
                ],
                [
                    'Application Deadline',
                    format_date(self.cfei.deadline_date),
                ],
                [
                    'Notification of Results',
                    format_date(self.cfei.notif_results_date),
                ],
                [
                    'Start Date',
                    format_date(self.cfei.start_date),
                ],
                [
                    'End Date',
                    format_date(self.cfei.end_date),
                ],
            ]
        else:
            table_rows = [
                [
                    'Posted',
                    format_date(self.cfei.published_timestamp),
                ],
                [
                    'Start Date',
                    format_date(self.cfei.start_date),
                ],
                [
                    'End Date',
                    format_date(self.cfei.end_date),
                ],
            ]

        table = Table(table_rows, colWidths='*')

        table.setStyle(TableStyle([
            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
            ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
            ('BACKGROUND', (0, 0), (0, -1), colors.darkgrey),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.white),
        ]))
        return table

    def get_selection_criteria_table(self):
        table_rows = [
            ['Name', 'Description', 'Weight'],
        ]
        for criteria in self.cfei.assessments_criteria:
            table_rows.append([
                CRITERIA_DISPLAY_DICT[criteria['selection_criteria']],
                Paragraph(criteria.get('description', ''), style=self.style_normal),
                Paragraph(str(criteria.get('weight', 'N/A')), style=self.style_normal),
            ])

        table = Table(table_rows, colWidths=['45%', '45%', '*'])

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

    def get_locations(self):
        grouped = defaultdict(list)
        point: Point
        for point in self.cfei.locations.all():
            grouped[point.admin_level_1.country_name].append(point)

        paragraphs = []

        for country_name, point_list in grouped.items():
            subitems = []

            for point in point_list:
                rendered_point_filename = render_point_to_image_file(
                    point,
                    height=IMAGE_WIDTH // 2,
                    width=IMAGE_WIDTH
                )
                point_paragraphs = [
                    Paragraph(point.admin_level_1.name, style=self.style_normal),
                ]
                if rendered_point_filename:
                    point_paragraphs.extend((
                        Spacer(1, self.margin / 4),
                        Image(rendered_point_filename),
                    ))

                subitems.append(point_paragraphs)

            paragraphs.append([
                Paragraph(country_name, style=self.style_normal),
                ListFlowable(subitems, bulletType='a'),
                Spacer(1, self.margin / 3),
            ])

        return ListFlowable(paragraphs, bulletType='A')

    def get_attachments_table(self):
        table_rows = [
            ['Description', 'URL'],
        ]

        attachment: EOIAttachment
        for attachment in self.cfei.attachments.all():
            table_rows.append([
                Paragraph(attachment.description, style=self.style_normal),
                Paragraph(attachment.file.file_field.url, style=self.style_normal),
            ])

        table = Table(table_rows, colWidths='*')

        table.setStyle(TableStyle([
            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
            ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ]))
        return table

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

        main_content = [
            ListItem([
                Paragraph('Timeline', style=self.style_h4),
                self.get_timeline_table(),
                Spacer(1, self.margin / 2)
            ]),
            ListItem([
                Paragraph('Locations', style=self.style_h4),
                self.get_locations(),
                Spacer(1, self.margin / 2)
            ]),
            ListItem([
                Paragraph('Sector(s) and area(s) of specialization', style=self.style_h4),
                self.get_specializations_grouped_by_sector(),
                Spacer(1, self.margin / 2)
            ]),
            ListItem([
                Paragraph('Issuing Agency', style=self.style_h4),
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
        ]

        if self.cfei.is_open:
            main_content.append(ListItem([
                Paragraph('Selection Criteria', style=self.style_h4),
                self.get_selection_criteria_table(),
                Spacer(1, self.margin / 2)
            ]))

        if self.cfei.attachments.exists():
            main_content.append(ListItem([
                Paragraph('Attachments', style=self.style_h4),
                self.get_attachments_table(),
                Spacer(1, self.margin / 2)
            ]))

        if self.cfei.is_open:
            cn_template = self.cfei.agency.profile.eoi_template
            main_content.append(ListItem([
                Paragraph('Concept Note Template', style=self.style_h4),
                Paragraph(cn_template.url if cn_template else '-', style=self.style_normal),
            ]))

        paragraphs.append(ListFlowable(main_content))
        document.build(paragraphs)

    def get_as_response(self):
        self.generate()
        response = HttpResponse()
        response.content_type = 'application/pdf'
        with open(self.file_path, 'rb') as content:
            response.write(content.read())
        self.cleanup()
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(f'{quote(self.cfei.title)}.pdf')
        return response

    def cleanup(self):
        os.remove(self.file_path)

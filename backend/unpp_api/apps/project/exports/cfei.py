import hashlib
import tempfile

import os

from babel.dates import get_timezone, format_datetime, format_date
from django.http import HttpResponse
from django.utils import timezone
from reportlab.lib import colors

from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle


class CFEIPDFExporter:

    def __init__(self, cfei, timezone_name='UTC'):
        self.cfei = cfei
        self.tzinfo = get_timezone(timezone_name)
        filename = hashlib.sha256(str(cfei.id).encode()).hexdigest()
        self.file_path = os.path.join(tempfile.gettempdir(), filename + '.pdf')
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER))

        self.style_center = styles["Center"]
        self.style_normal = styles["Normal"]
        self.style_right = styles["Normal"]
        self.style_h1 = styles["Heading1"]
        self.style_h3 = styles["Heading3"]

        self.style_h1.alignment = TA_CENTER
        self.style_h3.alignment = TA_CENTER
        self.style_right.alignment = TA_RIGHT
        self.style_right.fontSize = 8

        self.margin = 25

    def generate(self):
        document = SimpleDocTemplate(
            self.file_path,
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

        table_rows = [
            ['Timeline'],
            ['Posted', 'Application Deadline', 'Notification of Results', 'Estimated Start Date'],
            [
                format_date(self.cfei.published_timestamp),
                format_date(self.cfei.deadline_date),
                format_date(self.cfei.notif_results_date),
                format_date(self.cfei.start_date)
            ],
        ]
        table = Table(table_rows, colWidths='*')

        table.setStyle(TableStyle([
            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
            ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
            ('SPAN', (0, 0), (3, 0)),
            ('ALIGN', (0, 0), (3, 0), 'CENTER'),
            ('BACKGROUND', (0, 0), (3, 1), colors.darkgrey),
            ('TEXTCOLOR', (0, 0), (3, 1), colors.white),
        ]))
        paragraphs.append(table)
        paragraphs.append(Spacer(1, self.margin))

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

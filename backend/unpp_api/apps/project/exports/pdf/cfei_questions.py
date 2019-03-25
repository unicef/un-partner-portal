import hashlib
import tempfile

import os

from babel.dates import format_datetime, get_timezone
from django.http import HttpResponse
from django.utils import timezone

from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListItem, ListFlowable

from project.models import ClarificationRequestQuestion, EOI


class CFEIClarificationQuestionPDFExporter:

    def __init__(self, cfei: EOI, timezone_name='UTC'):
        self.cfei = cfei
        self.tzinfo = get_timezone(timezone_name)

        filename = hashlib.sha256(cfei.title.encode()).hexdigest()
        self.file_path = os.path.join(tempfile.gettempdir(), filename + '.pdf')
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='SmallRight', alignment=TA_CENTER))

        self.style_normal = styles["Normal"]
        self.style_right = styles["SmallRight"]
        self.style_h1 = styles["Heading1"]
        self.style_h2 = styles["Heading2"]
        self.style_h3 = styles["Heading3"]

        self.style_h1.alignment = TA_CENTER
        self.style_h2.alignment = TA_CENTER
        self.style_normal.alignment = TA_RIGHT
        self.style_right.alignment = TA_RIGHT
        self.style_right.fontSize = 8

        self.margin = 24

    def generate(self):
        document = SimpleDocTemplate(
            self.file_path,
            title=self.cfei.title,
            rightMargin=self.margin,
            leftMargin=self.margin,
            topMargin=self.margin,
            bottomMargin=self.margin
        )

        timestamp = timezone.now()
        paragraphs = [
            Paragraph(format_datetime(timestamp, 'medium'), self.style_right),
            Paragraph('Partner Clarification Questions', self.style_h2),
            Paragraph(
                f"{self.cfei.title} ({self.cfei.displayID})",
                self.style_h1
            ),
            Spacer(1, self.margin * 2),
        ]
        questions = []

        question: ClarificationRequestQuestion
        for question in self.cfei.questions.all():
            questions.append(ListItem((
                Paragraph(question.question, self.style_h3),
                Paragraph(format_datetime(question.created, 'medium'), self.style_right),
                Paragraph(
                    f"{question.created_by.fullname} ({question.created_by.email}) from {question.partner.legal_name}",
                    self.style_normal
                ),
                Spacer(1, self.margin),
            )))

        paragraphs.append(ListFlowable(questions))
        document.build(paragraphs)

    def get_as_response(self):
        self.generate()
        response = HttpResponse()
        response.content_type = 'application/pdf'
        with open(self.file_path, 'rb') as content:
            response.write(content.read())
        self.cleanup()
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(
            f'{self.cfei.title} Partner Questions.pdf'
        )
        return response

    def cleanup(self):
        os.remove(self.file_path)

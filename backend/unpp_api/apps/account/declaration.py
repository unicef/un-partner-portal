import hashlib
import mimetypes
import tempfile

import os

from babel.dates import format_datetime
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone

from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer

from common.models import CommonFile


class PartnerDeclarationPDFCreator:

    def __init__(self, declarations_list, partner_name, creator):
        self.declarations_list = declarations_list
        self.partner_name = partner_name
        self.creator = creator

        filename = hashlib.sha256(partner_name.encode()).hexdigest()
        self.file_path = os.path.join(tempfile.gettempdir(), filename + '.pdf')
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='SmallRight', alignment=TA_CENTER))

        self.style_normal = styles["Normal"]
        self.style_right = styles["SmallRight"]
        self.style_h1 = styles["Heading1"]
        self.style_h3 = styles["Heading3"]

        self.style_h1.alignment = TA_CENTER
        self.style_normal.alignment = TA_RIGHT
        self.style_right.alignment = TA_RIGHT
        self.style_right.fontSize = 8

        self.margin = 24

    def generate(self):
        document = SimpleDocTemplate(
            self.file_path,
            title=self.partner_name,
            rightMargin=self.margin,
            leftMargin=self.margin,
            topMargin=self.margin,
            bottomMargin=self.margin
        )

        timestamp = timezone.now()
        paragraphs = [
            Paragraph(format_datetime(timestamp, 'medium'), self.style_right),
            Paragraph(self.partner_name, self.style_h1),
            Spacer(1, self.margin),
        ]

        for declaration in self.declarations_list:
            paragraphs.extend((
                Paragraph(declaration['question'], self.style_h3),
                Paragraph(declaration['answer'], self.style_normal),
                Spacer(1, self.margin),
            ))

        paragraphs.extend((
            Paragraph('Declared By', self.style_right),
            Paragraph(f"{self.creator.fullname} ({self.creator.email})", self.style_normal),
        ))

        document.build(paragraphs)

    def get_as_common_file(self):
        self.generate()

        with open(self.file_path, 'rb') as content:
            filename = f'{self.partner_name} Registration Declaration.pdf'
            pdf_file = SimpleUploadedFile(
                filename,
                content.read(),
                mimetypes.guess_type(filename)
            )
        cf = CommonFile.objects.create(file_field=pdf_file)

        self.cleanup()
        return cf

    def cleanup(self):
        os.remove(self.file_path)

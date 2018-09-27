import mimetypes
import tempfile

import os
import uuid

from babel.dates import format_datetime
from django.core.files.uploadedfile import SimpleUploadedFile
from django.utils import timezone
from reportlab.lib import colors

from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Spacer, TableStyle, Table

from common.models import CommonFile
from partner.exports.pdf.partner_profile import CustomParagraph
from partner.models import Partner


class PartnerDeclarationPDFCreator:

    def __init__(self, declarations_list, partner: Partner, creator):
        self.declarations_list = declarations_list
        self.partner = partner
        self.creator = creator

        filename = uuid.uuid1()
        self.file_path = os.path.join(tempfile.gettempdir(), str(filename) + '.pdf')
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='SmallRight', alignment=TA_CENTER))

        self.style_normal = styles["Normal"]
        self.style_right = styles["SmallRight"]
        self.style_h1 = styles["Heading1"]
        self.style_h3 = styles["Heading3"]

        self.style_h1.alignment = TA_CENTER

        self.style_right.alignment = TA_RIGHT
        self.style_right.fontSize = 8

        self.margin = 24

        self.basic_info_table_style = TableStyle()

        self.declaration_table_style = TableStyle([
            ('INNERGRID', (0, 1), (-1, -1), 0.25, colors.black),
            ('VALIGN', (0, 0), (-1, -1), "TOP"),
            ('BOX', (0, 1), (-1, -1), 0.25, colors.black),
            ('BACKGROUND', (0, 1), (0, -1), colors.darkgrey),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.white),
        ])

    def generate(self):
        document = SimpleDocTemplate(
            self.file_path,
            title=self.partner.legal_name,
            rightMargin=self.margin,
            leftMargin=self.margin,
            topMargin=self.margin,
            bottomMargin=self.margin
        )

        timestamp = timezone.now()
        paragraphs = [
            CustomParagraph(format_datetime(timestamp, 'medium'), self.style_right),
            CustomParagraph('Partner Declaration', self.style_h1),
            Spacer(1, self.margin),
        ]

        acronym = self.partner.profile.acronym or ''
        partner_info_rows = (
            (
                CustomParagraph('Name of Organization:', self.style_normal),
                CustomParagraph(f'<u>{self.partner.legal_name}</u>', self.style_normal),
            ),
            (
                CustomParagraph('Acronym:', self.style_normal),
                CustomParagraph(f'<u>{acronym}</u>', self.style_normal),
            ),
            (
                CustomParagraph('Type of Organization:', self.style_normal),
                CustomParagraph(f'<u>{self.partner.get_display_type_display()}</u>', self.style_normal),
            ),
            (
                CustomParagraph('Country of Origin:', self.style_normal),
                CustomParagraph(f'<u>{self.partner.get_country_code_display()}</u>', self.style_normal),
            ),
            (
                CustomParagraph('Head of Organization (Name):', self.style_normal),
                CustomParagraph(f'<u>{self.partner.org_head.fullname}</u>', self.style_normal),
            ),
            (
                CustomParagraph('Head of Organization (Email):', self.style_normal),
                CustomParagraph(f'<u>{self.partner.org_head.email}</u>', self.style_normal),
            ),
        )

        table = Table(partner_info_rows, colWidths='*', style=self.basic_info_table_style)
        paragraphs.append(table)
        paragraphs.append(Spacer(1, self.margin))

        declarations_rows = [
            (
                CustomParagraph('', self.style_normal),
                CustomParagraph('<b>By answering yes, the organization confirms the following:</b>', self.style_normal),
                CustomParagraph('', self.style_normal),
            )
        ]
        for index, declaration in enumerate(self.declarations_list):
            declarations_rows.append((
                CustomParagraph(f'<b>{index}</b>', self.style_h3),
                CustomParagraph(declaration['question'], self.style_h3),
                CustomParagraph(declaration['answer'], self.style_normal),
            ))

        table = Table(declarations_rows, colWidths=[30, '*', 90], style=self.declaration_table_style)
        paragraphs.append(table)
        paragraphs.append(Spacer(1, self.margin))

        signed_by_rows = (
            (
                CustomParagraph('Partner Declaration Signed By (Name):', self.style_normal),
                CustomParagraph(self.creator.fullname, self.style_normal),
            ),
            (
                CustomParagraph('Position:', self.style_normal),
                CustomParagraph(f'<u>{self.creator.partner_members.first().title}</u>', self.style_normal),
            ),
            (
                CustomParagraph('Email:', self.style_normal),
                CustomParagraph(self.creator.email, self.style_normal),
            ),
        )

        table = Table(signed_by_rows, colWidths='*', style=self.basic_info_table_style)
        paragraphs.append(table)

        document.build(paragraphs)

    def get_as_common_file(self):
        self.generate()

        with open(self.file_path, 'rb') as content:
            filename = f'{self.partner.legal_name} Registration Declaration.pdf'
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

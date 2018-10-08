import hashlib
import tempfile

import os

from babel.dates import get_timezone, format_datetime, format_date
from django.http import HttpResponse
from django.utils import timezone
from reportlab.lib import colors

from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, ListFlowable, ListItem

from common.consts import SELECTION_CRITERIA_CHOICES, WORKING_LANGUAGES_CHOICES, PARTNER_DONORS_CHOICES, \
    COLLABORATION_EVIDENCE_MODES
from common.countries import COUNTRIES_ALPHA2_CODE
from partner.models import Partner
from partner.utilities import get_recent_budgets_for_partner

CRITERIA_DISPLAY_DICT = dict(SELECTION_CRITERIA_CHOICES)
WORKING_LANGUAGES_DISPLAY = dict(WORKING_LANGUAGES_CHOICES)
COUNTRIES_DISPLAY = dict(COUNTRIES_ALPHA2_CODE)
DONORS_DISPLAY = dict(PARTNER_DONORS_CHOICES)


NO_INFO_PLACEHOLDER = '<i>Information not provided</i>'

BOOLEAN_DISPLAY = {
    True: 'Yes',
    False: 'No',
    None: NO_INFO_PLACEHOLDER,
}


class TableMode:
    VERTICAL = 1
    HORIZONTAL = 2


class CustomParagraph(Paragraph):
    """
    Safeguard against None values breaking export
    """

    def __init__(self, content, *args, **kwargs):
        content = content or ''
        super(CustomParagraph, self).__init__(content, *args, **kwargs)


class PartnerProfilePDFExporter:

    def __init__(self, partner: Partner, timezone_name='UTC'):
        self.partner = partner
        self.tzinfo = get_timezone(timezone_name)
        filename = hashlib.sha256(str(partner.id).encode()).hexdigest()
        self.file_path = os.path.join(tempfile.gettempdir(), filename + '.pdf')
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER))
        styles.add(ParagraphStyle(name='TableHeader', textColor=colors.white))
        styles.add(ParagraphStyle(name='SmallRight', alignment=TA_CENTER))

        self.style_center = styles["Center"]
        self.style_normal = styles["Normal"]
        self.style_th = styles["TableHeader"]
        self.style_right = styles["SmallRight"]
        self.style_h1 = styles["Heading1"]
        self.style_h2 = styles["Heading2"]
        self.style_h3 = styles["Heading3"]
        self.style_h4 = styles["Heading4"]

        self.style_h1.alignment = TA_CENTER
        self.style_h2.alignment = TA_CENTER
        self.style_right.alignment = TA_RIGHT
        self.style_right.fontSize = 8

        self.margin = 24

        self.horizontal_table_style = TableStyle([
            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
            ('VALIGN', (0, 0), (-1, -1), "TOP"),
            ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
            ('BACKGROUND', (0, 0), (0, -1), colors.darkgrey),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.white),
        ])

        self.vertical_table_style = TableStyle([
            ('INNERGRID', (0, 0), (-1, -1), 0.25, colors.black),
            ('VALIGN', (0, 0), (-1, -1), "TOP"),
            ('BOX', (0, 0), (-1, -1), 0.25, colors.black),
            ('BACKGROUND', (0, 0), (-1, 0), colors.darkgrey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ])

    def wrap_table(self, table_rows, mode=TableMode.HORIZONTAL):
        if not table_rows:
            return CustomParagraph(NO_INFO_PLACEHOLDER, self.style_normal)

        formatted_rows = []

        for row_number, row in enumerate(table_rows):
            if mode == TableMode.HORIZONTAL:
                formatted_rows.append([
                    CustomParagraph(row[0], self.style_th),
                ] + list(map(lambda cell: CustomParagraph(str(cell), self.style_normal), row[1:])))
            else:
                style = self.style_th if row_number == 0 else self.style_normal
                formatted_rows.append(list(map(lambda cell: CustomParagraph(str(cell), style), row)))

        table = Table(formatted_rows, colWidths='*')
        if mode == TableMode.HORIZONTAL:
            table.setStyle(self.horizontal_table_style)
        else:
            table.setStyle(self.vertical_table_style)
        return table

    def get_basic_information_table(self):
        table_rows = [
            [
                'Organization\'s Legal Name',
                self.partner.legal_name,
            ],
            [
                'Alias (if applicable)',
                self.partner.profile.alias_name,
            ],
            [
                'Acronym (If applicable)',
                self.partner.profile.acronym,
            ],
            [
                'Organization\'s former Legal Name (optional)',
                self.partner.profile.former_legal_name,
            ],
            [
                'Country of Origin',
                self.partner.get_country_code_display(),
            ],
            [
                'Type of organization',
                self.partner.get_display_type_display(),
            ],
        ]
        return self.wrap_table(table_rows)

    def get_legal_status_table(self):
        table_rows = [
            [
                'Year of establishment in country of operation',
                self.partner.profile.year_establishment,
            ],
            [
                'Is the organization registered to operate in the country?',
                BOOLEAN_DISPLAY[self.partner.profile.registered_to_operate_in_country],
            ],
            [
                'Registration comment',
                self.partner.profile.missing_registration_document_comment,
            ],
            [
                'Does the Organization have a Governing Document?',
                BOOLEAN_DISPLAY[self.partner.profile.have_governing_document],
            ],
        ]
        return self.wrap_table(table_rows)

    def get_mailing_address_table(self):
        table_rows = [
            [
                'Type of mailing address',
                self.partner.mailing_address.get_mailing_type_display(),
            ],
            [
                'Street Address',
                self.partner.mailing_address.street,
            ],
            [
                'City',
                self.partner.mailing_address.city,
            ],
            [
                'Country',
                self.partner.mailing_address.get_country_display(),
            ],
            [
                'Zip Code (optional)',
                self.partner.mailing_address.zip_code,
            ],
            [
                'Telephone',
                self.partner.mailing_address.telephone,
            ],
            [
                'Fax (optional)',
                self.partner.mailing_address.fax,
            ],
            [
                'Website (optional)',
                self.partner.mailing_address.website,
            ],
            [
                'Organization Email (optional)',
                self.partner.mailing_address.org_email,
            ],
        ]
        return self.wrap_table(table_rows)

    def get_key_personnel_table(self):
        table_rows = [
            [
                'Does your organization have a board of director(s)?',
                BOOLEAN_DISPLAY[self.partner.profile.have_board_directors],
            ],
            [
                'Does your organization have any other authorized officers who are not listed above?',
                BOOLEAN_DISPLAY[self.partner.profile.have_authorised_officers],
            ],
        ]
        return self.wrap_table(table_rows)

    def get_organization_head_table(self):
        tables = []

        for org_head in self.partner.organisation_heads.order_by('-created'):
            table_rows = [
                [
                    'Full name',
                    getattr(org_head, 'fullname') or NO_INFO_PLACEHOLDER,
                ],
                [
                    'Job Title/Position',
                    getattr(org_head, 'job_title') or NO_INFO_PLACEHOLDER,
                ],
                [
                    'Telephone',
                    getattr(org_head, 'telephone') or NO_INFO_PLACEHOLDER,
                ],
                [
                    'Mobile (optional)',
                    getattr(org_head, 'mobile') or NO_INFO_PLACEHOLDER,
                ],
                [
                    'Fax (optional)',
                    getattr(org_head, 'fax') or NO_INFO_PLACEHOLDER,
                ],
                [
                    'Email',
                    getattr(org_head, 'email') or NO_INFO_PLACEHOLDER,
                ],
            ]
            tables.append(ListItem(self.wrap_table(table_rows)))

        return ListFlowable(tables, bulletType='a')

    def get_connectivity_table(self):
        table_rows = [
            [
                'Does the organization have reliable access to internet in all of its operations?',
                BOOLEAN_DISPLAY[self.partner.profile.connectivity],
            ],
            [
                'Please explain how communication is done with non-connected operations',
                self.partner.profile.connectivity_excuse,
            ],
        ]
        return self.wrap_table(table_rows)

    def get_working_languages_table(self):
        table_rows = [
            [
                'Working language(s) of your organization',
                ", ".join([WORKING_LANGUAGES_DISPLAY[code] for code in self.partner.profile.working_languages]),
            ],
            [
                'If other, please state',
                self.partner.profile.working_languages_other,
            ],
        ]
        return self.wrap_table(table_rows)

    def get_ethics_table(self):
        table_rows = [
            [
                'Briefly describe the organization’s mechanisms to safeguard against the violation '
                'and abuse of beneficiaries, including sexual exploitation and abuse.',
                self.partner.mandate_mission.ethic_safeguard_comment or NO_INFO_PLACEHOLDER,
            ],
            [
                'Are these mechanisms formally documented in an organizational policy or code of conduct?',
                BOOLEAN_DISPLAY[self.partner.mandate_mission.ethic_safeguard],
            ],
            [
                'Briefly describe the organization’s mechanisms to safeguard against '
                'fraud, corruption and other unethical behaviour.',
                self.partner.mandate_mission.ethic_fraud_comment or NO_INFO_PLACEHOLDER,
            ],
            [
                'Are these mechanisms formally documented in an organizational policy or code of conduct?',
                BOOLEAN_DISPLAY[self.partner.mandate_mission.ethic_fraud],
            ],
        ]
        return self.wrap_table(table_rows)

    def get_experiences_table(self):
        table_rows = []
        for experience in self.partner.experiences.all():
            table_rows.append((
                f"{experience.specialization.category.name}: {experience.specialization.name}",
                experience.get_years_display()
            ))

        return self.wrap_table(table_rows)

    def get_country_presence_table(self):
        table_rows = [
            [
                'Country',
                ', '.join([COUNTRIES_DISPLAY[code] for code in self.partner.country_presence]),
            ],
            [
                'Number of staff in country',
                self.partner.get_staff_in_country_display()
            ],
            [
                'Briefly describe the organization\'s engagement with the communities in which you operate',
                self.partner.engagement_operate_desc
            ],
        ]

        return self.wrap_table(table_rows)

    def get_security_table(self):
        table_rows = [
            [
                'Does the organization have the ability to work in high-risk security locations?',
                BOOLEAN_DISPLAY[self.partner.mandate_mission.security_high_risk_locations],
            ],
            [
                'Does the organization have policies, procedures and practices related to security risk management',
                BOOLEAN_DISPLAY[self.partner.mandate_mission.security_high_risk_policy],
            ],
            [
                'Briefly describe the organization\'s ability, if any, to scale-up operations in emergencies or '
                'other situations requiring rapid response.',
                self.partner.mandate_mission.security_desc
            ],
        ]

        return self.wrap_table(table_rows)

    def get_budget_table(self):
        table_rows = []
        for budget in get_recent_budgets_for_partner(self.partner):
            table_rows.append((
                str(budget.year),
                budget.budget and budget.get_budget_display(),
            ))

        return self.wrap_table(table_rows)

    def get_major_donors_table(self):
        table_rows = [
            [
                'Please select the type of donors that fund your agency',
                ', '.join([DONORS_DISPLAY[code] for code in self.partner.fund.major_donors]),
            ],
            [
                'Please list your main donors for programme activities',
                self.partner.fund.main_donors_list,
            ],
            [
                'Please list your main donors for core funding',
                self.partner.fund.source_core_funding,
            ],
        ]

        return self.wrap_table(table_rows)

    def get_collaborations_partnership_table(self):
        table_rows = []
        for cp in self.partner.collaborations_partnership.all():
            table_rows.append((
                cp.agency.name,
                cp.description
            ))

        return self.wrap_table(table_rows)

    def get_accreditations_table(self):
        table_rows = [
            (
                'Certifying/Accrediting Body',
                'Date Received',
            ),
        ]
        for acc in self.partner.collaboration_evidences.filter(mode=COLLABORATION_EVIDENCE_MODES.accreditation):
            table_rows.append((
                acc.organization_name,
                format_date(acc.date_received)
            ))

        return self.wrap_table(table_rows, mode=TableMode.VERTICAL)

    def get_references_table(self):
        table_rows = [
            (
                'Name of referring organization',
                'Date Received',
            ),
        ]
        for ref in self.partner.collaboration_evidences.filter(mode=COLLABORATION_EVIDENCE_MODES.reference):
            table_rows.append((
                ref.organization_name,
                format_date(ref.date_received)
            ))

        return self.wrap_table(table_rows, mode=TableMode.VERTICAL)

    def get_internal_controls_table(self):
        table_rows = [
            (
                'Area of Responsibility',
                'Segregation of Duties',
                'Comment',
            ),
        ]
        for ic in self.partner.internal_controls.all():
            table_rows.append((
                ic.get_functional_responsibility_display(),
                BOOLEAN_DISPLAY[ic.segregation_duties],
                ic.comment
            ))

        return self.wrap_table(table_rows, mode=TableMode.VERTICAL)

    def get_policy_areas_table(self):
        table_rows = [
            (
                'Area of Responsibility',
                'Documented Policies?',
            ),
        ]
        for ap in self.partner.area_policies.all():
            table_rows.append((
                ap.get_area_display(),
                BOOLEAN_DISPLAY[ap.document_policies],
            ))

        return self.wrap_table(table_rows, mode=TableMode.VERTICAL)

    def get_audit_reports_table(self):
        table_rows = [
            (
                'Audit Type',
                'Documented',
            ),
        ]
        for ar in self.partner.audit_reports.all():
            table_rows.append((
                ar.get_org_audit_display(),
                BOOLEAN_DISPLAY[bool(ar.most_recent_audit_report or ar.link_report)],
            ))

        return self.wrap_table(table_rows, mode=TableMode.VERTICAL)

    def get_capacity_assessments_item(self):
        if not self.partner.audit.regular_capacity_assessments:
            return Spacer(1, 0)

        table_rows = [
            (
                'Assessment Type',
                'Documented',
            ),
        ]
        for ca in self.partner.capacity_assessments.all():
            table_rows.append((
                ca.get_assessment_type_display(),
                BOOLEAN_DISPLAY[bool(ca.report_file or ca.report_url)],
            ))

        return self.wrap_table(table_rows, mode=TableMode.VERTICAL)

    def generate(self):
        document = SimpleDocTemplate(
            self.file_path,
            title=self.partner.legal_name,
            rightMargin=self.margin,
            leftMargin=self.margin,
            topMargin=self.margin,
            bottomMargin=self.margin
        )

        paragraphs = []
        timestamp = timezone.now()

        paragraphs.append(CustomParagraph(
            format_datetime(timestamp, 'medium', tzinfo=self.tzinfo), self.style_right
        ))
        paragraphs.append(CustomParagraph(self.partner.legal_name, self.style_h1))
        paragraphs.append(Spacer(1, self.margin))

        main_content = [
            ListItem([
                CustomParagraph('Identification', style=self.style_h3),
                CustomParagraph('Basic Information', self.style_h4),
                self.get_basic_information_table(),
                CustomParagraph('Legal Status', self.style_h4),
                self.get_legal_status_table(),
                Spacer(1, self.margin / 2)
            ]),
            ListItem([
                CustomParagraph('Contact information', style=self.style_h3),
                CustomParagraph('Mailing Address', self.style_h4),
                self.get_mailing_address_table(),
                CustomParagraph('Head(s) of Organization', self.style_h4),
                self.get_organization_head_table(),
                CustomParagraph('Key Personnel', self.style_h4),
                self.get_key_personnel_table(),
                CustomParagraph('Connectivity', self.style_h4),
                self.get_connectivity_table(),
                CustomParagraph('Working Languages', self.style_h4),
                self.get_working_languages_table(),
                Spacer(1, self.margin / 2)
            ]),
            ListItem([
                CustomParagraph('Mandate & Mission', style=self.style_h3),
                CustomParagraph(
                    'Briefly state the background and rationale for the establishment of the organization',
                    self.style_h4
                ),
                CustomParagraph(self.partner.mandate_mission.background_and_rationale, self.style_normal),
                CustomParagraph('Briefly state the mandate and mission of the organization', self.style_h4),
                CustomParagraph(self.partner.mandate_mission.mandate_and_mission, self.style_normal),
                CustomParagraph('Briefly describe the organization\'s governance structure', self.style_h4),
                CustomParagraph(self.partner.mandate_mission.governance_structure, self.style_normal),
                CustomParagraph('Ethics', self.style_h4),
                self.get_ethics_table(),
                CustomParagraph('Experience(s)', self.style_h4),
                self.get_experiences_table(),
                CustomParagraph(
                    'Does your organization work with populations of concern as defined by UNHCR?', self.style_h4
                ),
                CustomParagraph(BOOLEAN_DISPLAY[self.partner.mandate_mission.population_of_concern], self.style_normal),
                CustomParagraph('Country Presence', self.style_h4),
                self.get_country_presence_table(),
                CustomParagraph('Security', self.style_h4),
                self.get_security_table(),
                Spacer(1, self.margin / 2)
            ]),
            ListItem([
                CustomParagraph('Funding', style=self.style_h3),
                CustomParagraph(
                    'What is your organization\'s annual budget (in USD) for the current and two previous years?',
                    self.style_h4
                ),
                self.get_budget_table(),
                CustomParagraph('Major Donors', self.style_h4),
                self.get_major_donors_table(),
                Spacer(1, self.margin / 2)
            ]),
            ListItem([
                CustomParagraph('Collaboration', style=self.style_h3),
                CustomParagraph('Has your organization collaborated with any UN agency?', self.style_h4),
                CustomParagraph(BOOLEAN_DISPLAY[self.partner.collaborations_partnership.exists()], self.style_normal),
                self.get_collaborations_partnership_table(),
                CustomParagraph(
                    'Has the organization collaborated with or participated as a member of a cluster, '
                    'professional network, consortium or any similar institution?',
                    self.style_h4
                ),
                CustomParagraph(
                    BOOLEAN_DISPLAY[self.partner.profile.partnership_collaborate_institution], self.style_normal
                ),
                CustomParagraph(
                    'Please state which cluster, network or consortium and briefly explain the collaboration',
                    self.style_h4
                ),
                CustomParagraph(self.partner.profile.partnership_collaborate_institution_desc, self.style_normal),
                CustomParagraph(
                    'Would you like to upload any accreditations received by your organization?',
                    self.style_h4
                ),
                CustomParagraph(BOOLEAN_DISPLAY[self.partner.profile.any_accreditation], self.style_normal),
                self.get_accreditations_table() if self.partner.profile.any_accreditation else Spacer(1, 0),
                Spacer(1, self.margin / 2),
                CustomParagraph(
                    'Would you like to upload any reference letters for your organization?',
                    self.style_h4
                ),
                CustomParagraph(BOOLEAN_DISPLAY[self.partner.profile.any_reference], self.style_normal),
                self.get_references_table() if self.partner.profile.any_reference else Spacer(1, 0),
                Spacer(1, self.margin / 2),
            ]),
            ListItem([
                CustomParagraph('Project Implementation', style=self.style_h3),
                CustomParagraph('Programme Management', self.style_h3),
                CustomParagraph(
                    'Does the organization use a results-based approach to managing programmes and projects?',
                    self.style_h4
                ),
                CustomParagraph(BOOLEAN_DISPLAY[self.partner.profile.have_management_approach], self.style_normal),
                CustomParagraph('Please provide a brief description of your management approach', self.style_h4),
                CustomParagraph(self.partner.profile.management_approach_desc, self.style_normal),
                CustomParagraph(
                    'Does your organization have a system for monitoring and evaluating its programmes and projects?',
                    self.style_h4
                ),
                CustomParagraph(BOOLEAN_DISPLAY[self.partner.profile.have_system_monitoring], self.style_normal),
                CustomParagraph('Briefly explain your M&amp;E system', self.style_h4),
                CustomParagraph(self.partner.profile.system_monitoring_desc, self.style_normal),
                CustomParagraph(
                    'Does the organization have systems or procedures in place for '
                    'beneficiaries to provide feedback on project activities?',
                    self.style_h4
                ),
                CustomParagraph(BOOLEAN_DISPLAY[self.partner.profile.have_feedback_mechanism], self.style_normal),
                CustomParagraph('Briefly explain your feedback mechanism', self.style_h4),
                CustomParagraph(self.partner.profile.feedback_mechanism_desc, self.style_normal),
                CustomParagraph('Financial Controls', self.style_h3),
                CustomParagraph('Your organization\'s accounting system', self.style_h4),
                CustomParagraph(self.partner.profile.get_org_acc_system_display(), self.style_normal),
                CustomParagraph('What is the method of accounting adopted by the organization?', self.style_h4),
                CustomParagraph(self.partner.profile.get_method_acc_display(), self.style_normal),
                CustomParagraph(
                    'Does your organization have a system to track expenditures, '
                    'prepare project reports, and prepare claims for donors?',
                    self.style_h4
                ),
                CustomParagraph(BOOLEAN_DISPLAY[self.partner.profile.have_system_track], self.style_normal),
                CustomParagraph('Briefly explain the system used', self.style_h4),
                CustomParagraph(self.partner.profile.financial_control_system_desc, self.style_normal),
                CustomParagraph('Internal Controls', self.style_h3),
                CustomParagraph(
                    'Policy Area - Does the organization have formal documented policies '
                    'applicable to all operations that cover the following areas?',
                    self.style_h4
                ),
                self.get_internal_controls_table(),
                CustomParagraph(
                    'Does the organization have an adequate number of experienced staff responsible for '
                    'financial management in all operations?',
                    self.style_h4
                ),
                CustomParagraph(BOOLEAN_DISPLAY[self.partner.profile.experienced_staff], self.style_normal),
                CustomParagraph(
                    'Policy Area - Does the organization have formal documented policies applicable '
                    'to all operations that cover the following areas?',
                    self.style_h4
                ),
                self.get_policy_areas_table(),
                CustomParagraph('Banking Information', self.style_h3),
                CustomParagraph('Does the organization have a bank account?', self.style_h4),
                CustomParagraph(BOOLEAN_DISPLAY[self.partner.profile.have_bank_account], self.style_normal),
                CustomParagraph(
                    'Does the organization currently maintain, or has it previously maintained, '
                    'a separate interest-bearing account for UN funded projects that require a separate account?',
                    self.style_h4
                ),
                CustomParagraph(BOOLEAN_DISPLAY[self.partner.profile.have_separate_bank_account], self.style_normal),
                CustomParagraph('Audit &amp; Assessments', self.style_h3),
                CustomParagraph('Is the organization regularly audited?', self.style_h4),
                CustomParagraph(BOOLEAN_DISPLAY[self.partner.audit.regular_audited], self.style_normal),
                CustomParagraph(
                    'Please indicate the type(s) of audits the organization '
                    'undergoes?' if self.partner.audit.regular_audited else 'Please comment',
                    self.style_h4
                ),
                self.get_audit_reports_table() if self.partner.audit.regular_audited else CustomParagraph(
                    self.partner.audit.regular_audited_comment, self.style_normal
                ),
                CustomParagraph(
                    'Were there any major accountability issues highlighted by audits in the past three years?',
                    self.style_h4
                ),
                CustomParagraph(
                    BOOLEAN_DISPLAY[self.partner.audit.major_accountability_issues_highlighted], self.style_normal
                ),
                CustomParagraph('Please comment', self.style_h4
                                ) if self.partner.audit.major_accountability_issues_highlighted else Spacer(1, 0),
                CustomParagraph(self.partner.audit.comment, self.style_normal
                                ) if self.partner.audit.major_accountability_issues_highlighted else Spacer(1, 0),
                CustomParagraph(
                    'Has the organization undergone a formal capacity assessment?',
                    self.style_h4
                ),
                CustomParagraph(
                    BOOLEAN_DISPLAY[self.partner.audit.regular_capacity_assessments], self.style_normal
                ),
                self.get_capacity_assessments_item(),
                CustomParagraph('Reporting', self.style_h3),
                CustomParagraph(
                    'Briefly explain the key results achieved by your organization over the last year', self.style_h4
                ),
                CustomParagraph(self.partner.report.key_result, self.style_normal),
                CustomParagraph('Does the organization publish annual reports?', self.style_h4),
                CustomParagraph(BOOLEAN_DISPLAY[self.partner.report.publish_annual_reports], self.style_normal),
                CustomParagraph('Date of most recent annual report (if applicable)?', self.style_h4),
                CustomParagraph(format_date(self.partner.report.last_report), self.style_normal),
            ]),
            ListItem([
                CustomParagraph('Other Information', style=self.style_h3),
                CustomParagraph('Other information the organization may wish to share? (optional)', self.style_h4),
                CustomParagraph(self.partner.other_info.info_to_share, self.style_normal),
                CustomParagraph(
                    'The organization confirms that the information provided in the profile is accurate to the best '
                    'of its knowledge, and understands that any misrepresentations, falsifications or material '
                    'omissions in the profile, whenever discovered, may result in disqualification from or '
                    'termination of partnership with the UN.',
                    self.style_h4
                ),
                CustomParagraph(BOOLEAN_DISPLAY[self.partner.other_info.confirm_data_updated], self.style_normal),
            ]),
        ]

        paragraphs.append(ListFlowable(main_content))
        document.build(paragraphs)

    def get_as_response(self):
        self.generate()
        response = HttpResponse()
        response.content_type = 'application/pdf'
        with open(self.file_path, 'rb') as content:
            response.write(content.read())
        self.cleanup()
        response['Content-Disposition'] = 'attachment; filename="{}"'.format(f'{self.partner.legal_name}.pdf')
        return response

    def cleanup(self):
        os.remove(self.file_path)

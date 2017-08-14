from __future__ import unicode_literals

from model_utils import Choices


SATISFACTION_SCALES = Choices(
    ('Not', 'not', 'not satisfactory'),
    ('Sat', 'satisfactory', 'satisfactory'),
    ('Hig', 'highly', 'Highly satisfactory'),
)

PARTNER_REVIEW_TYPES = Choices(
    # TODO GET ALL!!! right now not specified !!!
    ('EX1', 'example1', 'Example 1'),
    ('EX2', 'example2', 'Example 2'),
    ('EX3', 'example3', 'Example 3'),
)

PARTNER_TYPES = Choices(
    ('CBO', 'cbo', 'Community Based Organization (CBO) '),
    ('NGO', 'national', 'National NGO'),
    ('Int', 'international', 'International NGO (INGO)'),
    ('Aca', 'academic', 'Academic Institution'),
    ('RCC', 'red_cross', 'Red Cross/Red Crescent Movement'),
)

EOI_TYPES = Choices(
    ('Ope', 'open', 'Open'),
    ('Dir', 'direct', 'Direct'),
)

APPLICATION_STATUSES = Choices(
    ('Pen', 'pending', 'Pending'),
    ('Pre', 'preselected', 'Preselected'),
    ('Rej', 'rejected', 'Rejected'),
)

SCALE_TYPES = Choices(
    ('Low', 'low', '1-3'),
    ('Std', 'standard', '1-10'),
    ('Hig', 'high', '1-100'),
)

MEMBER_ROLES = Choices(
    ('Adm', 'admin', 'Administrator'),
    ('Edi', 'editor', 'Editor'),
    ('Rea', 'reader', 'Reader'),
)

MEMBER_STATUSES = Choices(
    ('Act', 'active', 'Active'),
    ('Dea', 'deactivated', 'Deactivated'),
    ('Inv', 'invited', 'Invited'),
)

EOI_STATUSES = Choices(
    ('Ope', 'open', 'Open'),
    ('Clo', 'closed', 'Closed'),
)

COLLABORATION_EVIDENCE_MODES = Choices(
    ('Acc', 'accreditation', 'Accreditation'),
    ('Ref', 'reference', 'Reference'),
)

METHOD_ACC_ADOPTED_CHOICES = Choices(
    ('Cas', 'cash', 'Cash'),
    ('Acc', 'accrual', 'Accrual'),
)

FINANCIAL_CONTROL_SYSTEM_CHOICES = Choices(
    ('Com', 'computerized', 'Computerized accounting system'),
    ('Pap', 'paper', 'Paper-based accounting system'),
    ('NoS', 'no_system', 'No accounting system'),
)

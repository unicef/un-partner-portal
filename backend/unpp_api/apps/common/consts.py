from __future__ import unicode_literals

from model_utils import Choices


SATISFACTION_SCALE = Choices(
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

PARTNER_TYPE = Choices(
    ('int', 'international', 'International'),
    ('nat', 'national', 'National'),
)

EOI_TYPE = Choices(
    ('Ope', 'open', 'Open'),
    ('Dir', 'direct', 'Direct'),
)

APPLICATION_STATUS = Choices(
    ('Pen', 'pending', 'Pending'),
    ('Pre', 'preselected', 'Preselected'),
    ('Rej', 'rejected', 'Rejected'),
)

SCALE_TYPE = Choices(
    ('Low', 'low', '1-3'),
    ('Std', 'standard', '1-10'),
    ('Hig', 'high', '1-100'),
)

MEMBER_ROLE = Choices(
    ('Adm', 'admin', 'Administrator'),
    ('Edi', 'editor', 'Editor'),
    ('Rea', 'reader', 'Reader'),
)

MEMBER_STATUS = Choices(
    ('Act', 'active', 'Active'),
    ('Dea', 'deactivated', 'Deactivated'),
    ('Inv', 'invited', 'Invited'),
)

EOI_STATUS = Choices(
    ('Ope', 'open', 'Open'),
    ('Clo', 'closed', 'Closed'),
)

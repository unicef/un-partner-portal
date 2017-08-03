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


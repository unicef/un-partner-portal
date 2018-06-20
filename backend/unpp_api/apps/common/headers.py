from enum import unique, Enum


@unique
class CustomHeader(Enum):
    PARTNER_ID = 'HTTP_PARTNER_ID'
    AGENCY_OFFICE_ID = 'HTTP_AGENCY_OFFICE_ID'

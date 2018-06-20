from enum import unique, auto

from common.authentication_utilities import AutoNameEnum


@unique
class PartnerPermission(AutoNameEnum):

    # Registration & General
    REGISTER = auto()
    VIEW_DASHBOARD = auto()
    CREATE_COUNTRY_OFFICE = auto()

    EDIT_PROFILE = auto()
    EDIT_HQ_PROFILE = auto()

    # Applications
    CFEI_VIEW = auto()
    CFEI_PINNING = auto()
    CFEI_SEND_CLARIFICATION_REQUEST = auto()
    CFEI_SUBMIT_CONCEPT_NOTE = auto()
    CFEI_ANSWER_SELECTION = auto()

    # Unsolicited Concept Notes
    UCN_VIEW = auto()
    UCN_DRAFT = auto()
    UCN_EDIT = auto()
    UCN_SUBMIT = auto()
    UCN_DELETE = auto()

    # Direct Selection and Retention
    DSR_VIEW = auto()
    DSR_ANSWER = auto()

    RECEIVE_NOTIFICATIONS = auto()

    MANAGE_USERS = auto()

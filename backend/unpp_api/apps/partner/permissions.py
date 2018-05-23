from enum import unique, auto

from common.authentication_utilities import AutoNameEnum


@unique
class PartnerPermission(AutoNameEnum):

    # Registration & General
    REGISTER = auto()
    VIEW_DASHBOARD = auto()
    VIEW_INGO_DASHBOARD = auto()

    # Applications
    CFEI_VIEW = auto()
    CFEI_PINNING = auto()
    CFEI_SEND_CLARIFICATION_REQUEST = auto()
    CFEI_SUBMIT_CONCEPT_NOTE = auto()
    CFEI_ANSWER_SELECTION = auto()
    UCN_VIEW = auto()
    UCN_DRAFT = auto()
    UCN_SAVE = auto()
    UCN_SUBMIT = auto()
    UCN_DELETE = auto()
    DSR_VIEW = auto()
    DSR_ANSWER = auto()

    RECEIVE_NOTIFICATIONS = auto()

    MANAGE_USERS = auto()

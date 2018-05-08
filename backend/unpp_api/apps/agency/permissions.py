from enum import unique, auto

from common.authentication_utilities import AutoNameEnum


@unique
class AgencyPermission(AutoNameEnum):

    # User Management
    RESET_CSO_USER_PASSWORD = auto()
    OWN_AGENCY_ADD_USER = auto()
    OWN_AGENCY_DEACTIVATE_USER = auto()
    OWN_AGENCY_RELOCATE_USER = auto()

    # General
    VIEW_DASHBOARD = auto()
    RECEIVE_NOTIFICATIONS = auto()
    CSO_LIST_VIEW = auto()
    CSO_PROFILE_VIEW = auto()

    # CFEI
    CFEI_VIEW_LIST = auto()  # View Overview of all CFEIs with open and closed/under review status
    CFEI_VIEW_FINALIZED_RESULTS = auto()  # View results tab of finalized CFEI for all agencies: Selected CSO & CN

    # Create Draft CFEI for Own Agency
    CFEI_DRAFT_CREATE = auto()
    CFEI_DRAFT_MANAGE = auto()  # Save, edit, delete - if is the creator
    CFEI_DRAFT_MANAGE_FOCAL_POINT = auto()  # If is the creator
    CFEI_DRAFT_INVITE_CSO = auto()  # If is the creator
    CFEI_DRAFT_SEND_TO_FOCAL_POINT_TO_PUBLISH = auto()  # If is the creator

    # Publish Draft CFEI for Own Agency
    CFEI_SENT_EDIT = auto()  # If creator / focal point
    CFEI_SENT_INVITE_CSO = auto()  # If creator / focal point
    CFEI_SENT_PUBLISH = auto()  # If focal point
    CFEI_PUBLISH = auto()  # If creator

    # Modify Published CFEI for Own Agency
    CFEI_PUBLISHED_SEE_CLARIFICATION_QUESTIONS = auto()  # If creator / focal point
    CFEI_PUBLISHED_ANSWER_CLARIFICATION_QUESTIONS = auto()  # If creator / focal point
    CFEI_PUBLISHED_EDIT_DATES = auto()  # If creator / focal point
    CFEI_PUBLISHED_INVITE_CSO = auto()  # If creator / focal point
    CFEI_PUBLISHED_CANCEL = auto()  # If creator / focal point

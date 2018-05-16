from enum import unique, auto

from common.authentication_utilities import AutoNameEnum


@unique
class AgencyPermission(AutoNameEnum):

    # User Management
    RESET_CSO_USER_PASSWORD = auto()
    MY_AGENCY_LIST_USERS = auto()
    MY_AGENCY_ADD_USER = auto()
    MY_AGENCY_DEACTIVATE_USER = auto()
    MY_AGENCY_RELOCATE_USER = auto()

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

    # Assess Applications Submitted for CFEI Published by Own Agency
    CFEI_MANAGE_REVIEWERS = auto()  # If creator / focal point
    CFEI_VIEW_APPLICATIONS = auto()  # If creator / focal point
    CFEI_PRESELECT_APPLICATIONS = auto()  # If creator / focal point
    CFEI_ASSES_PRESELECTED_APPLICATIONS = auto()  # If creator / focal point
    CFEI_VIEW_MY_ASSESSMENT = auto()  # If creator / focal point
    CFEI_EDIT_MY_ASSESSMENT = auto()  # If creator / focal point
    CFEI_VIEW_ALL_ASSESSMENTS = auto()  # If creator / focal point
    CFEI_EDIT_ALL_ASSESSMENTS = auto()  # If creator / focal point
    CFEI_ADD_REVIEW_SUMMARY = auto()  # If creator / focal point
    CFEI_RECOMMEND_PARTNER_FOR_SELECTION = auto()  # If creator / focal point

    # Direct Selection & Retention
    CFEI_DIRECT_VIEW_OVERVIEW_WITH_JUSTIFICATION = auto()
    CFEI_DIRECT_CREATE_DRAFT_MANAGE_FOCAL_POINTS = auto()
    CFEI_DIRECT_INDICATE_CSO = auto()
    CFEI_DIRECT_SAVE_DRAFT = auto()
    CFEI_DIRECT_EDIT_DRAFT = auto()
    CFEI_DIRECT_DELETE_DRAFT = auto()
    CFEI_DIRECT_SEND_DRAFT_TO_FOCAL_POINT = auto()
    CFEI_DIRECT_EDIT_SENT = auto()
    CFEI_DIRECT_PUBLISH = auto()
    CFEI_DIRECT_EDIT_PUBLISHED = auto()
    CFEI_DIRECT_CANCEL = auto()

from enum import unique, auto

from common.authentication_utilities import AutoNameEnum


@unique
class AgencyPermission(AutoNameEnum):

    # User Management
    RESET_CSO_USER_PASSWORD = auto()
    MANAGE_USERS = auto()

    # General
    VIEW_DASHBOARD = auto()
    RECEIVE_NOTIFICATIONS = auto()
    CSO_LIST_AND_DETAIL_VIEW = auto()

    # CFEI
    CFEI_VIEW = auto()  # View Overview of all CFEIs with open and closed/under review status

    # Create Draft CFEI for Own Agency
    CFEI_DRAFT_CREATE = auto()
    CFEI_DRAFT_MANAGE = auto()  # Save, edit, delete, manage CSO's, focal points - if is the creator
    CFEI_DRAFT_SEND_TO_FOCAL_POINT_TO_PUBLISH = auto()  # If is the creator

    # Publish Draft CFEI for Own Agency
    CFEI_SENT_EDIT = auto()  # If creator / focal point
    CFEI_SENT_INVITE_CSO = auto()  # If creator / focal point
    CFEI_SENT_PUBLISH = auto()  # If focal point
    CFEI_PUBLISH = auto()  # If creator

    # Modify Published CFEI for Own Agency
    CFEI_PUBLISHED_VIEW_AND_ANSWER_CLARIFICATION_QUESTIONS = auto()  # If creator / focal point
    CFEI_PUBLISHED_EDIT_DATES = auto()  # If creator / focal point
    CFEI_PUBLISHED_INVITE_CSO = auto()  # If creator / focal point
    CFEI_PUBLISHED_CANCEL = auto()  # If creator / focal point

    # Assess Applications Submitted for CFEI Published by Own Agency
    CFEI_MANAGE_REVIEWERS = auto()  # If creator / focal point
    CFEI_VIEW_APPLICATIONS = auto()  # If creator / focal point
    CFEI_PRESELECT_APPLICATIONS = auto()  # If creator / focal point
    CFEI_REVIEW_APPLICATIONS = auto()  # If creator / focal point
    CFEI_VIEW_ALL_REVIEWS = auto()  # If creator / focal point
    CFEI_ADD_REVIEW_SUMMARY = auto()  # If creator / focal point
    CFEI_RECOMMEND_PARTNER_FOR_SELECTION = auto()  # If creator / focal point

    # Approve Partner Selection for CFEI Published by Own Agency
    CFEI_SELECT_RECOMMENDED_PARTNER = auto()  # If focal point
    CFEI_SELECT_PARTNER = auto()  # If creator
    CFEI_DESELECT_PARTNER = auto()  # If creator / focal point

    # Finalize CFEI Published by Own agency
    CFEI_FINALIZE = auto()  # If creator / focal point
    CFEI_FINALIZED_VIEW_ALL_REVIEWS = auto()  # If creator / focal point / reviewer
    CFEI_FINALIZED_VIEW_WINNER_AND_CN = auto()  # View results tab of finalized CFEI for all agencies: Selected CSO & CN
    CFEI_FINALIZED_VIEW_ALL_INFO = auto()

    # Direct Selection & Retention
    CFEI_DIRECT_CREATE_DRAFT_MANAGE_FOCAL_POINTS = auto()
    CFEI_DIRECT_INDICATE_CSO = auto()
    CFEI_DIRECT_SAVE_DRAFT = auto()
    CFEI_DIRECT_EDIT_DRAFT = auto()
    CFEI_DIRECT_DELETE_DRAFT = auto()
    CFEI_DIRECT_SEND_DRAFT_TO_FOCAL_POINT = auto()
    CFEI_DIRECT_EDIT_SENT = auto()  # If creator / focal point
    CFEI_DIRECT_PUBLISH = auto()  # If creator / focal point
    CFEI_DIRECT_EDIT_PUBLISHED = auto()
    CFEI_DIRECT_CANCEL = auto()
    CFEI_DIRECT_FINALIZE = auto()  # If creator / focal point

    # Sanctions check
    REVIEW_AND_MARK_SANCTIONS_MATCHES = auto()

    # Conduct Verification
    VERIFY_INGO_HQ = auto()
    VERIFY_CSOS_GLOBALLY = auto()
    VERIFY_CSOS_FOR_OWN_COUNTRY = auto()
    VERIFY_SEE_COMMENTS = auto()

    # View Observation & risk flags
    VIEW_PROFILE_OBSERVATION_FLAG_COUNT = auto()
    VIEW_PROFILE_OBSERVATION_FLAG_COMMENTS = auto()

    # Add Observation & risk flags all
    RESOLVE_ESCALATED_FLAG_ALL_CSO_PROFILES = auto()
    ADD_FLAG_OBSERVATION_ALL_CSO_PROFILES = auto()
    ADD_FLAG_OBSERVATION_COUNTRY_CSO_PROFILES = auto()

    # Reports
    RUN_REPORT_CSO_PROFILE = auto()
    RUN_REPORT_CSO_MAPPING = auto()
    RUN_REPORT_CSO_CONTACT = auto()
    RUN_REPORT_CFEI_MANAGEMENT = auto()
    RUN_REPORT_VERIFICATION_AND_FLAGGING = auto()

    # ERP
    ERP_ENTER_VENDOR_NUMBER = auto()

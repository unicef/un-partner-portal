from enum import unique, auto

from agency.agencies import UNHCR
from agency.permissions import AgencyPermission
from common.enums import AutoNameEnum


@unique
class AgencyRole(AutoNameEnum):
    """
    Editing names here WILL break roles saved in DB
    """
    # Global
    HQ_EDITOR = auto()
    ADMINISTRATOR = auto()
    READER = auto()

    # UNICEF & WFP
    EDITOR_BASIC = auto()
    EDITOR_ADVANCED = auto()

    # UNHCR
    PAM_USER = auto()
    MFT_USER = auto()

    @classmethod
    def get_choices(cls, agency=None):
        if agency and agency.name == UNHCR.name:
            def filter_function(role_name):
                return role_name not in {
                    AgencyRole.EDITOR_BASIC,
                    AgencyRole.EDITOR_ADVANCED,
                }
        elif agency:
            def filter_function(role_name):
                return role_name not in {
                    AgencyRole.PAM_USER,
                    AgencyRole.MFT_USER,
                    AgencyRole.HQ_EDITOR,
                }
        else:
            def filter_function(*args):
                return True

        return [(role.name, ROLE_LABELS[role]) for role in cls if filter_function(role)]


ROLE_LABELS = {
    AgencyRole.ADMINISTRATOR: 'Administrator',
    AgencyRole.HQ_EDITOR: 'HQ Editor',
    AgencyRole.READER: 'Reader',
    AgencyRole.EDITOR_BASIC: 'Basic Editor',
    AgencyRole.EDITOR_ADVANCED: 'Advanced Editor',
    AgencyRole.PAM_USER: 'PAM USER',
    AgencyRole.MFT_USER: 'MFT USER',
}


AGENCY_ROLE_PERMISSIONS = {
    AgencyRole.HQ_EDITOR: frozenset([
        AgencyPermission.RESET_CSO_USER_PASSWORD,
        AgencyPermission.MANAGE_USERS,
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
        AgencyPermission.CFEI_VIEW,
        AgencyPermission.CFEI_FINALIZED_VIEW_WINNER_AND_CN,
        AgencyPermission.REVIEW_AND_MARK_SANCTIONS_MATCHES,
        AgencyPermission.VERIFY_INGO_HQ,
        AgencyPermission.VERIFY_CSOS_GLOBALLY,
        AgencyPermission.VERIFY_CSOS_FOR_OWN_COUNTRY,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_FLAG_COUNT,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_FLAG_COMMENTS,
        AgencyPermission.VERIFY_SEE_COMMENTS,
        AgencyPermission.ADD_FLAG_OBSERVATION_ALL_CSO_PROFILES,
        AgencyPermission.ADD_RED_FLAG_ALL_CSO_PROFILES,
        AgencyPermission.RESOLVE_ESCALATED_FLAG_ALL_CSO_PROFILES,
        AgencyPermission.RUN_REPORT_CSO_PROFILE,
        AgencyPermission.RUN_REPORT_CSO_MAPPING,
        AgencyPermission.RUN_REPORT_CSO_CONTACT,
        AgencyPermission.RUN_REPORT_CFEI_MANAGEMENT,
        AgencyPermission.RUN_REPORT_VERIFICATION_AND_FLAGGING,
        AgencyPermission.ERP_ENTER_VENDOR_NUMBER,
    ]),
    AgencyRole.ADMINISTRATOR: frozenset([
        AgencyPermission.RESET_CSO_USER_PASSWORD,
        AgencyPermission.MANAGE_USERS,
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
        AgencyPermission.CFEI_VIEW,
        AgencyPermission.CFEI_FINALIZED_VIEW_WINNER_AND_CN,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_FLAG_COUNT,
        AgencyPermission.RUN_REPORT_CSO_PROFILE,
        AgencyPermission.RUN_REPORT_CSO_MAPPING,
        AgencyPermission.RUN_REPORT_CSO_CONTACT,
        AgencyPermission.ERP_ENTER_VENDOR_NUMBER,
    ]),
    AgencyRole.READER: frozenset([
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
        AgencyPermission.CFEI_VIEW,
        AgencyPermission.CFEI_FINALIZED_VIEW_WINNER_AND_CN,
        AgencyPermission.RUN_REPORT_CSO_PROFILE,
        AgencyPermission.RUN_REPORT_CSO_MAPPING,
        AgencyPermission.RUN_REPORT_CSO_CONTACT,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_FLAG_COUNT,
    ]),
    AgencyRole.EDITOR_BASIC: frozenset([
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
        AgencyPermission.CFEI_VIEW,
        AgencyPermission.CFEI_FINALIZED_VIEW_WINNER_AND_CN,
        AgencyPermission.CFEI_DRAFT_CREATE,
        AgencyPermission.CFEI_DRAFT_MANAGE,
        AgencyPermission.CFEI_DRAFT_SEND_TO_FOCAL_POINT_TO_PUBLISH,
        AgencyPermission.CFEI_DIRECT_SEND_DRAFT_TO_FOCAL_POINT,
        AgencyPermission.CFEI_DIRECT_CREATE_DRAFT_MANAGE_FOCAL_POINTS,
        AgencyPermission.CFEI_DIRECT_EDIT_DRAFT,
        AgencyPermission.CFEI_DIRECT_DELETE_DRAFT,
        AgencyPermission.CFEI_VIEW_ALL_REVIEWS,
        AgencyPermission.CFEI_ADD_REVIEW_SUMMARY,
        AgencyPermission.CFEI_PUBLISHED_VIEW_AND_ANSWER_CLARIFICATION_QUESTIONS,
        AgencyPermission.CFEI_PUBLISHED_EDIT_DATES,
        AgencyPermission.CFEI_PUBLISHED_INVITE_CSO,
        AgencyPermission.CFEI_PUBLISHED_CANCEL,
        AgencyPermission.CFEI_MANAGE_REVIEWERS,
        AgencyPermission.CFEI_VIEW_APPLICATIONS,
        AgencyPermission.CFEI_PRESELECT_APPLICATIONS,
        AgencyPermission.CFEI_REVIEW_APPLICATIONS,
        AgencyPermission.CFEI_RECOMMEND_PARTNER_FOR_SELECTION,
        AgencyPermission.CFEI_FINALIZE,
        AgencyPermission.CFEI_FINALIZED_VIEW_ALL_REVIEWS,

        AgencyPermission.CFEI_DIRECT_CREATE_DRAFT_MANAGE_FOCAL_POINTS,
        AgencyPermission.CFEI_DIRECT_INDICATE_CSO,
        AgencyPermission.CFEI_DIRECT_SAVE_DRAFT,
        AgencyPermission.CFEI_DIRECT_EDIT_DRAFT,
        AgencyPermission.CFEI_DIRECT_DELETE_DRAFT,
        AgencyPermission.CFEI_DIRECT_SEND_DRAFT_TO_FOCAL_POINT,
        AgencyPermission.CFEI_DIRECT_EDIT_PUBLISHED,
        AgencyPermission.CFEI_DIRECT_CANCEL,

        AgencyPermission.UCN_CONVERT_TO_DSR,

        AgencyPermission.VIEW_PROFILE_OBSERVATION_FLAG_COUNT,
        AgencyPermission.RUN_REPORT_CFEI_MANAGEMENT,
        AgencyPermission.RUN_REPORT_CSO_PROFILE,
        AgencyPermission.RUN_REPORT_CSO_MAPPING,
        AgencyPermission.RUN_REPORT_CSO_CONTACT,
        AgencyPermission.ERP_ENTER_VENDOR_NUMBER,
    ]),
    AgencyRole.EDITOR_ADVANCED: frozenset([
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
        AgencyPermission.CFEI_VIEW,
        AgencyPermission.CFEI_FINALIZED_VIEW_WINNER_AND_CN,
        AgencyPermission.CFEI_DRAFT_CREATE,
        AgencyPermission.CFEI_DRAFT_MANAGE,
        AgencyPermission.CFEI_PUBLISH,
        AgencyPermission.CFEI_VIEW_ALL_REVIEWS,
        AgencyPermission.CFEI_ADD_REVIEW_SUMMARY,
        AgencyPermission.CFEI_PUBLISHED_VIEW_AND_ANSWER_CLARIFICATION_QUESTIONS,
        AgencyPermission.CFEI_PUBLISHED_EDIT_DATES,
        AgencyPermission.CFEI_PUBLISHED_INVITE_CSO,
        AgencyPermission.CFEI_PUBLISHED_CANCEL,
        AgencyPermission.CFEI_SENT_INVITE_CSO,
        AgencyPermission.CFEI_SENT_EDIT,
        AgencyPermission.CFEI_SENT_PUBLISH,
        AgencyPermission.CFEI_MANAGE_REVIEWERS,
        AgencyPermission.CFEI_VIEW_APPLICATIONS,
        AgencyPermission.CFEI_PRESELECT_APPLICATIONS,
        AgencyPermission.CFEI_REVIEW_APPLICATIONS,
        AgencyPermission.CFEI_SELECT_RECOMMENDED_PARTNER,
        AgencyPermission.CFEI_SELECT_PARTNER,
        AgencyPermission.CFEI_DESELECT_PARTNER,
        AgencyPermission.CFEI_FINALIZE,
        AgencyPermission.CFEI_FINALIZED_VIEW_ALL_REVIEWS,
        AgencyPermission.CFEI_FINALIZED_VIEW_ALL_INFO,

        AgencyPermission.CFEI_DIRECT_CREATE_DRAFT_MANAGE_FOCAL_POINTS,
        AgencyPermission.CFEI_DIRECT_INDICATE_CSO,
        AgencyPermission.CFEI_DIRECT_SAVE_DRAFT,
        AgencyPermission.CFEI_DIRECT_EDIT_DRAFT,
        AgencyPermission.CFEI_DIRECT_DELETE_DRAFT,
        AgencyPermission.CFEI_DIRECT_EDIT_SENT,
        AgencyPermission.CFEI_DIRECT_PUBLISH,
        AgencyPermission.CFEI_DIRECT_EDIT_PUBLISHED,
        AgencyPermission.CFEI_DIRECT_CANCEL,

        AgencyPermission.UCN_CONVERT_TO_DSR,

        AgencyPermission.REVIEW_AND_MARK_SANCTIONS_MATCHES,

        AgencyPermission.VERIFY_CSOS_FOR_OWN_COUNTRY,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_FLAG_COUNT,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_FLAG_COMMENTS,
        AgencyPermission.VERIFY_SEE_COMMENTS,
        AgencyPermission.ADD_FLAG_OBSERVATION_COUNTRY_CSO_PROFILES,
        AgencyPermission.RUN_REPORT_CSO_PROFILE,
        AgencyPermission.RUN_REPORT_CSO_MAPPING,
        AgencyPermission.RUN_REPORT_CSO_CONTACT,
        AgencyPermission.RUN_REPORT_CFEI_MANAGEMENT,
        AgencyPermission.RUN_REPORT_VERIFICATION_AND_FLAGGING,
        AgencyPermission.ERP_ENTER_VENDOR_NUMBER,
    ]),
    AgencyRole.MFT_USER: frozenset([
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
        AgencyPermission.CFEI_VIEW,
        AgencyPermission.CFEI_FINALIZED_VIEW_WINNER_AND_CN,
        AgencyPermission.CFEI_PRESELECT_APPLICATIONS,
        AgencyPermission.CFEI_VIEW_ALL_REVIEWS,
        AgencyPermission.CFEI_ADD_REVIEW_SUMMARY,
        AgencyPermission.CFEI_VIEW_APPLICATIONS,
        AgencyPermission.CFEI_PRESELECT_APPLICATIONS,
        AgencyPermission.CFEI_REVIEW_APPLICATIONS,
        AgencyPermission.CFEI_SELECT_RECOMMENDED_PARTNER,
        AgencyPermission.CFEI_DESELECT_PARTNER,
        AgencyPermission.CFEI_FINALIZE,
        AgencyPermission.CFEI_FINALIZED_VIEW_ALL_REVIEWS,
        AgencyPermission.CFEI_FINALIZED_VIEW_ALL_INFO,
        AgencyPermission.CFEI_PUBLISHED_VIEW_AND_ANSWER_CLARIFICATION_QUESTIONS,

        AgencyPermission.CFEI_DIRECT_EDIT_SENT,
        AgencyPermission.CFEI_DIRECT_PUBLISH,
        AgencyPermission.CFEI_DIRECT_EDIT_PUBLISHED,
        AgencyPermission.CFEI_DIRECT_CANCEL,

        AgencyPermission.REVIEW_AND_MARK_SANCTIONS_MATCHES,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_FLAG_COUNT,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_FLAG_COMMENTS,
        AgencyPermission.VERIFY_SEE_COMMENTS,
        AgencyPermission.ADD_FLAG_OBSERVATION_COUNTRY_CSO_PROFILES,
        AgencyPermission.RUN_REPORT_CSO_PROFILE,
        AgencyPermission.RUN_REPORT_CSO_MAPPING,
        AgencyPermission.RUN_REPORT_CSO_CONTACT,
        AgencyPermission.RUN_REPORT_CFEI_MANAGEMENT,
        AgencyPermission.RUN_REPORT_VERIFICATION_AND_FLAGGING,
    ]),
    AgencyRole.PAM_USER: frozenset([
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
        AgencyPermission.CFEI_VIEW,
        AgencyPermission.CFEI_FINALIZED_VIEW_WINNER_AND_CN,
        AgencyPermission.CFEI_DRAFT_CREATE,
        AgencyPermission.CFEI_DRAFT_MANAGE,
        AgencyPermission.CFEI_DRAFT_SEND_TO_FOCAL_POINT_TO_PUBLISH,
        AgencyPermission.CFEI_VIEW_ALL_REVIEWS,
        AgencyPermission.CFEI_ADD_REVIEW_SUMMARY,
        AgencyPermission.CFEI_PUBLISHED_VIEW_AND_ANSWER_CLARIFICATION_QUESTIONS,
        AgencyPermission.CFEI_PUBLISHED_EDIT_DATES,
        AgencyPermission.CFEI_PUBLISHED_INVITE_CSO,
        AgencyPermission.CFEI_PUBLISHED_CANCEL,
        AgencyPermission.CFEI_PUBLISH,
        AgencyPermission.CFEI_MANAGE_REVIEWERS,
        AgencyPermission.CFEI_VIEW_APPLICATIONS,
        AgencyPermission.CFEI_DIRECT_EDIT_SENT,
        AgencyPermission.CFEI_PRESELECT_APPLICATIONS,
        AgencyPermission.CFEI_REVIEW_APPLICATIONS,
        AgencyPermission.CFEI_RECOMMEND_PARTNER_FOR_SELECTION,
        AgencyPermission.CFEI_FINALIZE,
        AgencyPermission.CFEI_FINALIZED_VIEW_ALL_REVIEWS,

        AgencyPermission.CFEI_DIRECT_CREATE_DRAFT_MANAGE_FOCAL_POINTS,
        AgencyPermission.CFEI_DIRECT_INDICATE_CSO,
        AgencyPermission.CFEI_DIRECT_SAVE_DRAFT,
        AgencyPermission.CFEI_DIRECT_EDIT_DRAFT,
        AgencyPermission.CFEI_DIRECT_DELETE_DRAFT,
        AgencyPermission.CFEI_DIRECT_SEND_DRAFT_TO_FOCAL_POINT,
        AgencyPermission.CFEI_DIRECT_EDIT_PUBLISHED,
        AgencyPermission.CFEI_DIRECT_CANCEL,

        AgencyPermission.UCN_CONVERT_TO_DSR,

        AgencyPermission.REVIEW_AND_MARK_SANCTIONS_MATCHES,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_FLAG_COUNT,
        AgencyPermission.RUN_REPORT_CSO_PROFILE,
        AgencyPermission.RUN_REPORT_CSO_MAPPING,
        AgencyPermission.RUN_REPORT_CSO_CONTACT,
        AgencyPermission.RUN_REPORT_CFEI_MANAGEMENT,
    ]),
}

VALID_FOCAL_POINT_ROLE_NAMES = frozenset([
    AgencyRole.EDITOR_ADVANCED.name,
    AgencyRole.MFT_USER.name,
])


VALID_REVIEWER_ROLE_NAMES = frozenset([
    role.name for role, permissions in AGENCY_ROLE_PERMISSIONS.items() if
    AgencyPermission.CFEI_REVIEW_APPLICATIONS in permissions
])


ESCALATED_FLAG_RESOLVER_ROLE_NAMES = frozenset([
    role.name for role, permissions in AGENCY_ROLE_PERMISSIONS.items() if
    AgencyPermission.RESOLVE_ESCALATED_FLAG_ALL_CSO_PROFILES in permissions
])

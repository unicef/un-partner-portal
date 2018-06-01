from enum import unique, auto

from agency.permissions import AgencyPermission
from common.authentication_utilities import AutoNameEnum


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
        if agency and agency.name == 'UNHCR':
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
        AgencyPermission.VIEW_PROFILE_OBSERVATION_COUNT,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_COMMENTS,
        AgencyPermission.VIEW_PROFILE_FLAG_COUNT,
        AgencyPermission.VIEW_PROFILE_FLAG_COMMENTS,
        AgencyPermission.ADD_FLAG_OBSERVATION_ALL_CSO_PROFILES,
    ]),
    AgencyRole.ADMINISTRATOR: frozenset([
        AgencyPermission.RESET_CSO_USER_PASSWORD,
        AgencyPermission.MANAGE_USERS,
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
        AgencyPermission.CFEI_VIEW,
        AgencyPermission.CFEI_FINALIZED_VIEW_WINNER_AND_CN,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_COUNT,
        AgencyPermission.VIEW_PROFILE_FLAG_COUNT,
    ]),
    AgencyRole.READER: frozenset([
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
        AgencyPermission.CFEI_VIEW,
        AgencyPermission.CFEI_FINALIZED_VIEW_WINNER_AND_CN,
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

        AgencyPermission.REVIEW_AND_MARK_SANCTIONS_MATCHES,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_COUNT,
        AgencyPermission.VIEW_PROFILE_FLAG_COUNT,
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

        AgencyPermission.REVIEW_AND_MARK_SANCTIONS_MATCHES,

        AgencyPermission.VERIFY_CSOS_FOR_OWN_COUNTRY,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_COUNT,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_COMMENTS,
        AgencyPermission.VIEW_PROFILE_FLAG_COUNT,
        AgencyPermission.VIEW_PROFILE_FLAG_COMMENTS,
        AgencyPermission.ADD_FLAG_OBSERVATION_COUNTRY_CSO_PROFILES,
    ]),
    AgencyRole.MFT_USER: frozenset([
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
        AgencyPermission.CFEI_VIEW,
        AgencyPermission.CFEI_FINALIZED_VIEW_WINNER_AND_CN,
        AgencyPermission.CFEI_PUBLISH,
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

        AgencyPermission.CFEI_DIRECT_EDIT_SENT,
        AgencyPermission.CFEI_DIRECT_PUBLISH,
        AgencyPermission.CFEI_DIRECT_EDIT_PUBLISHED,
        AgencyPermission.CFEI_DIRECT_CANCEL,

        AgencyPermission.REVIEW_AND_MARK_SANCTIONS_MATCHES,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_COUNT,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_COMMENTS,
        AgencyPermission.VIEW_PROFILE_FLAG_COUNT,
        AgencyPermission.VIEW_PROFILE_FLAG_COMMENTS,
        AgencyPermission.ADD_FLAG_OBSERVATION_COUNTRY_CSO_PROFILES,
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

        AgencyPermission.REVIEW_AND_MARK_SANCTIONS_MATCHES,
        AgencyPermission.VIEW_PROFILE_OBSERVATION_COUNT,
        AgencyPermission.VIEW_PROFILE_FLAG_COUNT,
    ]),
}

VALID_FOCAL_POINT_ROLE_NAMES = frozenset([
    AgencyRole.EDITOR_ADVANCED.name,
    AgencyRole.MFT_USER.name,
])

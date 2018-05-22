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
    def get_choices(cls):
        return [(role.name, ROLE_LABELS[role]) for role in cls]


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
        AgencyPermission.MANAGE_OWN_AGENCY_USERS,
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_VIEW,
        AgencyPermission.CSO_PROFILE_VIEW,
        AgencyPermission.CFEI_VIEW_LIST,
        AgencyPermission.CFEI_VIEW_FINALIZED_RESULTS,
    ]),
    AgencyRole.ADMINISTRATOR: frozenset([
        AgencyPermission.RESET_CSO_USER_PASSWORD,
        AgencyPermission.MANAGE_OWN_AGENCY_USERS,
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_VIEW,
        AgencyPermission.CSO_PROFILE_VIEW,
        AgencyPermission.CFEI_VIEW_LIST,
        AgencyPermission.CFEI_VIEW_FINALIZED_RESULTS,
    ]),
    AgencyRole.READER: frozenset([
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.CSO_LIST_VIEW,
        AgencyPermission.CSO_PROFILE_VIEW,
        AgencyPermission.CFEI_VIEW_LIST,
        AgencyPermission.CFEI_VIEW_FINALIZED_RESULTS,
    ]),
    AgencyRole.EDITOR_BASIC: frozenset([
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_VIEW,
        AgencyPermission.CSO_PROFILE_VIEW,
        AgencyPermission.CFEI_VIEW_LIST,
        AgencyPermission.CFEI_VIEW_FINALIZED_RESULTS,
        AgencyPermission.CFEI_DRAFT_CREATE,
        AgencyPermission.CFEI_DRAFT_MANAGE,
        AgencyPermission.CFEI_DRAFT_MANAGE_FOCAL_POINT,
        AgencyPermission.CFEI_DRAFT_INVITE_CSO,
        AgencyPermission.CFEI_DRAFT_SEND_TO_FOCAL_POINT_TO_PUBLISH,
    ]),
    AgencyRole.EDITOR_ADVANCED: frozenset([
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_VIEW,
        AgencyPermission.CSO_PROFILE_VIEW,
        AgencyPermission.CFEI_VIEW_LIST,
        AgencyPermission.CFEI_VIEW_FINALIZED_RESULTS,
        AgencyPermission.CFEI_DRAFT_CREATE,
        AgencyPermission.CFEI_DRAFT_MANAGE,
        AgencyPermission.CFEI_DRAFT_MANAGE_FOCAL_POINT,
        AgencyPermission.CFEI_DRAFT_INVITE_CSO,
        AgencyPermission.CFEI_DIRECT_INDICATE_CSO,
        AgencyPermission.CFEI_PUBLISH,
    ]),
    AgencyRole.PAM_USER: frozenset([
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_VIEW,
        AgencyPermission.CSO_PROFILE_VIEW,
        AgencyPermission.CFEI_VIEW_LIST,
        AgencyPermission.CFEI_VIEW_FINALIZED_RESULTS,
        AgencyPermission.CFEI_DRAFT_CREATE,
        AgencyPermission.CFEI_DRAFT_MANAGE,
        AgencyPermission.CFEI_DRAFT_MANAGE_FOCAL_POINT,
        AgencyPermission.CFEI_DRAFT_INVITE_CSO,
        AgencyPermission.CFEI_DRAFT_SEND_TO_FOCAL_POINT_TO_PUBLISH,
    ]),
    AgencyRole.MFT_USER: frozenset([
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_VIEW,
        AgencyPermission.CSO_PROFILE_VIEW,
        AgencyPermission.CFEI_VIEW_LIST,
        AgencyPermission.CFEI_VIEW_FINALIZED_RESULTS,
        AgencyPermission.CFEI_PUBLISH,
    ]),
}

VALID_FOCAL_POINT_ROLE_NAMES = frozenset([
    AgencyRole.EDITOR_ADVANCED.name,
    AgencyRole.MFT_USER.name,
])

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
    EDITOR_BASIC_PAM = auto()
    EDITOR_ADVANCED_MFT = auto()

    @classmethod
    def get_choices(cls):
        return [(role.name, ROLE_LABELS[role]) for role in cls]


ROLE_LABELS = {
    AgencyRole.ADMINISTRATOR: 'Administrator',
    AgencyRole.HQ_EDITOR: 'HQ Editor',
    AgencyRole.READER: 'Reader',
    AgencyRole.EDITOR_BASIC: 'Basic Editor',
    AgencyRole.EDITOR_ADVANCED: 'Advanced Editor',
    AgencyRole.EDITOR_BASIC_PAM: 'Basic Editor (PAM USER)',
    AgencyRole.EDITOR_ADVANCED_MFT: 'Advanced Editor (MFT USER)',
}


AGENCY_ROLE_PERMISSIONS = {
    AgencyRole.HQ_EDITOR: frozenset([
        AgencyPermission.RESET_CSO_USER_PASSWORD,
        AgencyPermission.MY_AGENCY_LIST_USERS,
        AgencyPermission.MY_AGENCY_ADD_USER,
        AgencyPermission.MY_AGENCY_DEACTIVATE_USER,
        AgencyPermission.MY_AGENCY_RELOCATE_USER,
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_VIEW,
        AgencyPermission.CSO_PROFILE_VIEW,
        AgencyPermission.CFEI_VIEW_LIST,
        AgencyPermission.CFEI_VIEW_FINALIZED_RESULTS,
    ]),
    AgencyRole.ADMINISTRATOR: frozenset([
        AgencyPermission.RESET_CSO_USER_PASSWORD,
        AgencyPermission.MY_AGENCY_LIST_USERS,
        AgencyPermission.MY_AGENCY_ADD_USER,
        AgencyPermission.MY_AGENCY_DEACTIVATE_USER,
        AgencyPermission.MY_AGENCY_RELOCATE_USER,
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
    ]),
    AgencyRole.EDITOR_BASIC_PAM: frozenset([
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
    AgencyRole.EDITOR_ADVANCED_MFT: frozenset([
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_VIEW,
        AgencyPermission.CSO_PROFILE_VIEW,
        AgencyPermission.CFEI_VIEW_LIST,
        AgencyPermission.CFEI_VIEW_FINALIZED_RESULTS,
    ]),
}

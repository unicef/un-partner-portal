from enum import unique, auto

from agency.permissions import AgencyPermission
from common.authentication_utilities import AutoNameEnum


@unique
class AgencyRole(AutoNameEnum):
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


ROLE_PERMISSIONS = {
    AgencyRole.HQ_EDITOR: {
        AgencyPermission.RESET_CSO_USER_PASSWORD,
        AgencyPermission.OWN_AGENCY_ADD_USER,
        AgencyPermission.OWN_AGENCY_DEACTIVATE_USER,
        AgencyPermission.OWN_AGENCY_RELOCATE_USER,
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_VIEW,
        AgencyPermission.CSO_PROFILE_VIEW,
        AgencyPermission.CFEI_VIEW_LIST,
        AgencyPermission.CFEI_VIEW_FINALIZED_RESULTS,
    },
    AgencyRole.ADMINISTRATOR: {
        AgencyPermission.RESET_CSO_USER_PASSWORD,
        AgencyPermission.OWN_AGENCY_ADD_USER,
        AgencyPermission.OWN_AGENCY_DEACTIVATE_USER,
        AgencyPermission.OWN_AGENCY_RELOCATE_USER,
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_VIEW,
        AgencyPermission.CSO_PROFILE_VIEW,
        AgencyPermission.CFEI_VIEW_LIST,
        AgencyPermission.CFEI_VIEW_FINALIZED_RESULTS,
    },
    AgencyRole.READER: {
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.CSO_LIST_VIEW,
        AgencyPermission.CSO_PROFILE_VIEW,
        AgencyPermission.CFEI_VIEW_LIST,
        AgencyPermission.CFEI_VIEW_FINALIZED_RESULTS,
    },
    AgencyRole.EDITOR_BASIC: {
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
    },
    AgencyRole.EDITOR_ADVANCED: {
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
    },
    AgencyRole.EDITOR_BASIC_PAM: {
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
    },
    AgencyRole.EDITOR_ADVANCED_MFT: {
        AgencyPermission.VIEW_DASHBOARD,
        AgencyPermission.RECEIVE_NOTIFICATIONS,
        AgencyPermission.CSO_LIST_VIEW,
        AgencyPermission.CSO_PROFILE_VIEW,
        AgencyPermission.CFEI_VIEW_LIST,
        AgencyPermission.CFEI_VIEW_FINALIZED_RESULTS,
    },
}

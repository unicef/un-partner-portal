from enum import unique, auto

from partner.permissions import PartnerPermission
from common.authentication_utilities import AutoNameEnum


@unique
class PartnerRole(AutoNameEnum):
    """
    Editing names here WILL break roles saved in DB
    """
    ADMIN = auto()
    EDITOR = auto()
    READER = auto()

    @classmethod
    def get_choices(cls):
        return [(role.name, ROLE_LABELS[role]) for role in cls]


ROLE_LABELS = {
    PartnerRole.ADMIN: 'Administrator',
    PartnerRole.EDITOR: 'Editor',
    PartnerRole.READER: 'Reader',
}


# HQ Roles have different permission scopes than ordinary roles
PARTNER_ROLE_PERMISSIONS = {
    True: {  # INGO HQ
        PartnerRole.ADMIN: frozenset([
            PartnerPermission.REGISTER,
            PartnerPermission.CFEI_VIEW,
            PartnerPermission.VIEW_DASHBOARD,
            PartnerPermission.MANAGE_USERS,
            PartnerPermission.CFEI_PINNING,
            PartnerPermission.CFEI_ANSWER_SELECTION,
            PartnerPermission.UCN_VIEW,
            PartnerPermission.UCN_DRAFT,
            PartnerPermission.UCN_EDIT,
            PartnerPermission.UCN_SUBMIT,
            PartnerPermission.UCN_DELETE,
        ]),
        PartnerRole.EDITOR: frozenset([
            PartnerPermission.CFEI_VIEW,
            PartnerPermission.VIEW_DASHBOARD,
            PartnerPermission.CFEI_PINNING,
            PartnerPermission.CFEI_ANSWER_SELECTION,
            PartnerPermission.UCN_VIEW,
            PartnerPermission.UCN_DRAFT,
            PartnerPermission.UCN_EDIT,
            PartnerPermission.UCN_SUBMIT,
            PartnerPermission.UCN_DELETE,
        ]),
        PartnerRole.READER: frozenset([
            PartnerPermission.VIEW_DASHBOARD,
            PartnerPermission.CFEI_VIEW,
            PartnerPermission.UCN_VIEW,
        ]),
    },
    False: {  # INGO Country Profile
        PartnerRole.ADMIN: frozenset([
            PartnerPermission.VIEW_DASHBOARD,
            PartnerPermission.CFEI_VIEW,
            PartnerPermission.MANAGE_USERS,
            PartnerPermission.CFEI_PINNING,
            PartnerPermission.CFEI_ANSWER_SELECTION,
            PartnerPermission.UCN_VIEW,
            PartnerPermission.UCN_DRAFT,
            PartnerPermission.UCN_EDIT,
            PartnerPermission.UCN_SUBMIT,
            PartnerPermission.UCN_DELETE,
        ]),
        PartnerRole.EDITOR: frozenset([
            PartnerPermission.VIEW_DASHBOARD,
            PartnerPermission.CFEI_VIEW,
            PartnerPermission.CFEI_PINNING,
            PartnerPermission.CFEI_ANSWER_SELECTION,
            PartnerPermission.UCN_VIEW,
            PartnerPermission.UCN_DRAFT,
            PartnerPermission.UCN_EDIT,
            PartnerPermission.UCN_SUBMIT,
            PartnerPermission.UCN_DELETE,
        ]),
        PartnerRole.READER: frozenset([
            PartnerPermission.VIEW_DASHBOARD,
            PartnerPermission.CFEI_VIEW,
            PartnerPermission.UCN_VIEW,
        ]),
    },
    None: {  # NGO
        PartnerRole.ADMIN: frozenset([
            PartnerPermission.REGISTER,
            PartnerPermission.VIEW_DASHBOARD,
            PartnerPermission.MANAGE_USERS,
            PartnerPermission.CFEI_VIEW,
            PartnerPermission.CFEI_PINNING,
            PartnerPermission.CFEI_ANSWER_SELECTION,
            PartnerPermission.UCN_VIEW,
            PartnerPermission.UCN_DRAFT,
            PartnerPermission.UCN_EDIT,
            PartnerPermission.UCN_SUBMIT,
            PartnerPermission.UCN_DELETE,
        ]),
        PartnerRole.EDITOR: frozenset([
            PartnerPermission.VIEW_DASHBOARD,
            PartnerPermission.CFEI_VIEW,
            PartnerPermission.CFEI_PINNING,
            PartnerPermission.CFEI_ANSWER_SELECTION,
            PartnerPermission.UCN_VIEW,
            PartnerPermission.UCN_DRAFT,
            PartnerPermission.UCN_EDIT,
            PartnerPermission.UCN_SUBMIT,
            PartnerPermission.UCN_DELETE,
        ]),
        PartnerRole.READER: frozenset([
            PartnerPermission.VIEW_DASHBOARD,
            PartnerPermission.CFEI_VIEW,
            PartnerPermission.UCN_VIEW,
        ]),
    }
}

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


# HQ Roels have different permission scopes than ordinary roles
PARTNER_ROLE_PERMISSIONS = {
    True: {  # HQ
        PartnerRole.ADMIN: frozenset([
            PartnerPermission.REGISTER,
            PartnerPermission.VIEW_INGO_DASHBOARD,
            PartnerPermission.VIEW_DASHBOARD,
        ]),
        PartnerRole.EDITOR: frozenset([
            PartnerPermission.VIEW_INGO_DASHBOARD,
            PartnerPermission.VIEW_DASHBOARD,
        ]),
        PartnerRole.READER: frozenset([
            PartnerPermission.VIEW_DASHBOARD,
        ]),
    },
    False: {
        PartnerRole.ADMIN: frozenset([
            PartnerPermission.VIEW_DASHBOARD,
        ]),
        PartnerRole.EDITOR: frozenset([
            PartnerPermission.VIEW_DASHBOARD,
        ]),
        PartnerRole.READER: frozenset([
            PartnerPermission.VIEW_DASHBOARD,
        ]),
    }
}

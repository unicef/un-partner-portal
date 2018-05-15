from enum import unique, auto

from partner.permissions import PartnerPermission
from common.authentication_utilities import AutoNameEnum


@unique
class PartnerRole(AutoNameEnum):
    """
    Editing names here WILL break roles saved in DB
    """
    # HQ
    HQ_ADMIN = auto()
    HQ_EDITOR = auto()
    HQ_READER = auto()

    # Country profile
    ADMIN = auto()
    EDITOR = auto()
    READER = auto()

    @classmethod
    def get_choices(cls):
        return [(role.name, ROLE_LABELS[role]) for role in cls]


ROLE_LABELS = {
    PartnerRole.HQ_ADMIN: 'HQ Administrator',
    PartnerRole.HQ_EDITOR: 'HQ Editor',
    PartnerRole.HQ_READER: 'HQ Reader',
    PartnerRole.ADMIN: 'Administrator',
    PartnerRole.EDITOR: 'Editor',
    PartnerRole.READER: 'Reader',
}


PARTNER_ROLE_PERMISSIONS = {
    PartnerRole.HQ_ADMIN: frozenset([
        PartnerPermission.REGISTER,
        PartnerPermission.VIEW_INGO_DASHBOARD,
        PartnerPermission.VIEW_DASHBOARD,
    ]),
    PartnerRole.HQ_EDITOR: frozenset([
        PartnerPermission.VIEW_INGO_DASHBOARD,
        PartnerPermission.VIEW_DASHBOARD,
    ]),
    PartnerRole.HQ_READER: frozenset([
        PartnerPermission.VIEW_DASHBOARD,
    ]),
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

from enum import unique, auto

from common.authentication_utilities import AutoNameEnum


@unique
class PartnerPermission(AutoNameEnum):

    # Registration & General
    REGISTER = auto()
    VIEW_DASHBOARD = auto()
    VIEW_INGO_DASHBOARD = auto()

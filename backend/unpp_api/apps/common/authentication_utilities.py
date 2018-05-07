from enum import Enum


class AutoNameEnum(Enum):

    def _generate_next_value_(name, *args):
        return name

from __future__ import absolute_import
from .base import *  # noqa: ignore=F403


# dev overrides
DEBUG = False
IS_STAGING = True

extend_list_avoid_repeats(INSTALLED_APPS, [
    'rest_framework_swagger',
])

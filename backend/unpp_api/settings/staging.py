from __future__ import absolute_import
from .base import *  # noqa: ignore=F403


# dev overrides
DEBUG = False
IS_STAGING = True

MEDIA_ROOT = os.path.join(BASE_DIR, '%s' % UPLOADS_DIR_NAME)
STATIC_ROOT = '%s/staticserve' % BASE_DIR

COMPRESS_ENABLED = True
COMPRESS_OFFLINE = True

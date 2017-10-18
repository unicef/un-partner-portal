import os

from logging.handlers import RotatingFileHandler

from .serializers import CountryPointSerializer


class DeferredRotatingFileHandler(RotatingFileHandler):
    """
    RotatingFileHandler but with deferred loading of logs file
    so the correct logs path is taken based on chosen ENV settings.

    Based on http://codeinthehole.com/writing/a-deferred-logging-file-handler-for-django/
    """

    def __init__(self, filename, *args, **kwargs):
        self.filename = filename
        kwargs['delay'] = True
        RotatingFileHandler.__init__(self, "/dev/null", *args, **kwargs)

    def _open(self):
        # We import settings here to avoid a circular reference as this module
        # will be imported when settings.py is executed.
        from django.conf import settings

        # NOTE Be sure that settings.LOGS_PATH exist before running Django app.
        self.baseFilename = os.path.join(settings.LOGS_PATH, self.filename)
        return RotatingFileHandler._open(self)


def get_countries_code_from_locations(locations):
    return map(lambda x: x.get("country_code"), CountryPointSerializer(locations, many=True).data)

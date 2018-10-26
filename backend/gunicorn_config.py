import os

ENV = os.getenv('ENV')
IS_DEV = ENV == 'dev'
STDERR_DESTINATION = '-'

reload = IS_DEV
errorlog = '/data/unpp_api/logs/gunicorn_error.log' if IS_DEV else STDERR_DESTINATION
accesslog = '/data/unpp_api/logs/gunicorn_access.log' if IS_DEV else STDERR_DESTINATION
capture_output = IS_DEV
preload = True
bind = ':8000'
loglevel = 'debug' if IS_DEV else 'info'
capture_output = IS_DEV
workers = 1
syslog = True
disable_redirect_access_to_syslog = IS_DEV

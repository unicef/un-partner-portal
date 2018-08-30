import os

ENV = os.getenv('ENV')
IS_DEV = ENV == 'dev'

reload = IS_DEV
errorlog = '/data/unpp_api/logs/gunicorn.log'
capture_output = IS_DEV
preload = True
bind = ':8000'
loglevel = 'debug' if IS_DEV else 'info'
capture_output = IS_DEV
workers = 4
syslog = True
disable_redirect_access_to_syslog = True

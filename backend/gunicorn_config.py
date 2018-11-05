import os

ENV = os.getenv('ENV')
IS_DEV = ENV == 'dev'
STDOUT_DESTINATION = '-'

reload = IS_DEV
errorlog = STDOUT_DESTINATION
accesslog = STDOUT_DESTINATION
capture_output = IS_DEV
preload = True
bind = ':8000'
loglevel = 'debug' if IS_DEV else 'info'
workers = 1
threads = 4
syslog = True
disable_redirect_access_to_syslog = IS_DEV

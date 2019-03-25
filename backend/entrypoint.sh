#!/usr/bin/env bash
/usr/local/bin/wait-for-it.sh db:5432 -t 30 && python /code/manage.py collectstatic --noinput && python /code/manage.py migrate --noinput && python /code/manage.py sanctions_list_sync --initial && gunicorn unpp_api.wsgi -c /code/gunicorn_config.py

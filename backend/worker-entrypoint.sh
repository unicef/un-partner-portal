#!/usr/bin/env bash
echo "It's recommended to setup k8s cronjobs or platform equivalent, this script is included as a workaround."
pip install python-crontab==2.3.5
python setup_crons.py && tail -f /dev/null

from crontab import CronTab

# CHEATSHEET
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday;
# │ │ │ │ │                                   7 is also Sunday on some systems)
# │ │ │ │ │
# │ │ │ │ │
# * * * * * command to execute


DAILY_MIDNIGHT = '* 0 * * *'
DAILY_NOON = '* 12 * * *'
WEEKLY = '* 12 * * 1'

MANAGE_PY_CRON_JOBS = [
    (DAILY_NOON, 'send_daily_notifications'),
    (DAILY_NOON, 'send_clarification_deadline_passed_notifications'),
    (WEEKLY, 'send_weekly_notifications'),
    (WEEKLY, 'sanction_sync_and_rescan'),
    (WEEKLY, 'clean_commonfile_orphans'),
    ('00 12 28-31 * *', 'sync_unicef_erp_data'),
]


if __name__ == '__main__':
    cron = CronTab(user=True)

    for frequency, command_name in MANAGE_PY_CRON_JOBS:
        job = next(cron.find_comment(command_name), None) or cron.new(
            f'python /code/manage.py {command_name}', comment=command_name
        )
        job.setall(frequency)

    cron.write()

from crontab import CronTab


DAILY_MIDNIGHT = '* 0 * * *'
DAILY_NOON = '* 12 * * *'
WEEKLY = '* 12 * * 1'


MANAGE_PY_CRON_JOBS = [
    (DAILY_NOON, 'send_daily_notifications'),
    (DAILY_NOON, 'send_clarification_deadline_passed_notifications'),
    (WEEKLY, 'send_weekly_notifications'),
    (WEEKLY, 'sanction_sync_and_rescan'),
]


if __name__ == '__main__':
    cron = CronTab(user=True)

    for frequency, command_name in MANAGE_PY_CRON_JOBS:
        job = next(cron.find_comment(command_name), None) or cron.new(
            f'python /code/manage.py {command_name}', comment=command_name
        )
        job.setall(frequency)

    cron.write()

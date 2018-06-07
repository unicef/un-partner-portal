from crontab import CronTab


if __name__ == '__main__':
    cron = CronTab(user=True)

    daily_notifications_job = next(cron.find_comment('send_daily_notifications'), None) or cron.new(
        f'python /code/manage.py send_daily_notifications', comment='send_daily_notifications'
    )
    daily_notifications_job.hour.on(12)

    weekly_notifications_job = next(cron.find_comment('send_weekly_notifications'), None) or cron.new(
        f'python /code/manage.py send_weekly_notifications', comment='send_weekly_notifications'
    )
    weekly_notifications_job.hour.on(12)
    weekly_notifications_job.dow.on(0)

    cron.write()

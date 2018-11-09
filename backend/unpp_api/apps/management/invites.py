from django.conf import settings
from mail_templated import send_mail


def send_partner_user_invite(invited_user, inviting_user):
    context = {
        'invited_user': invited_user,
        'inviting_user': inviting_user,
        'login_url': f'{settings.FRONTEND_HOST}/login',
    }

    send_mail('management/invite_user.tpl', context, settings.DEFAULT_FROM_EMAIL, [invited_user.email])


def send_agency_user_invite(invited_user, inviting_user):
    context = {
        'invited_user': invited_user,
        'inviting_user': inviting_user,
        'login_url': f'{settings.FRONTEND_HOST}/login',
    }

    send_mail('management/invite_user.tpl', context, settings.DEFAULT_FROM_EMAIL, [invited_user.email])

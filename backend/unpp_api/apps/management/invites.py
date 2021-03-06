from django.conf import settings
from mail_templated import send_mail


def send_partner_user_invite(invited_user, inviting_user, partner=None):
    context = {
        'invited_user': invited_user,
        'inviting_user': inviting_user,
        'partner': partner,
        'login_url': f'{settings.FRONTEND_HOST}/login',
    }

    send_mail(
        'management/invite_partner_user.tpl',
        context,
        settings.DEFAULT_FROM_EMAIL,
        [invited_user.email],
        fail_silently=True,
    )


def send_agency_user_invite(invited_user, inviting_user):
    context = {
        'invited_user': invited_user,
        'inviting_user': inviting_user,
        'login_url': f'{settings.FRONTEND_HOST}/login',
    }

    send_mail(
        'management/invite_agency_user.tpl',
        context,
        settings.DEFAULT_FROM_EMAIL,
        [invited_user.email],
        fail_silently=True,
    )

from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from mail_templated import send_mail


def send_partner_user_invite(invited_user, inviting_user):
    token = default_token_generator.make_token(invited_user)

    context = {
        'invited_user': invited_user,
        'inviting_user': inviting_user,
        'token': token
    }

    send_mail('management/invite_user.tpl', context, settings.DEFAULT_FROM_EMAIL, [invited_user.email])


def send_agency_user_invite(invited_user, inviting_user):
    context = {
        'invited_user': invited_user,
        'inviting_user': inviting_user,
    }

    send_mail('management/invite_user.tpl', context, settings.DEFAULT_FROM_EMAIL, [invited_user.email])

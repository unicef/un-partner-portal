from django.utils.encoding import force_bytes
from django.conf import settings
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlquote
from mail_templated import send_mail


def send_partner_user_invite(invited_user, inviting_user):
    token = urlquote(default_token_generator.make_token(invited_user))
    uid = urlquote(urlsafe_base64_encode(force_bytes(invited_user.pk)))

    context = {
        'invited_user': invited_user,
        'inviting_user': inviting_user,
        'frontend_reset_url': f'{settings.FRONTEND_HOST}/set-password/{uid}/{token}',
    }

    send_mail('management/invite_user.tpl', context, settings.DEFAULT_FROM_EMAIL, [invited_user.email])


def send_agency_user_invite(invited_user, inviting_user):
    token = urlquote(default_token_generator.make_token(invited_user))
    uid = urlquote(urlsafe_base64_encode(force_bytes(invited_user.pk)))

    context = {
        'invited_user': invited_user,
        'inviting_user': inviting_user,
        'frontend_reset_url': f'{settings.FRONTEND_HOST}/set-password/{uid}/{token}',
    }

    send_mail('management/invite_user.tpl', context, settings.DEFAULT_FROM_EMAIL, [invited_user.email])

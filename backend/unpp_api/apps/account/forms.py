from django.conf import settings
from django.contrib.auth.forms import PasswordResetForm
from django.core.mail import EmailMultiAlternatives
from django.template import loader
from django.utils.html import strip_tags


class CustomPasswordResetForm(PasswordResetForm):

    def send_mail(self, a, b, context, from_email, to_email, html_email_template_name=None):
        subject = 'UNPP Password Reset'
        context = context or {}
        context['title'] = subject
        context['frontend_reset_url'] = f'{settings.FRONTEND_HOST}/password-reset/{context["uid"]}/{context["token"]}'

        html_body = loader.render_to_string('account/password_reset.html', context)
        body = strip_tags(html_body).strip()
        email_message = EmailMultiAlternatives(subject, body, from_email, [to_email])
        email_message.attach_alternative(html_body, 'text/html')
        email_message.send()

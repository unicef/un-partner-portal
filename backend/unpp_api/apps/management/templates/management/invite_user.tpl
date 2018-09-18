{% extends "mail_templated/base.tpl" %}

{% block subject %}
Hello {{ invited_user.fullname }}
{% endblock %}

{% block html %}
{{ inviting_user.fullname }} has invited you to start using UNICEF Partner Portal (UNPP).
<br/>
<br/>
Please visit URL {{ frontend_reset_url }}
{% endblock %}

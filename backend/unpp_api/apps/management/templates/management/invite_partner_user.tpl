{% extends "mail_templated/base.tpl" %}

{% block subject %}
Hello {{ invited_user.fullname }}
{% endblock %}

{% block html %}
{{ partner.legal_name|default:inviting_user.fullname }} has registered on the UN Partner Portal and invites you to access the account.
<br/>
<br/>
Please visit URL <a href="{{ login_url }}">{{ login_url }}</a> and register using this email address to continue.
{% endblock %}

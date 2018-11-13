{% extends "mail_templated/base.tpl" %}

{% block subject %}
Hello {{ invited_user.fullname }}
{% endblock %}

{% block html %}
Dear colleague, your user permissions on UN Partner Portal have been updated.
<br/>
<br/>
Please visit URL <a href="{{ login_url }}">{{ login_url }}</a> and register using this email address to continue.
{% endblock %}

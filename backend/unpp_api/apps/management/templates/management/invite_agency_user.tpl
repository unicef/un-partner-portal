{% extends "mail_templated/base.tpl" %}

{% block subject %}
Hello {{ invited_user.fullname }}
{% endblock %}

{% block html %}
Dear colleague, your user permissions on UN Partner Portal have been updated.
<br/>
<br/>
Please visit URL {{ login_url }} and register using this email address to continue.
{% endblock %}

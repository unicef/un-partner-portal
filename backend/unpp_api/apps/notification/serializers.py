# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import serializers

from notification.models import Notification, NotifiedUser
from notification.utilities import replace_urls_with_anchor_tags


class NotificationSerializer(serializers.ModelSerializer):
    html_description = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = '__all__'

    def get_html_description(self, notification: Notification):
        return replace_urls_with_anchor_tags(notification.description)


class NotifiedUserSerializer(serializers.ModelSerializer):

    notification = NotificationSerializer()

    class Meta:
        model = NotifiedUser
        fields = '__all__'
        read_only_fields = ('notification', 'recipient', )


class NotifiedSerializer(serializers.Serializer):
    mark_all_as_read = serializers.BooleanField()

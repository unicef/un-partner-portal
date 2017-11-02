# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework import serializers

from .models import Notification, NotifiedUser


class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = '__all__'


class NotifiedUserSerializer(serializers.ModelSerializer):

    notification = NotificationSerializer()

    class Meta:
        model = NotifiedUser
        fields = '__all__'
        read_only_fields = ('notification', 'recipient', )


class NotifiedSerializer(serializers.Serializer):
    mark_all_as_read = serializers.BooleanField()

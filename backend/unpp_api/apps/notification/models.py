# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

from model_utils.models import TimeStampedModel

from common.fields import FixedTextField
from notification.consts import NotificationType


class Notification(TimeStampedModel):
    name = models.CharField(max_length=255)
    description = models.TextField()
    source = FixedTextField(choices=NotificationType.get_choices())
    content_type = models.ForeignKey(ContentType, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return "Notification {}".format(self.name)


class NotifiedUser(TimeStampedModel):
    notification = models.ForeignKey(Notification, related_name="notified")
    did_read = models.BooleanField(default=False)
    recipient = models.ForeignKey("account.User", related_name="notified")

    class Meta:
        ordering = ['created']
        unique_together = (
            'notification', 'recipient'
        )

    def __str__(self):
        return "Notified User <{}>".format(self.id)

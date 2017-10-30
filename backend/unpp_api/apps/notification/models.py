# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from model_utils.models import TimeStampedModel


class Notification(TimeStampedModel):
    name = models.CharField(max_length=255)
    description = models.TextField()
    source = models.CharField(max_length=255)
    partner = models.ForeignKey("partner.Partner", related_name="notifications", null=True, blank=True)
    agency = models.ForeignKey("agency.Agency", related_name="notifications", null=True, blank=True)

    def __str__(self):
        return "Notification {}".format(self.name)


class NotifiedUser(TimeStampedModel):
    notification = models.ForeignKey(Notification, related_name="notified")
    did_read = models.BooleanField(default=False)
    recipient = models.ForeignKey("account.User", related_name="notified")

    def __str__(self):
        return "Notified User <{}>".format(self.id)

# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-05-30 11:31
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0052_auto_20180530_1032'),
    ]

    operations = [
        migrations.AddField(
            model_name='eoi',
            name='sent_for_publishing',
            field=models.BooleanField(default=False, help_text='Whether CFEI has been forwarded to focal point to be published'),
        ),
    ]
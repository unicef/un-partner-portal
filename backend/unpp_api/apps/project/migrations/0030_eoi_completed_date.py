# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-10-24 12:05
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0029_auto_20171017_0144'),
    ]

    operations = [
        migrations.AddField(
            model_name='eoi',
            name='completed_date',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]

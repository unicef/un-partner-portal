# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-06-05 11:12
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0053_eoi_sent_for_publishing'),
    ]

    operations = [
        migrations.AddField(
            model_name='eoi',
            name='published_timestamp',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]

# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-05-16 09:08
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0060_auto_20180515_0929'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='partnermember',
            name='status',
        ),
    ]
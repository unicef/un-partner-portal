# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-12-04 04:26
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('agency', '0005_auto_20171127_0139'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='agency',
            name='created',
        ),
        migrations.RemoveField(
            model_name='agency',
            name='modified',
        ),
    ]

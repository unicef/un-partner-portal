# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-08-03 11:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0061_auto_20180724_0902'),
    ]

    operations = [
        migrations.AddField(
            model_name='eoi',
            name='displayID',
            field=models.TextField(max_length=32, null=True, unique=True),
        ),
    ]

# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-11-13 10:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0087_auto_20181113_0947'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partnercollaborationevidence',
            name='organization_name',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]

# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-01-23 11:14
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0052_auto_20180123_1101'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partner',
            name='engagement_operate_desc',
            field=models.TextField(blank=True, null=True, verbose_name="Briefly describe the organization's engagement with the communities in which you operate"),
        ),
    ]

# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-01-22 13:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0007_auto_20171031_0715'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adminlevel1',
            name='name',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]

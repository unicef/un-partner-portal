# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-01-18 15:43
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0053_auto_20180115_0834'),
    ]

    operations = [
        migrations.AddField(
            model_name='partnerauditassessment',
            name='regular_capacity_assessments',
            field=models.NullBooleanField(),
        ),
    ]

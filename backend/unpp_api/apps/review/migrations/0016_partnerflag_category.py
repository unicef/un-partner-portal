# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-06-18 06:37
from __future__ import unicode_literals

import common.database_fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('review', '0015_auto_20180614_0734'),
    ]

    operations = [
        migrations.AddField(
            model_name='partnerflag',
            name='category',
            field=common.database_fields.FixedTextField(blank=True, choices=[('fraud_and_corruption', 'Fraud and corruption'), ('safeguards_violation', 'Violation of protection safeguards'), ('sex_abuse', 'Sexual exploitation and abuse'), ('terrorism_support', 'Terrorism support'), ('other', 'Other')], null=True),
        ),
    ]

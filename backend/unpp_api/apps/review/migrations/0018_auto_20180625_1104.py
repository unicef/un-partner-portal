# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-06-25 11:04
from __future__ import unicode_literals

import common.fields
import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('review', '0017_partnerflag_type_history'),
    ]

    operations = [
        migrations.AddField(
            model_name='partnerflag',
            name='invalidation_comment',
            field=models.TextField(blank=True, max_length=5120, null=True),
        ),
        migrations.AlterField(
            model_name='partnerflag',
            name='category',
            field=common.fields.FixedTextField(blank=True, choices=[('fraud_and_corruption', 'Fraud and corruption'), ('safeguards_violation', 'Violation of protection safeguards'), ('sex_abuse', 'Sexual exploitation and abuse'), ('terrorism_support', 'Terrorism support'), ('other', 'Other'), ('sanctions_match', 'Sanctions List Match')], null=True),
        ),
        migrations.AlterField(
            model_name='partnerflag',
            name='flag_type',
            field=models.CharField(choices=[('Obs', 'Observation'), ('Yel', 'Yellow Flag'), ('Esc', 'Escalated Flag'), ('Red', 'Red Flag')], default='Yel', max_length=3),
        ),
        migrations.AlterField(
            model_name='partnerflag',
            name='type_history',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('Obs', 'Observation'), ('Yel', 'Yellow Flag'), ('Esc', 'Escalated Flag'), ('Red', 'Red Flag')], default='Yel', max_length=3), default=list, size=None),
        ),
    ]

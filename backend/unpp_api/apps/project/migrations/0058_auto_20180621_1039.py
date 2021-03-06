# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-06-21 10:39
from __future__ import unicode_literals

import common.database_fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0057_application_published_timestamp'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eoi',
            name='completed_retention',
            field=common.database_fields.FixedTextField(blank=True, choices=[('R_1YR', 'one year'), ('R_2YR', 'second year'), ('R_3YR', 'a third year'), ('R_4YR', 'a fourth year')], null=True),
        ),
    ]

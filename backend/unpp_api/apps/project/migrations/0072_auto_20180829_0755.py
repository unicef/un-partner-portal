# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-08-29 07:55
from __future__ import unicode_literals

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0071_auto_20180810_0753'),
    ]

    operations = [
        migrations.AddField(
            model_name='eoi',
            name='preselected_partners',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), default=list, size=None),
        ),
        migrations.AlterField(
            model_name='application',
            name='did_withdraw',
            field=models.BooleanField(default=False, help_text='Only applicable if did_win is True.', verbose_name='Did agency withdrew offer?'),
        ),
        migrations.AlterField(
            model_name='application',
            name='withdraw_reason',
            field=models.TextField(blank=True, help_text='Reason why agency withdrew offer.', null=True),
        ),
    ]

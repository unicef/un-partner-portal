# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-09-19 07:51
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0021_auto_20170919_0704'),
    ]

    operations = [
        migrations.RenameField(
            model_name='eoi',
            old_name='closed_justification',
            new_name='justification',
        ),
        migrations.AddField(
            model_name='eoi',
            name='completed_reason',
            field=models.CharField(blank=True, choices=[('Par', 'Completed - Partners selected'), ('Can', 'Completed - Canceled'), ('NoC', 'Completed - No successful candidate')], max_length=3, null=True),
        ),
    ]

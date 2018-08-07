# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-08-06 13:22
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import project.models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0065_eoiattachment'),
    ]

    operations = [
        migrations.AddField(
            model_name='assessment',
            name='completed',
            field=models.BooleanField(default=False, help_text='Once assessment is completed it is no longer editable'),
        ),
        migrations.AlterField(
            model_name='assessment',
            name='scores',
            field=django.contrib.postgres.fields.jsonb.JSONField(default=project.models.get_default_scores),
        ),
    ]
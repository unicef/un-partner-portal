# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-06-13 10:20
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sanctionslist', '0002_auto_20180612_1142'),
        ('review', '0013_auto_20180612_1321'),
    ]

    operations = [
        migrations.AddField(
            model_name='partnerflag',
            name='sanctions_match',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='sanctionslist.SanctionedNameMatch'),
        ),
    ]

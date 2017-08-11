# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-11 04:28
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0008_auto_20170810_0818'),
    ]

    operations = [
        migrations.AddField(
            model_name='partnerprofile',
            name='legal_name_change',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='partner',
            name='display_type',
            field=models.CharField(choices=[('CBO', 'Community Based Organization (CBO) '), ('NGO', 'National NGO'), ('Int', 'International NGO (INGO)'), ('Aca', 'Academic Institution'), ('RCC', 'Red Cross/Red Crescent Movement')], max_length=3),
        ),
    ]

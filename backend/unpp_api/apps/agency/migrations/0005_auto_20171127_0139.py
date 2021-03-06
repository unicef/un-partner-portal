# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-11-27 01:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('agency', '0004_auto_20171011_0329'),
    ]

    operations = [
        migrations.AddField(
            model_name='agencymember',
            name='status',
            field=models.CharField(choices=[('Act', 'Active'), ('Dea', 'Deactivated'), ('Inv', 'Invited')], default='Inv', max_length=3),
        ),
        migrations.AddField(
            model_name='agencymember',
            name='telephone',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]

# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-10-03 01:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0021_auto_20171002_0600'),
    ]

    operations = [
        migrations.AddField(
            model_name='partnerprofile',
            name='have_authorised_officers',
            field=models.BooleanField(default=False, verbose_name='Does your organization have a authorised officers?'),
        ),
    ]

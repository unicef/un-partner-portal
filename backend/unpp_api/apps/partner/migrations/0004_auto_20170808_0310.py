# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-08 03:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0003_partnerprofile_registration_doc'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partner',
            name='registration_number',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]

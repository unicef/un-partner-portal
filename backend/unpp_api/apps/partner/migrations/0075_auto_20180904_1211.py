# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-09-04 12:11
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0074_auto_20180903_1302'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partnerregistrationdocument',
            name='expiry_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]

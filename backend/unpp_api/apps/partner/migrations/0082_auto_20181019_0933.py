# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-10-19 09:33
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0081_auto_20181009_1001'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partnercollaborationpartnership',
            name='partner_number',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='Please provide your Vendor/Partner Number (If applicable)'),
        ),
    ]

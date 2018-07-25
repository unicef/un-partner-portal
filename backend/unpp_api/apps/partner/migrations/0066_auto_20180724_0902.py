# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-07-24 09:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0065_auto_20180713_1213'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partner',
            name='display_type',
            field=models.CharField(choices=[('CBO', 'Community Based Organization (CBO)'), ('NGO', 'National NGO'), ('Int', 'International NGO (INGO)'), ('Aca', 'Academic Institution'), ('RCC', 'Red Cross/Red Crescent Movement')], max_length=3, verbose_name='Organization Type'),
        ),
    ]
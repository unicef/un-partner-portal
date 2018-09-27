# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-09-26 13:08
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0077_auto_20180911_0946'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partner',
            name='legal_name',
            field=models.TextField(max_length=255, validators=[django.core.validators.MinLengthValidator(1)]),
        ),
    ]
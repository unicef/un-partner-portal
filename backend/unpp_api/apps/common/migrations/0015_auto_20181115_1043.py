# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-11-15 10:43
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0014_auto_20180911_0946'),
    ]

    operations = [
        migrations.AlterField(
            model_name='commonfile',
            name='file_field',
            field=models.FileField(upload_to='', validators=[django.core.validators.FileExtensionValidator(('pdf', 'doc', 'docx', 'xls', 'xlsximg', 'png', 'jpg', 'jpeg', 'csv', 'zip'))]),
        ),
    ]

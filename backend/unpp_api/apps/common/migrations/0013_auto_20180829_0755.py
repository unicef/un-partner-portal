# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-08-29 07:55
from __future__ import unicode_literals

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0012_auto_20180724_0902'),
    ]

    operations = [
        migrations.AlterField(
            model_name='commonfile',
            name='file_field',
            field=models.FileField(upload_to='', validators=[django.core.validators.FileExtensionValidator(('pdf', 'doc', 'docx', 'xls', 'xlsximg', 'png', 'jpg', 'jpeg'))]),
        ),
    ]

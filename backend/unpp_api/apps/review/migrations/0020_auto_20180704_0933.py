# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-07-04 09:33
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('review', '0019_auto_20180629_1245'),
    ]

    operations = [
        migrations.RenameField(
            model_name='partnerflag',
            old_name='invalidation_comment',
            new_name='validation_comment',
        ),
    ]

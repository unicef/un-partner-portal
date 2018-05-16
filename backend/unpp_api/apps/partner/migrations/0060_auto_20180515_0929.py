# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-05-15 09:29
from __future__ import unicode_literals

import common.fields
from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('partner', '0059_auto_20180515_0904'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partnermember',
            name='role',
            field=common.fields.FixedTextField(choices=[('ADMIN', 'Administrator'), ('EDITOR', 'Editor'), ('READER', 'Reader')], default='READER'),
        ),
        migrations.AlterUniqueTogether(
            name='partnermember',
            unique_together=set([('user', 'partner')]),
        ),
    ]

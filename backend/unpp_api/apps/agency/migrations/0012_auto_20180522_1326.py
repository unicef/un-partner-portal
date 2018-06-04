# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-05-22 13:26
from __future__ import unicode_literals

import common.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('agency', '0011_auto_20180516_1227'),
    ]

    operations = [
        migrations.AlterField(
            model_name='agencymember',
            name='role',
            field=common.fields.FixedTextField(choices=[('HQ_EDITOR', 'HQ Editor'), ('ADMINISTRATOR', 'Administrator'), ('READER', 'Reader'), ('EDITOR_BASIC', 'Basic Editor'), ('EDITOR_ADVANCED', 'Advanced Editor'), ('PAM_USER', 'PAM USER'), ('MFT_USER', 'MFT USER')], default='READER'),
        ),
    ]
# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-07 06:02
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0002_auto_20170807_0340'),
    ]

    operations = [
        migrations.AddField(
            model_name='partnerprofile',
            name='registration_doc',
            field=models.FileField(null=True, upload_to=b''),
        ),
    ]

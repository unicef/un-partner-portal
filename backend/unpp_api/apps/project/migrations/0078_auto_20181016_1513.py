# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-10-16 15:13
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0077_auto_20180927_1141'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='application',
            options={'ordering': ('-id',)},
        ),
    ]

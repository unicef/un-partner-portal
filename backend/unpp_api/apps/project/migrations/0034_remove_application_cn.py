# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-10-26 07:53
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0033_auto_20171026_0738'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='application',
            name='cn',
        ),
    ]

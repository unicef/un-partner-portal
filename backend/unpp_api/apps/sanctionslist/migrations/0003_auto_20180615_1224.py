# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-06-15 12:24
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0063_auto_20180612_0625'),
        ('sanctionslist', '0002_auto_20180612_1142'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='sanctionednamematch',
            unique_together=set([('name', 'partner')]),
        ),
    ]

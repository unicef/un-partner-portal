# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-09-06 01:27
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0002_auto_20170825_0143'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='adminlevel1',
            name='created',
        ),
        migrations.RemoveField(
            model_name='adminlevel1',
            name='modified',
        ),
        migrations.RemoveField(
            model_name='point',
            name='created',
        ),
        migrations.RemoveField(
            model_name='point',
            name='modified',
        ),
        migrations.RemoveField(
            model_name='sector',
            name='created',
        ),
        migrations.RemoveField(
            model_name='sector',
            name='modified',
        ),
        migrations.RemoveField(
            model_name='specialization',
            name='created',
        ),
        migrations.RemoveField(
            model_name='specialization',
            name='modified',
        ),
    ]

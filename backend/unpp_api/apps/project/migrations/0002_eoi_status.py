# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-07 04:56
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='eoi',
            name='status',
            field=models.CharField(choices=[('Ope', 'Open'), ('Clo', 'Closed')], default='Ope', max_length=3),
        ),
    ]

# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-10-05 12:13
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sanctionslist', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sanctioneditem',
            name='data_id',
            field=models.IntegerField(db_index=True, unique=True),
        ),
    ]

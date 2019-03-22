# -*- coding: utf-8 -*-
# Generated by Django 1.11.20 on 2019-03-21 08:58
from __future__ import unicode_literals

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0078_auto_20181016_1513'),
    ]

    operations = [
        migrations.AddField(
            model_name='eoi',
            name='population',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('Ref', 'Refugees'), ('Asy', 'Asylum seekers'), ('IDP', 'Internally displaced persons'), ('Sta', 'Stateless'), ('Ret', 'Returning'), ('Hos', 'Host Country')], max_length=3), default=list, null=True, size=None, verbose_name='Intended population(s) of concern.'),
        ),
    ]

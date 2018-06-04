# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-05-30 09:03
from __future__ import unicode_literals

import common.fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0050_auto_20180530_0857'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eoi',
            name='completed_reason',
            field=common.fields.FixedTextField(blank=True, choices=[('partners', 'Finalized - Partner accepted'), ('no_candidate', 'Finalized - No successful applicant'), ('accepted', 'Finalized - Partner accepted direct selection'), ('accepted_retention', 'Finalized - Partner accepted retention. Maintain decision for:'), ('cancelled', 'Finalized - Cancelled')], null=True),
        ),
    ]
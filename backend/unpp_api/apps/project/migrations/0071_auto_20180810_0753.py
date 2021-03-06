# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-08-10 07:53
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0070_auto_20180810_0729'),
    ]

    operations = [
        migrations.RenameField(
            model_name='application',
            old_name='decision_date',
            new_name='partner_decision_date',
        ),
        migrations.RenameField(
            model_name='application',
            old_name='decision_maker',
            new_name='partner_decision_maker',
        ),
        migrations.RenameField(
            model_name='application',
            old_name='win_date',
            new_name='agency_decision_date',
        ),
        migrations.RenameField(
            model_name='application',
            old_name='win_decision_maker',
            new_name='agency_decision_maker',
        ),
    ]

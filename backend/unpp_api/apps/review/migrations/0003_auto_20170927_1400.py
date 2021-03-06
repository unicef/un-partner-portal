# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-09-27 14:00
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('review', '0002_auto_20170927_1301'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partnerverification',
            name='cert_uploaded_comment',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='partnerverification',
            name='indicate_results_comment',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='partnerverification',
            name='mm_consistent_comment',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='partnerverification',
            name='rep_risk_comment',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='partnerverification',
            name='yellow_flag_comment',
            field=models.TextField(blank=True, null=True),
        ),
    ]

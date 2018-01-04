# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2018-01-03 11:02
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0047_merge_20171228_0641'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partnerauditreport',
            name='created_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='audit_reports', to=settings.AUTH_USER_MODEL),
        ),
    ]

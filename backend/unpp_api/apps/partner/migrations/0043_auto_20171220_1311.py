# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-12-20 13:11
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0042_auto_20171220_1305'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='partnerauditassessment',
            name='link_report',
        ),
        migrations.RemoveField(
            model_name='partnerauditassessment',
            name='most_recent_audit_report',
        ),
        migrations.RemoveField(
            model_name='partnerauditassessment',
            name='org_audits',
        ),
    ]
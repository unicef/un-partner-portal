# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-10-27 06:34
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0006_auto_20171013_0238'),
        ('notification', '0001_initial'),
        ('project', '0035_auto_20171026_0756'),
    ]

    operations = [
        migrations.AddField(
            model_name='application',
            name='accept_notification',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='accept_notification', to='notification.Notification'),
        ),
        migrations.AddField(
            model_name='application',
            name='did_accept_date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='eoi',
            name='review_summary_attachment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='review_summary_attachments', to='common.CommonFile'),
        ),
        migrations.AddField(
            model_name='eoi',
            name='review_summary_comment',
            field=models.TextField(blank=True, null=True),
        ),
    ]

# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-06-12 13:21
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('review', '0012_auto_20180612_0943'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partnerflag',
            name='comment',
            field=models.TextField(blank=True, max_length=5120, null=True),
        ),
        migrations.AlterField(
            model_name='partnerflag',
            name='submitter',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='given_flags', to=settings.AUTH_USER_MODEL),
        ),
    ]

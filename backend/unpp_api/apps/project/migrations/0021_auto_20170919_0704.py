# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-09-19 07:04
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('project', '0020_assessmentcriteria_goal'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='eoi',
            name='focal_point',
        ),
        migrations.AddField(
            model_name='eoi',
            name='focal_points',
            field=models.ManyToManyField(related_name='eoi_focal_points', to=settings.AUTH_USER_MODEL),
        ),
    ]

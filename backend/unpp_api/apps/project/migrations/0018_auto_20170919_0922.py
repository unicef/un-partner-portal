# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-09-19 09:22
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('project', '0017_auto_20170915_0734'),
    ]

    operations = [
        migrations.RenameField(
            model_name='eoi',
            old_name='closed_justification',
            new_name='justification',
        ),
        migrations.RemoveField(
            model_name='eoi',
            name='focal_point',
        ),
        migrations.AddField(
            model_name='assessmentcriteria',
            name='goal',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='Goal, Objective, Expected Outcome and Results.'),
        ),
        migrations.AddField(
            model_name='eoi',
            name='completed_reason',
            field=models.CharField(blank=True, choices=[('Par', 'Completed - Partners selected'), ('Can', 'Completed - Canceled'), ('NoC', 'Completed - No successful candidate')], max_length=3, null=True),
        ),
        migrations.AddField(
            model_name='eoi',
            name='focal_points',
            field=models.ManyToManyField(related_name='eoi_focal_points', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='eoi',
            name='goal',
            field=models.CharField(blank=True, max_length=200, null=True, verbose_name='Goal, Objective, Expected Outcome and Results.'),
        ),
    ]

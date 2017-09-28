# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-09-28 10:23
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('project', '0020_auto_20170928_0654'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='assessment',
            unique_together=set([('reviewer', 'application')]),
        ),
    ]

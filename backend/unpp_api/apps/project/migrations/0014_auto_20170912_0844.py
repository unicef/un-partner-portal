# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-09-12 08:44
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0013_remove_eoi_selected_partners'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eoi',
            name='invited_partners',
            field=models.ManyToManyField(blank=True, related_name='expressions_of_interest', to='partner.Partner'),
        ),
        migrations.AlterField(
            model_name='eoi',
            name='reviewers',
            field=models.ManyToManyField(blank=True, related_name='eoi_as_reviewer', to=settings.AUTH_USER_MODEL),
        ),
    ]

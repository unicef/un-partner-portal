# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-07 03:40
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('common', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('project', '0001_initial'),
        ('partner', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='partnerreview',
            name='eoi',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='partner_reviews', to='project.EOI'),
        ),
        migrations.AddField(
            model_name='partnerreview',
            name='partner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reviews', to='partner.Partner'),
        ),
        migrations.AddField(
            model_name='partnerreview',
            name='reviewer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='partner_reviews', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='partner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to='partner.Partner'),
        ),
        migrations.AddField(
            model_name='partnermember',
            name='partner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='partners', to='partner.Partner'),
        ),
        migrations.AddField(
            model_name='partnermember',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='partner_members', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='partner',
            name='country',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='partners', to='common.Country'),
        ),
        migrations.AddField(
            model_name='partner',
            name='hq',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='children', to='partner.Partner'),
        ),
    ]

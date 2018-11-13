# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-11-13 09:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0086_auto_20181113_0757'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partnercollaborationpartnership',
            name='description',
            field=models.CharField(blank=True, max_length=10000, null=True),
        ),
        migrations.AlterField(
            model_name='partnermailingaddress',
            name='city',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='partnermailingaddress',
            name='fax',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='partnermailingaddress',
            name='org_email',
            field=models.EmailField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='partnermailingaddress',
            name='po_box',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='partnermailingaddress',
            name='street',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='partnermailingaddress',
            name='telephone',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='partnermailingaddress',
            name='website',
            field=models.URLField(blank=True, max_length=1000, null=True),
        ),
        migrations.AlterField(
            model_name='partnermailingaddress',
            name='zip_code',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
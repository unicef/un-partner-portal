# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-08-07 10:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0070_partnerregistrationdocument_issuing_authority'),
    ]

    operations = [
        migrations.AlterField(
            model_name='partnergoverningdocument',
            name='editable',
            field=models.BooleanField(default=True),
        ),
        migrations.AlterField(
            model_name='partnerregistrationdocument',
            name='editable',
            field=models.BooleanField(default=True),
        ),
    ]
# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-08-09 10:52
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0067_assessment_completed_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='status',
            field=models.CharField(choices=[('Pen', 'Pending'), ('Pre', 'Preselected'), ('Rec', 'Application Recommended'), ('Rej', 'Rejected')], default='Pen', max_length=3),
        ),
    ]

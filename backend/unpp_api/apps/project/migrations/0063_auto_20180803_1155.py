# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-08-03 11:55
from __future__ import unicode_literals

from django.db import migrations, models

from project.identifiers import get_eoi_display_identifier


def generate_ids(apps, schema_editor):
    EOI = apps.get_model('project', 'EOI')
    for eoi in EOI.objects.filter(displayID=None).iterator():
        point = eoi.locations.first()
        if point:
            eoi.displayID = get_eoi_display_identifier(
                eoi.agency.name, point.admin_level_1.country_code, year=eoi.created.year
            )
            eoi.save()


class Migration(migrations.Migration):

    dependencies = [
        ('sequences', '0001_initial'),
        ('project', '0062_eoi_displayid'),
    ]

    operations = [
        migrations.RunPython(generate_ids),
        migrations.AlterField(
            model_name='eoi',
            name='displayID',
            field=models.TextField(max_length=32, unique=True, editable=False),
        ),
    ]

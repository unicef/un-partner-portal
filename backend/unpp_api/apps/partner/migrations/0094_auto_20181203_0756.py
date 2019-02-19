# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-12-03 07:56
from __future__ import unicode_literals

from django.db import migrations


def add_missing_controls_and_policies(apps, schema_editor):
    Partner = apps.get_model('partner', 'Partner')
    PartnerInternalControl = apps.get_model('partner', 'PartnerInternalControl')
    PartnerPolicyArea = apps.get_model('partner', 'PartnerPolicyArea')

    responsibilities = ['Pro', 'AET', 'RoT', 'Pay', 'CoA', 'Ban']
    policy_areas = ['Hum', 'Pro', 'Ass']
    for partner in Partner.objects.all():
        for resp in responsibilities:
            PartnerInternalControl.objects.get_or_create(
                partner=partner, functional_responsibility=resp
            )

        for policy_area in policy_areas:
            PartnerPolicyArea.objects.get_or_create(
                partner=partner, area=policy_area
            )


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0093_auto_20181121_0920'),
    ]

    operations = [
        migrations.RunPython(add_missing_controls_and_policies)
    ]
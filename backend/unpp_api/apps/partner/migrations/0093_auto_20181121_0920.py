# -*- coding: utf-8 -*-
# Generated by Django 1.11.16 on 2018-11-21 09:20
from __future__ import unicode_literals

from django.db import migrations


def migrate_legacy_partner_roles(apps, schema_editor):
    PartnerMember = apps.get_model('partner', 'PartnerMember')

    PartnerMember.objects.filter(role__iexact='Adm').update(role='ADMIN')
    PartnerMember.objects.filter(role__iexact='Edi').update(role='EDITOR')
    PartnerMember.objects.filter(role__iexact='Rea').update(role='READER')


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0092_auto_20181116_0912'),
    ]

    operations = [
        migrations.RunPython(migrate_legacy_partner_roles),
    ]

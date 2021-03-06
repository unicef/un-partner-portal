# -*- coding: utf-8 -*-
# Generated by Django 1.11.14 on 2018-07-24 13:13
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('agency', '0013_auto_20180612_0625'),
        ('partner', '0066_auto_20180724_0902'),
    ]

    operations = [
        migrations.CreateModel(
            name='PartnerVendorNumber',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('number', models.TextField(max_length=1024)),
                ('agency', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vendor_numbers', to='agency.Agency')),
                ('partner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='vendor_numbers', to='partner.Partner')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='partnervendornumber',
            unique_together=set([('agency', 'partner', 'number')]),
        ),
    ]

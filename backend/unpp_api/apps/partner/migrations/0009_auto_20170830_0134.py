# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-30 01:34
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('partner', '0008_auto_20170830_0044'),
    ]

    operations = [
        migrations.CreateModel(
            name='PartnerHeadOrganization',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('first_name', models.CharField(blank=True, max_length=255, null=True)),
                ('last_name', models.CharField(blank=True, max_length=255, null=True)),
                ('email', models.EmailField(blank=True, max_length=255, null=True)),
                ('job_title', models.CharField(blank=True, max_length=255, null=True)),
                ('telephone', models.CharField(blank=True, max_length=255, null=True)),
                ('fax', models.CharField(blank=True, max_length=255, null=True)),
                ('mobile', models.CharField(blank=True, max_length=255, null=True)),
                ('partner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='org_heads', to='partner.Partner')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.AlterModelOptions(
            name='partnermailingaddress',
            options={'ordering': ['id']},
        ),
        migrations.RemoveField(
            model_name='partnerprofile',
            name='org_head_email',
        ),
        migrations.RemoveField(
            model_name='partnerprofile',
            name='org_head_fax',
        ),
        migrations.RemoveField(
            model_name='partnerprofile',
            name='org_head_first_name',
        ),
        migrations.RemoveField(
            model_name='partnerprofile',
            name='org_head_job_title',
        ),
        migrations.RemoveField(
            model_name='partnerprofile',
            name='org_head_last_name',
        ),
        migrations.RemoveField(
            model_name='partnerprofile',
            name='org_head_mobile',
        ),
        migrations.RemoveField(
            model_name='partnerprofile',
            name='org_head_telephonee',
        ),
    ]

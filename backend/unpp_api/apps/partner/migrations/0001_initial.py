# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-07 03:40
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('agency', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Partner',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('legal_name', models.CharField(max_length=255)),
                ('display_type', models.CharField(choices=[('int', 'International'), ('nat', 'National')], max_length=3)),
                ('is_active', models.BooleanField(default=True)),
                ('registration_number', models.CharField(max_length=255)),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='PartnerMember',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('title', models.CharField(max_length=255)),
                ('role', models.CharField(choices=[('Adm', 'Administrator'), ('Edi', 'Editor'), ('Rea', 'Reader')], default='Rea', max_length=3)),
                ('status', models.CharField(choices=[('Act', 'Active'), ('Dea', 'Deactivated'), ('Inv', 'Invited')], default='Inv', max_length=3)),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='PartnerProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('alias_name', models.CharField(blank=True, max_length=255, null=True)),
                ('former_legal_name', models.CharField(blank=True, max_length=255, null=True)),
                ('org_head_first_name', models.CharField(blank=True, max_length=255, null=True)),
                ('org_head_last_name', models.CharField(blank=True, max_length=255, null=True)),
                ('org_head_email', models.EmailField(blank=True, max_length=255, null=True)),
                ('register_country', models.BooleanField(default=False, verbose_name='Register to work in country?')),
                ('flagged', models.BooleanField(default=False)),
                ('start_cooperate_date', models.DateField()),
                ('annual_budget', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('have_gov_doc', models.BooleanField(default=False, verbose_name='Does the organization have a government document?')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='PartnerReview',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('display_type', models.CharField(choices=[('EX1', 'Example 1'), ('EX2', 'Example 2'), ('EX3', 'Example 3')], max_length=3)),
                ('performance_pm', models.CharField(choices=[('Not', 'not satisfactory'), ('Sat', 'satisfactory'), ('Hig', 'Highly satisfactory')], max_length=3)),
                ('peformance_financial', models.CharField(choices=[('Not', 'not satisfactory'), ('Sat', 'satisfactory'), ('Hig', 'Highly satisfactory')], max_length=3)),
                ('performance_com_eng', models.CharField(choices=[('Not', 'not satisfactory'), ('Sat', 'satisfactory'), ('Hig', 'Highly satisfactory')], max_length=3)),
                ('ethical_concerns', models.BooleanField(default=False, verbose_name='Ethical concerns?')),
                ('does_recommend', models.BooleanField(default=False, verbose_name='Does recommend?')),
                ('comment', models.TextField()),
                ('agency', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='partner_reviews', to='agency.Agency')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
    ]

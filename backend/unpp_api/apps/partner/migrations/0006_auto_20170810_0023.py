# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-10 00:23
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('agency', '0002_otheragency'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('partner', '0005_auto_20170809_0122'),
    ]

    operations = [
        migrations.CreateModel(
            name='PartnerCollaborationEvidence',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('mode', models.CharField(choices=[('Acc', 'Accreditation'), ('Ref', 'Reference')], max_length=3)),
                ('organization_name', models.CharField(max_length=200)),
                ('date_received', models.DateField(verbose_name='Date Received')),
                ('evidence_file', models.FileField(upload_to=b'')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collaboration_evidences', to=settings.AUTH_USER_MODEL)),
                ('partner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collaboration_evidences', to='partner.Partner')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PartnerCollaborationPartnership',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('description', models.CharField(blank=True, max_length=200, null=True)),
                ('partner_number', models.CharField(blank=True, max_length=200, null=True)),
                ('agency', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collaborations_partnership', to='agency.Agency')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collaborations_partnership', to=settings.AUTH_USER_MODEL)),
                ('partner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collaborations_partnership', to='partner.Partner')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PartnerCollaborationPartnershipOther',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('partnership_with_insitutions', models.BooleanField(default=False, verbose_name='Has the organization collaborated with or a member of a cluster, professional netwok, consortium or any similar insitutions?')),
                ('description', models.CharField(blank=True, max_length=200, null=True, verbose_name='Please state which cluster, network or consortium and briefly explain the collaboration professional netwok, consortium or any similar insitutions?')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collaborations_partnership_others', to=settings.AUTH_USER_MODEL)),
                ('other_agency', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collaborations_partnership_others', to='agency.OtherAgency')),
                ('partner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='collaborations_partnership_others', to='partner.Partner')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PartnerDonor',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('name', models.CharField(max_length=255)),
                ('partner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='donors', to='partner.Partner')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PartnerFinancialControlSystem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('name', models.CharField(max_length=200)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PartnerInternalControls',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('segregation_duties', models.BooleanField(default=False)),
                ('comment', models.CharField(blank=True, max_length=200, null=True)),
                ('partner', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='partner_internal_controls', to='partner.Partner')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='financial_control_system_desc',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='have_feedback_mechanism',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='have_management_approach',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='have_system_monitoring',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='have_system_track',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='management_approach_desc',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='method_acc',
            field=models.CharField(choices=[('Cas', 'Cash'), ('Acc', 'Accrual')], default='Cas', max_length=3),
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='system_monitoring_desc',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='partnerbudget',
            name='partner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='budgets', to='partner.Partner'),
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='org_acc_system',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, related_name='partner_profiles', to='partner.PartnerFinancialControlSystem'),
            preserve_default=False,
        ),
    ]

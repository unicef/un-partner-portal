# -*- coding: utf-8 -*-
# Generated by Django 1.11.3 on 2017-08-29 10:04
from __future__ import unicode_literals

import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import model_utils.fields


class Migration(migrations.Migration):

    dependencies = [
        ('common', '0001_initial'),
        ('partner', '0006_auto_20170829_0223'),
    ]

    operations = [
        migrations.CreateModel(
            name='PartnerAuditAssessment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('regular_audited', models.BooleanField(default=True)),
                ('org_audits', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('Int', 'Internal audit'), ('Fin', 'Financial statement audit'), ('Don', 'Donor audit')], max_length=3), default=list, null=True, size=None)),
                ('most_recent_audit_report', models.FileField(null=True, upload_to=b'')),
                ('link_report', models.URLField()),
                ('major_accountability_issues_highlighted', models.BooleanField(default=False, verbose_name='Were there any major accountability issues highlighted by audits in the past three years?')),
                ('comment', models.CharField(blank=True, max_length=200, null=True)),
                ('capacity_assessment', models.BooleanField(default=True, verbose_name='Has the organization undergone a formal capacity assessment?')),
                ('assessments', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('HAC', 'HACT micro-assessment'), ('OCH', 'OCHA CBPF (Country-Based Pooled Fund) capacity assessment'), ('UNH', 'UNHCR procurement pre-qualification assessment '), ('DFI', 'DFID pre-grant due diligence assessment'), ('EUE', 'EU/ECHO Framework Partnership Agreement (FPA) assessment'), ('Oth', 'Other formal capacity assessment')], max_length=3), default=list, null=True, size=None)),
                ('assessment_report', models.FileField(null=True, upload_to=b'')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='PartnerExperience',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('years', models.CharField(choices=[('Y01', 'Less than 1 year'), ('Y15', '1-5 years'), ('Y51', '5-10 years'), ('Y10', '10+ years')], default='Y01', max_length=3)),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='PartnerFunding',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('source_core_funding', models.CharField(max_length=200, verbose_name='Please state your source(s) of core funding')),
                ('major_donors', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('Ind', 'Individuals'), ('TaF', 'Trusts and foundations'), ('Pri', 'Private companies and corporations'), ('Gov', 'Government'), ('UNA', 'United Nations Agency'), ('Bil', 'Bilateral Agency/Multilateral'), ('Age', 'Agency/Development Banks'), ('NGO', 'International Non Governmental Organizations'), ('Oth', 'Other')], max_length=3), default=list, null=True, size=None)),
                ('main_donors_list', models.CharField(blank=True, max_length=200, null=True, verbose_name='Please list your main donors')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='PartnerMandateMission',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('background_and_rationale', models.CharField(blank=True, max_length=400, null=True)),
                ('mandate_and_mission', models.CharField(blank=True, max_length=400, null=True)),
                ('governance_structure', models.CharField(blank=True, max_length=200, null=True, verbose_name="Briefly describe the organization's governance structure")),
                ('governance_hq', models.CharField(blank=True, max_length=200, null=True, verbose_name='Briefly describe the headquarters oversight of country/branch office operations including any reporting requirements of the country/branch office to HQ')),
                ('governance_organigram', models.FileField(null=True, upload_to=b'')),
                ('ethic_safeguard', models.BooleanField(default=False)),
                ('ethic_safeguard_policy', models.FileField(null=True, upload_to=b'')),
                ('ethic_fraud', models.BooleanField(default=False)),
                ('ethic_fraud_policy', models.FileField(null=True, upload_to=b'')),
                ('population_of_concern', models.BooleanField(default=False)),
                ('concern_groups', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(choices=[('Ref', 'Refugees'), ('Asy', 'Asylum seekers'), ('IDP', 'Internally displaced persons'), ('Sta', 'Stateless'), ('Ret', 'Returning'), ('Hos', 'Host Country')], max_length=3), default=list, null=True, size=None)),
                ('security_high_risk_locations', models.BooleanField(default=False, verbose_name='Does the organization have the ability to work in high-risk security locations?')),
                ('security_high_risk_policy', models.BooleanField(default=False, verbose_name='Does the organization have policies, procedures and practices related to security risk management?')),
                ('security_desc', models.CharField(blank=True, max_length=200, null=True, verbose_name="Briefly describe the organization's ability, if any, to scale-up operations in emergencies or other situations requiring rapid response.")),
                ('partnership_with_insitutions', models.BooleanField(default=False, verbose_name='Has the organization collaborated with or a member of a cluster, professional netwok, consortium or any similar insitutions?')),
                ('description', models.CharField(blank=True, max_length=200, null=True, verbose_name='Please state which cluster, network or consortium and briefly explain the collaboration professional netwok, consortium or any similar insitutions?')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='PartnerOtherDocument',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('document', models.FileField(null=True, upload_to=b'')),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='PartnerOtherInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('info_to_share', models.CharField(max_length=200)),
                ('org_logo', models.FileField(null=True, upload_to=b'')),
                ('confirm_data_updated', models.BooleanField(default=False)),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='PartnerPolicyArea',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('area', models.CharField(choices=[('Hum', 'Human Resources'), ('Pro', 'Procurement'), ('Ass', 'Asset and Inventory Management')], max_length=3)),
                ('document_policies', models.BooleanField(default=True)),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='PartnerReporting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created', model_utils.fields.AutoCreatedField(default=django.utils.timezone.now, editable=False, verbose_name='created')),
                ('modified', model_utils.fields.AutoLastModifiedField(default=django.utils.timezone.now, editable=False, verbose_name='modified')),
                ('key_result', models.CharField(blank=True, max_length=200, null=True)),
                ('publish_annual_reports', models.BooleanField(default=True)),
                ('last_report', models.DateField(verbose_name='Date of most recent annual report')),
                ('report', models.FileField(null=True, upload_to=b'')),
                ('link_report', models.URLField()),
            ],
            options={
                'ordering': ['id'],
            },
        ),
        migrations.RemoveField(
            model_name='partnerdonor',
            name='partner',
        ),
        migrations.AlterModelOptions(
            name='partnercollaborationevidence',
            options={'ordering': ['id']},
        ),
        migrations.AlterModelOptions(
            name='partnercollaborationpartnership',
            options={'ordering': ['id']},
        ),
        migrations.AlterModelOptions(
            name='partnercollaborationpartnershipother',
            options={'ordering': ['id']},
        ),
        migrations.RemoveField(
            model_name='partnercollaborationpartnershipother',
            name='description',
        ),
        migrations.RemoveField(
            model_name='partnercollaborationpartnershipother',
            name='partnership_with_insitutions',
        ),
        migrations.AddField(
            model_name='partner',
            name='staff_globally',
            field=models.CharField(blank=True, choices=[('005', '1 to 50'), ('010', '51 to 100'), ('020', '101 to 200'), ('050', '201 to 500'), ('100', '501 to 1000'), ('500', '1001 to 5000'), ('Mor', 'more than 5000')], max_length=3, null=True),
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='connectivity',
            field=models.BooleanField(default=False, verbose_name='Does the organization have reliable access to internet in all of its operations?'),
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='connectivity_excuse',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='experienced_staff',
            field=models.BooleanField(default=False, verbose_name='Does the organization have an adequate number of experienced staff responsible for financial management in all operations?'),
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='experienced_staff_desc',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='partnerprofile',
            name='feedback_mechanism_desc',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AlterField(
            model_name='partnercollaborationevidence',
            name='evidence_file',
            field=models.FileField(null=True, upload_to=b''),
        ),
        migrations.DeleteModel(
            name='PartnerDonor',
        ),
        migrations.AddField(
            model_name='partnerreporting',
            name='partner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reports', to='partner.Partner'),
        ),
        migrations.AddField(
            model_name='partnerpolicyarea',
            name='partner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='area_policies', to='partner.Partner'),
        ),
        migrations.AddField(
            model_name='partnerotherinfo',
            name='partner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='other_info', to='partner.Partner'),
        ),
        migrations.AddField(
            model_name='partnerotherdocument',
            name='partner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='other_docs', to='partner.Partner'),
        ),
        migrations.AddField(
            model_name='partnermandatemission',
            name='partner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='mandate_missions', to='partner.Partner'),
        ),
        migrations.AddField(
            model_name='partnerfunding',
            name='partner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='funds', to='partner.Partner'),
        ),
        migrations.AddField(
            model_name='partnerexperience',
            name='partner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='experiences', to='partner.Partner'),
        ),
        migrations.AddField(
            model_name='partnerexperience',
            name='specialization',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='partner_experiences', to='common.Specialization'),
        ),
        migrations.AddField(
            model_name='partnerauditassessment',
            name='partner',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='audits', to='partner.Partner'),
        ),
    ]

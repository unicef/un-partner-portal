# -*- coding: utf-8 -*-
# Generated by Django 1.11.13 on 2018-06-21 10:39
from __future__ import unicode_literals

import common.database_fields
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('notification', '0006_notifieduser_sent_as_email'),
    ]

    operations = [
        migrations.AlterField(
            model_name='notification',
            name='source',
            field=common.database_fields.FixedTextField(choices=[('account_create_reject', 'ACCOUNT_REJECTED'), ('account_reject_sanctions', 'ACCOUNT_REJECTED_BY_SANCTIONS'), ('account_active_profile_create', 'ACTIVE_ACCOUNT_PROFILE_CREATE'), ('account_active_send_to_org_head', 'ACTIVE_ACCOUNT_SEND_TO_ORG_HEAD'), ('added_as_cfei_local_point', 'ADDED_AS_CFEI_FOCAL_POINT'), ('cfei_application_lost', 'CFEI_APPLICATION_LOSS'), ('cfei_application_submitted', 'CFEI_APPLICATION_SUBMITTED'), ('cfei_application_selected', 'CFEI_APPLICATION_WIN'), ('cfei_application_withdraw', 'CFEI_APPLICATION_WITHDRAWN'), ('cfei_cancel', 'CFEI_CANCELLED'), ('cfei_update_prev', 'CFEI_DEADLINE_UPDATE'), ('cfei_invitation', 'CFEI_INVITE'), ('cfei_review_required', 'CFEI_REVIEW_REQUIRED'), ('direct_select_ucn', 'DIRECT_SELECTION_FROM_NOTE_INITIATED'), ('direct_select_un_int', 'DIRECT_SELECTION_INITIATED'), ('superadmin_new_cso_for_deletion', 'DJANGO_ADMIN_NEW_PARTNER_FOR_DELETION'), ('account_org_duplicate', 'DUPLICATE_ORGANIZATION_ACCOUNT'), ('agency_application_decision_make', 'PARTNER_DECISION_MADE'), ('agency_cfei_reviewers_selected', 'SELECTED_AS_CFEI_REVIEWER'), ('unsol_application_submitted', 'UNSOLICITED_CONCEPT_NOTE_RECEIVED')]),
        ),
    ]

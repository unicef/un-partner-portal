# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from account.models import User
from partner.models import Partner
from .models import SanctionedName, SanctionedNameMatch


def filter_name_in_sanctions_names(name):
    return SanctionedName.objects.filter(is_active=True, name__iexact=name)


def perform_users_name_check():
    for user in User.objects.filter(
            partner__members__isnull=False, is_active=True):
        matched_users = filter_name_in_sanctions_names(user.get_fullname())


def check_all_partners():
    for partner in Partner.objects.filter(is_active=True).exclude(
            sanction_matches__can_ignore=False):
        matched_orgs = filter_name_in_sanctions_names(partner.legal_name)

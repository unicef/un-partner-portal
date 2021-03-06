# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.core.mail import send_mail
from django.conf import settings

from common.consts import SANCTION_LIST_TYPES, SANCTION_MATCH_TYPES, INTERNAL_FLAG_CATEGORIES
from partner.models import Partner
from review.models import PartnerFlag
from sanctionslist.models import SanctionedName, SanctionedNameMatch


def filter_sanctions_names(name, sanction_type, partner):
    return SanctionedName.objects.filter(
        is_active=True, name__iexact=name, item__sanctioned_type=sanction_type
    ).exclude(matches__partner=partner)


def create_sanctions_match(name_matches_qs, partner, match_type, match_text):
    for name_match in name_matches_qs:
        match = SanctionedNameMatch.objects.create(
            name=name_match,
            partner=partner,
            match_type=match_type,
            match_text=match_text
        )
        PartnerFlag.objects.create(
            partner=partner,
            category=INTERNAL_FLAG_CATEGORIES.sanctions_match,
            comment=match_text,
            sanctions_match=match,
            is_valid=None
        )

        subject = 'Sanctioned List Scan Match Found on UNPP'
        message = 'Match found: {} \n {}'.format(match, match.match_text)
        send_mail(
            subject, message, settings.DEFAULT_FROM_EMAIL, [settings.UN_SANCTIONS_LIST_EMAIL_ALERT]
        )


def sanctions_scan_partner(partner):
    # Partner Org Legal Name
    matched_names = filter_sanctions_names(partner.legal_name, SANCTION_LIST_TYPES.entity, partner)
    create_sanctions_match(
        matched_names, partner, SANCTION_MATCH_TYPES.organization,
        "Match found on the partners organization legal name"
    )

    if partner.profile.legal_name_change:
        matched_former_names = filter_sanctions_names(
            partner.profile.former_legal_name, SANCTION_LIST_TYPES.entity, partner
        )
        create_sanctions_match(
            matched_former_names, partner, SANCTION_MATCH_TYPES.organization,
            "Match found on the partners past legal name"
        )

    if partner.profile.alias_name:
        matched_aliases = filter_sanctions_names(
            partner.profile.alias_name, SANCTION_LIST_TYPES.entity, partner
        )
        create_sanctions_match(
            matched_aliases, partner, SANCTION_MATCH_TYPES.organization,
            "Match found on the partners alias"
        )

    # Partner Heads
    for org_head in partner.organisation_heads.all():
        matched_names = filter_sanctions_names(
            org_head.fullname, SANCTION_LIST_TYPES.individual, partner
        )
        create_sanctions_match(
            matched_names, partner, SANCTION_MATCH_TYPES.board, "Match found for organizations head"
        )

    # Partner Directors
    for director in partner.directors.all():
        matched_names = filter_sanctions_names(
            director.fullname, SANCTION_LIST_TYPES.individual, partner
        )
        create_sanctions_match(
            matched_names, partner, SANCTION_MATCH_TYPES.board, "Match found for organizations Director"
        )

    # Partner Authorized Officers
    for officer in partner.authorised_officers.all():
        matched_names = filter_sanctions_names(
            officer.fullname, SANCTION_LIST_TYPES.individual, partner
        )
        create_sanctions_match(
            matched_names, partner, SANCTION_MATCH_TYPES.board, "Match found for organizations Authorized Officer"
        )

    # Partner Users
    for partner_member in partner.partner_members.all():
        matched_names = filter_sanctions_names(
            partner_member.user.fullname, SANCTION_LIST_TYPES.individual, partner
        )

        create_sanctions_match(
            matched_names, partner, SANCTION_MATCH_TYPES.user, "Match found for organization User"
        )


def sanctions_scan_all_partners():
    # Filter Out All Partners who have an active sanction match
    for partner in Partner.objects.filter(is_active=True).exclude(sanction_matches__can_ignore=False):
        sanctions_scan_partner(partner)

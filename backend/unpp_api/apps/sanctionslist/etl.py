from datetime import datetime

import requests
import xmltodict
from dateutil import parser

from common.consts import SANCTION_LIST_TYPES
from .models import SanctionedItem, SanctionedName

SANCTIONS_LIST_URL = 'https://scsanctions.un.org/resources/xml/en/consolidated.xml'
ACCEPTED_QUALITIES = ['Good', 'a.k.a.']


def parse_alias(alias):
    if alias['QUALITY'] in ACCEPTED_QUALITIES:
        return alias['ALIAS_NAME']


def normalize_person_names(person):
    normalized_names = []
    # Clean out first, second, third name
    names = [
        person.get('FIRST_NAME', None),
        person.get('SECOND_NAME', None),
        person.get('THIRD_NAME', None)
    ]
    primary_name = ''.join(filter(None, names))
    normalized_names.append(primary_name)

    person_alias = person['INDIVIDUAL_ALIAS']

    if isinstance(person_alias, list):
        for alias in person_alias:
            normalized_names.append(parse_alias(alias))
    else:
        if person_alias:
            normalized_names.append(parse_alias(person_alias))

    return [x.lower() for x in normalized_names if x]


def normalize_entity_names(entity):
    normalized_names = []
    normalized_names.append(entity['FIRST_NAME'])

    entity_alias = entity['ENTITY_ALIAS']

    if isinstance(entity_alias, list):
        for alias in entity_alias:
            normalized_names.append(parse_alias(alias))
    else:
        if entity_alias:
            normalized_names.append(parse_alias(entity_alias))

    return [x.lower() for x in normalized_names if x]


def parse_unsc_individuals(indivs):
    for person in indivs:
        # normalized_names = normalize_person_names(person)
        listed_on = parser.parse(person['LISTED_ON']).date()
        # last_updated = parser.parse(person['LAST_DAY_UPDATED']).date()
        obj, created = SanctionedItem.objects.update_or_create(
            sanctioned_type=SANCTION_LIST_TYPES.individual,
            data_id=int(person['DATAID']),
            defaults={'listed_on': listed_on})

        for name in normalize_person_names(person):
            SanctionedName.objects.get_or_create(item=obj, name=name)


def parse_unsc_entities(entities):
    for entity in entities:
        listed_on = parser.parse(entity['LISTED_ON']).date()
        obj, created = SanctionedItem.objects.update_or_create(
            sanctioned_type=SANCTION_LIST_TYPES.entity,
            data_id=int(entity['DATAID']),
            defaults={'listed_on': listed_on})

        for name in normalize_entity_names(entity):
            SanctionedName.objects.get_or_create(item=obj, name=name)


def parse_unsc_list():
    response = requests.get(SANCTIONS_LIST_URL)
    dict_response = xmltodict.parse(response.content)
    consolidated_list = dict_response['CONSOLIDATED_LIST']
    parse_unsc_entities(consolidated_list['ENTITIES']['ENTITY'])
    parse_unsc_individuals(consolidated_list['INDIVIDUALS']['INDIVIDUAL'])

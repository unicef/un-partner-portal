import requests
import xmltodict
from datetime import datetime

from common.consts import SANCTION_LIST_TYPES
from .models import SanctionedItem

SANCTIONS_LIST_URL = 'https://scsanctions.un.org/resources/xml/en/consolidated.xml'
ACCEPTED_QUALITIES = ['Good']


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

    # Get all aliases
    person_alias = person['INDIVIDUAL_ALIAS']

    if isinstance(person_alias, list):
        for alias in person_alias:
            normalized_names.append(parse_alias(alias))
    else:
        if person_alias:
            normalized_names.append(parse_alias(person_alias))

    return [x.lower() for x in normalized_names if x]


def parse_unsc_individuals(indivs):
    for person in indivs:
        normalized_names = normalize_person_names(person)
        listed_on = datetime.strptime(person['LISTED_ON'], '%Y-%m-%d').date()
        # 'last_updated': person['LAST_DAY_UPDATED']
        SanctionedItem.objects.update_or_create(
            data_id=int(person['DATAID']),
            defaults={'check_names': normalized_names,
                      'listed_on': listed_on})


def parse_unsc_entities(entities):
    for entity in entities:
        pass


def parse_unsc_list():
    response = requests.get(SANCTIONS_LIST_URL)
    dict_response = xmltodict.parse(response.content)
    consolidated_list = dict_response['CONSOLIDATED_LIST']
    # parse_unsc_entities(consolidated_list['ENTITIES']['ENTITY'])
    parse_unsc_individuals(consolidated_list['INDIVIDUALS']['INDIVIDUAL'])

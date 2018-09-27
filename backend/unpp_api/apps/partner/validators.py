import logging

from rest_framework import serializers

from partner.models import Partner


logger = logging.getLogger('django.request')


class PartnerRegistrationValidator(object):
    """
    1. Should NOT allow two organizations with the same name in the same country to register.
    2. Should allow two organizations with the same name in two different countries to register.
    3. Should allow two differently-named organizations with the same head of organization to register.
    4. Should NOT allow two differently-named organizations with the same head of organization e-mail to register.
    """

    def __call__(self, submitted_data):
        partner_data = submitted_data['partner']
        same_name_partners_in_country = Partner.objects.filter(
            legal_name=partner_data['legal_name'], country_code=partner_data['country_code']
        )
        if same_name_partners_in_country.exists():
            raise serializers.ValidationError('Partner with this name already registered for country')

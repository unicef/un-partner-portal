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
        if Partner.objects.filter(
                    legal_name=partner_data['legal_name'], country_code=partner_data['country_code']
                ).exists():
            raise serializers.ValidationError('Partner with this name already registered for country')
        else:
            partner_org_head_data = submitted_data['partner_head_organization']
            other_partner_names_under_same_org_head = set(Partner.objects.filter(
                org_head__email=partner_org_head_data['email']
            ).values_list('legal_name', flat=True).order_by().distinct())
            if other_partner_names_under_same_org_head and \
                    partner_data['legal_name'] not in other_partner_names_under_same_org_head:
                if len(other_partner_names_under_same_org_head):
                    logger.error(
                        'Please check data integrity: Head of org email: {} '
                        'has multiple partner names registered'.format(
                            partner_org_head_data['email']
                        )
                    )
                raise serializers.ValidationError(
                    'Provided head of organization email already has a partner registered'
                )

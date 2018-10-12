import logging
from datetime import date
from time import sleep

from django.conf import settings
from django.db.models import Sum
from requests.auth import HTTPBasicAuth
import requests
from rest_framework import status

from common.business_areas import BUSINESS_AREA_TO_CODE, BUSINESS_AREAS
from defusedxml.ElementTree import fromstring, tostring

from externals.models import UNICEFVendorData, PartnerVendorNumber


logger = logging.getLogger('console')


class UNICEFInfoDownloader(object):

    def __init__(self):
        self.host = settings.UNICEF_PARTNER_DETAILS_URL
        self.auth = HTTPBasicAuth(settings.UNICEF_API_USERNAME, settings.UNICEF_API_PASSWORD)
        self.session = requests.Session()
        self.session.auth = self.auth

    def get_url(self, url, max_retry=1):
        logger.debug(f'Getting {url}')
        response = self.session.get(url, timeout=60)
        if not response.status_code == status.HTTP_200_OK:
            logger.debug(f'Response failure {response}')
            if max_retry == 0:
                response.raise_for_status()
            else:
                sleep(10)
                return self.get_url(url, max_retry=max_retry - 1)

        logger.debug(f'Response success {response}')
        return response.text

    def sync_business_areas(self):
        year = date.today().year

        for ba, _ in BUSINESS_AREAS:
            listing_url = f'{self.host}{BUSINESS_AREA_TO_CODE[ba]}'

            response_text = self.get_url(listing_url)
            if not response_text:
                continue

            for data_row in fromstring(response_text).findall('ROW'):
                logger.debug(f'Inserting {tostring(data_row).decode()}')
                vendor_number = data_row.find('VENDOR_CODE').text
                vendor_name = data_row.find('VENDOR_NAME').text
                cash_transfers_current_year = data_row.find('TOTAL_CASH_TRANSFERRED_CY').text
                cash_transfers_year_to_date = data_row.find('TOTAL_CASH_TRANSFERRED_YTD').text

                UNICEFVendorData.objects.update_or_create(
                    business_area=ba,
                    vendor_number=vendor_number,
                    year=year,
                    defaults={
                        'vendor_name': vendor_name,
                        'total_cash_transfers': cash_transfers_current_year,
                        'cash_transfers_this_year': cash_transfers_year_to_date,
                    }
                )
                logger.debug('Saved')


class UNICEFInfoClient(object):

    start_year = 2015

    def get_total_and_yearly_data(self, partner, vendor_code):
        total = None
        yearly_data = dict()

        cash_data = UNICEFVendorData.objects.filter(
            vendor_number=vendor_code, year__gte=self.start_year
        ).order_by().values_list('year').annotate(
            Sum('total_cash_transfers'),
            Sum('cash_transfers_this_year'),
        )

        for year, cash_transfers_total, cash_transfer_year_total in cash_data:
            yearly_data[year] = cash_transfer_year_total
            total = max(
                total or 0, cash_transfers_total
            )

        return total, yearly_data

    def get_tables(self, vendor_number: PartnerVendorNumber):
        current_year = date.today().year
        partner = vendor_number.partner

        total, yearly_data = self.get_total_and_yearly_data(partner, vendor_number.number)

        years = range(max(self.start_year, current_year - 5), current_year + 1)

        table_rows = [[
            partner.legal_name,
            partner.get_country_code_display(),
            *[
                yearly_data.get(y, 'No Data') for y in years
            ],
            total if total is not None else 'No Data'
        ]]

        for child in partner.children.all():
            child_vendor_number = PartnerVendorNumber.objects.filter(
                partner=child, agency=vendor_number.agency
            )
            if not child_vendor_number:
                continue

            child_total, child_yearly_data = self.get_total_and_yearly_data(child, child_vendor_number.number)

            table_rows.append([
                child.legal_name,
                child.get_country_code_display(),
                *[
                    child_yearly_data.get(y, 'No Data') for y in years
                ],
                child_total if child_total is not None else 'No Data'
            ])

        tables = [{
            'title': 'Cash Transfers',
            'header': [
                'Legal Name',
                'Country',
                *map(str, years),
                'Total'
            ],
            'rows': table_rows
        }]

        return tables

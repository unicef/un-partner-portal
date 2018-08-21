from time import sleep

from django.conf import settings
from requests.auth import HTTPBasicAuth
import requests
from rest_framework import status

from common.business_areas import BUSINESS_AREA_TO_CODE, BUSINESS_AREAS
from defusedxml.ElementTree import fromstring

from externals.models import UNICEFVendorData


class UNICEFInfoDownloader(object):

    def __init__(self):
        self.host = settings.UNICEF_PARTNER_DETAILS_URL
        self.auth = HTTPBasicAuth(settings.UNICEF_API_USERNAME, settings.UNICEF_API_PASSWORD)
        self.session = requests.Session()
        self.session.auth = self.auth

    def get_url(self, url, max_retry=1):
        response = self.session.get(url)
        if not response.status_code == status.HTTP_200_OK:
            if max_retry == 0:
                return None
            else:
                sleep(10)
                return self.get_url(url, max_retry=max_retry - 1)

        return response.text

    def sync_business_areas(self):
        for ba, _ in BUSINESS_AREAS:
            listing_url = f'{self.host}{BUSINESS_AREA_TO_CODE[ba]}'
            response_text = self.get_url(listing_url)
            if not response_text:
                continue

            for data_row in fromstring(response_text).findall('ROW'):
                vendor_number = data_row.find('VENDOR_CODE').text
                vendor_name = data_row.find('VENDOR_NAME').text
                cash_transfers_current_year = data_row.find('TOTAL_CASH_TRANSFERRED_CY').text
                cash_transfers_year_to_date = data_row.find('TOTAL_CASH_TRANSFERRED_YTD').text

                UNICEFVendorData.objects.update_or_create(
                    business_area=ba,
                    vendor_number=vendor_number,
                    defaults={
                        'vendor_name': vendor_name,
                        'cash_transfers_current_year': cash_transfers_current_year,
                        'cash_transfers_year_to_date': cash_transfers_year_to_date,
                    }
                )

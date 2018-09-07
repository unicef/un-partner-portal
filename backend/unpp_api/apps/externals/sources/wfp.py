from django.conf import settings
import requests

from externals.exceptions import ServiceUnavailable
from externals.models import PartnerVendorNumber


class WFPPartnerInfoClient(object):

    def __init__(self):
        self.headers = {
            'Authorization': f'Bearer {settings.WFP_API_TOKEN}',
        }

    def get_tables(self, vendor_number: PartnerVendorNumber):
        source_url = f'https://{settings.WFP_API_HOST}/unpp/1.0.0/vendors?vendor_code={vendor_number.number}'

        response = requests.get(source_url, headers=self.headers, timeout=30)

        if not response.status_code == 200:
            raise ServiceUnavailable

        header = []
        row = []

        for k, v in response.json()['data']['results'].items():
            header.append(k)
            row.append(v)

        return [{
            'title': 'Partner Basic Information',
            'header': header,
            'rows': [
                row
            ],
        }]

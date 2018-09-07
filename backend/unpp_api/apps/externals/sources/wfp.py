from django.conf import settings
import requests

from externals.models import PartnerVendorNumber


class WFPPartnerInfoClient(object):

    def __init__(self):
        self.headers = {
            'Authorization': f'Bearer {settings.WFP_API_TOKEN}',
        }

    def get_tables(self, vendor_number: PartnerVendorNumber):
        source_url = f'https://{settings.WFP_API_HOST}/unpp/1.0.0/vendors?vendor_code={vendor_number.number}'

        response = requests.get(source_url, headers=self.headers, timeout=30)

        return {
            'status_code': response.status_code,
            'content': response.json(),
        }

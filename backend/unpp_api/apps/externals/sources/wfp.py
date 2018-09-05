from django.conf import settings
import requests


class WFPPartnerInfoClient(object):

    def __init__(self):
        self.address = settings.WFP_API_IP
        self.headers = {
            'Authorization': f'Bearer {settings.WFP_API_TOKEN}',
            'host': 'unpp.api.efs.wfp.org',
        }

    def get_tables(self, vendor_number):
        source_url = f'https://{self.address}/unpp/1.0.0/vendors?vendor_code={vendor_number}'

        response = requests.get(source_url, headers=self.headers, verify=False, timeout=30)

        return {
            'status_code': response.status_code,
            'text': getattr(response, 'text', None),
        }

from django.conf import settings
from requests.auth import HTTPBasicAuth
import requests
from rest_framework import status

from externals.exceptions import ServiceUnavailable
from externals.sources.formatting import to_table_format


class UNHCRInfoClient(object):

    def __init__(self):
        self.host = settings.UNHCR_API_HOST
        self.auth = HTTPBasicAuth(settings.UNHCR_API_USERNAME, settings.UNHCR_API_PASSWORD)
        self.session = requests.Session()
        self.session.auth = self.auth

    def get_tables(self, vendor_number):
        url_postfix = f'?PARTNER_CODE={vendor_number.number}&ISO_CODE={vendor_number.partner.country_iso_alpha3}'

        sources = {
            'Overview': f"{self.host}params/flat/OVERVIEW" + url_postfix,
            'Projects': f"{self.host}params/flat/PROJECTS" + url_postfix,
            'By Country': f"{self.host}params/flat/BY_COUNTRY" + url_postfix,
            'By Year': f"{self.host}params/flat/HISTORICAL" + url_postfix,
        }

        tables = []
        for title, url in sources.items():
            response = self.session.get(url, timeout=30)
            if response.status_code == status.HTTP_200_OK:
                header, rows = to_table_format(response.json())
                tables.append({
                    'title': title,
                    'header': list(header),
                    'rows': rows,
                })

        if not tables:
            raise ServiceUnavailable
        return tables

from __future__ import absolute_import
from rest_framework import status as statuses
from rest_framework.response import Response
from rest_framework.views import APIView
from .countries import COUNTRIES_ALPHA2_CODE_DICT
from .consts import (
    FINANCIAL_CONTROL_SYSTEM_CHOICES,
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    PARTNER_DONORS_CHOICES,
    WORKING_LAGNUAGES_CHOICES,
)


class ConfigCountriesAPIView(APIView):

    def get(self, request, *args, **kwargs):
        """
        Return list of defined countries in backend.
        """
        return Response(COUNTRIES_ALPHA2_CODE_DICT, status=statuses.HTTP_200_OK)


class ConfigPPAPIView(APIView):

    def get(self, request, *args, **kwargs):
        """
        Return list of defined countries in backend.
        """
        data = {
            "financial-control-system": FINANCIAL_CONTROL_SYSTEM_CHOICES,
            "functional-responsibilities": FUNCTIONAL_RESPONSIBILITY_CHOICES,
            "partner-donors": PARTNER_DONORS_CHOICES,
            "working-languages": WORKING_LAGNUAGES_CHOICES,
        }
        return Response(data, status=statuses.HTTP_200_OK)

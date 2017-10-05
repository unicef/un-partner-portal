from __future__ import absolute_import
from rest_framework import status as statuses
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import ConfigSectorSerializer
from .models import Sector
from .countries import COUNTRIES_ALPHA2_CODE_DICT
from .consts import (
    FINANCIAL_CONTROL_SYSTEM_CHOICES,
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    PARTNER_DONORS_CHOICES,
    WORKING_LAGNUAGES_CHOICES,
    CONCERN_GROUP_CHOICES,
    AUDIT_TYPES,
    FORMAL_CAPACITY_ASSESSMENT,
    PARTNER_TYPES,
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
            "population-of-concerns-groups": CONCERN_GROUP_CHOICES,
            "audit-types": AUDIT_TYPES,
            "formal-capacity-assessment": FORMAL_CAPACITY_ASSESSMENT,
            "partner-type": PARTNER_TYPES,
        }
        return Response(data, status=statuses.HTTP_200_OK)


class ConfigSectorsAPIView(APIView):

    def get(self, request, *args, **kwargs):
        """
        Return list of defined Sector & Specialization in backend.
        """
        data = ConfigSectorSerializer(Sector.objects.all(), many=True).data
        return Response(data, status=statuses.HTTP_200_OK)

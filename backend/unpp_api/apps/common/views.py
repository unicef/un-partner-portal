from __future__ import absolute_import
from rest_framework import status as statuses
from rest_framework.response import Response
from rest_framework.views import APIView
from .countries import COUNTRIES_ALPHA2_CODE_DICT


class CountiresListAPIView(APIView):

    def get(self, request, *args, **kwargs):
        """
        Return list of defined countries in backend.
        """
        return Response(COUNTRIES_ALPHA2_CODE_DICT, status=statuses.HTTP_200_OK)

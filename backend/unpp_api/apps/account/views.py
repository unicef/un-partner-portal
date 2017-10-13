import logging

from django.contrib.auth import authenticate, login, logout
from rest_framework import status as statuses
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

from .serializers import (
    RegisterSimpleAccountSerializer,
    PartnerRegistrationSerializer,
)

logger = logging.getLogger(__name__)


class AccountRegisterAPIView(APIView):

    serializer_class = RegisterSimpleAccountSerializer
    permission_classes = (AllowAny, )

    def post(self, request, *args, **kwargs):
        """

        """
        serializer = PartnerRegistrationSerializer(data=self.request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=statuses.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.instance_json, status=statuses.HTTP_201_CREATED)

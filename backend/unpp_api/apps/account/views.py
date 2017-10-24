import logging

from django.contrib.auth import authenticate, login, logout
from django.http import Http404

from rest_framework import status as statuses
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import RetrieveAPIView

from .serializers import (
    RegisterSimpleAccountSerializer,
    PartnerRegistrationSerializer,
    AgencyUserSerializer,
    PartnerUserSerializer,
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


class AccountCurrentUserRetrieveAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated, )

    def get_serializer_class(self):
        if self.request.user.is_agency_user:
            return AgencyUserSerializer
        if self.request.user.is_partner_user:
            return PartnerUserSerializer
        raise Http404('User has no relation to agency or partners')


    def get_object(self):
        return self.request.user

from django.db import transaction
from django.http import Http404
from rest_framework.exceptions import PermissionDenied

from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView, CreateAPIView, RetrieveUpdateAPIView

from account.serializers import (
    PartnerRegistrationSerializer,
    PartnerUserSerializer,
    UserProfileSerializer,
)
from agency.serializers import AgencyUserSerializer


class AccountRegisterAPIView(CreateAPIView):

    permission_classes = (IsAuthenticated, )
    serializer_class = PartnerRegistrationSerializer

    @transaction.atomic
    def perform_create(self, serializer):
        if self.request.user.agency_members.exists():
            raise PermissionDenied('Agency Members cannot register partner profiles.')
        elif self.request.user.partner_members.exists():
            raise PermissionDenied('You have already registered a partner profile.')
        return super(AccountRegisterAPIView, self).perform_create(serializer)


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


class UserProfileRetrieveUpdateAPIView(RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, )
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user.profile

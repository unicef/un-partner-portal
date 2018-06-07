from django.db import transaction
from django.http import Http404

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import RetrieveAPIView, CreateAPIView, RetrieveUpdateAPIView

from partner.models import Partner
from sanctionslist.scans import sanctions_scan_partner
from account.serializers import (
    PartnerRegistrationSerializer,
    PartnerUserSerializer,
    UserProfileSerializer,
)
from agency.serializers import AgencyUserSerializer


class AccountRegisterAPIView(CreateAPIView):

    permission_classes = (AllowAny, )
    serializer_class = PartnerRegistrationSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        response = super(AccountRegisterAPIView, self).create(request, *args, **kwargs)
        partner = Partner.objects.get(id=response.data['partner']['id'])
        sanctions_scan_partner(partner)

        if partner.has_sanction_match:
            partner.is_locked = True
            partner.save()
        return response


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

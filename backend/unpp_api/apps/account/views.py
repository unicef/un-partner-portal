from django.conf import settings
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db import transaction
from django.http import Http404
from django.views.generic import RedirectView
from rest_auth.models import TokenModel
from rest_auth.utils import default_create_token

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


class SocialAuthLoggedInUserView(LoginRequiredMixin, RedirectView):

    def get_redirect_url(self, *args, **kwargs):
        protocol = 'https' if self.request.is_secure() else 'http'
        token = default_create_token(TokenModel, self.request.user, None)

        return f'{protocol}://{settings.FRONTEND_HOST}/login/token?key={token}'

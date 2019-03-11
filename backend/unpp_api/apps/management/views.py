from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from account.models import User
from agency.models import AgencyOffice
from agency.permissions import AgencyPermission
from agency.roles import AgencyRole
from common.pagination import SmallPagination
from common.permissions import HasUNPPPermission
from management.filters import AgencyUserFilter, PartnerUserFilter
from management.serializers import AgencyUserManagementSerializer, PartnerOfficeManagementSerializer, \
    AgencyOfficeManagementSerializer, PartnerUserManagementSerializer
from partner.models import Partner
from partner.permissions import PartnerPermission


class UserViewSet(CreateAPIView, ListAPIView, UpdateAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.MANAGE_USERS,
            ],
            partner_permissions=[
                PartnerPermission.MANAGE_USERS,
            ]
        ),
    )
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend,)

    @property
    def filter_class(self):
        if self.request.agency_member:
            return AgencyUserFilter
        elif self.request.active_partner:
            return PartnerUserFilter

    def get_serializer_class(self):
        if self.request.agency_member:
            return AgencyUserManagementSerializer
        elif self.request.active_partner:
            return PartnerUserManagementSerializer

    def get_queryset(self):
        queryset = User.objects.none()
        if self.request.agency_member:
            queryset = User.objects.filter(agency_members__office__agency=self.request.user.agency).distinct('id')
        elif self.request.active_partner:
            query = Q(partner_members__partner=self.request.active_partner)
            if self.request.active_partner.is_hq:
                query |= Q(partner_members__partner__hq=self.request.active_partner)

            queryset = User.objects.filter(query).distinct('id')

        return queryset.order_by('-id')


class OfficeListView(APIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.MANAGE_USERS,
            ],
            partner_permissions=[
                PartnerPermission.MANAGE_USERS,
            ]
        ),
    )

    def get_serializer_class(self):
        if self.request.agency_member:
            return AgencyOfficeManagementSerializer
        else:
            return PartnerOfficeManagementSerializer

    def get(self, request, *args, **kwargs):

        if self.request.agency_member:
            queryset = AgencyOffice.objects.filter(agency=self.request.user.agency)
            if not self.request.agency_member.role == AgencyRole.HQ_EDITOR.name:
                # Only HQ_EDITOR users can assign users freely between all offices
                queryset = queryset.filter(agency_members__user=self.request.user)
        elif self.request.active_partner:
            query = Q(id=self.request.active_partner.id)
            if self.request.active_partner.is_hq:
                query |= Q(hq=self.request.active_partner)
            queryset = Partner.objects.filter(query)
        else:
            queryset = Partner.objects.none()

        if self.request.agency_member:
            query_filter = AgencyOffice.objects.filter(agency=self.request.user.agency)
        elif self.request.active_partner:
            query = Q(id=self.request.active_partner.id) | Q(hq=self.request.active_partner)
            query_filter = Partner.objects.filter(query)
        else:
            query_filter = Partner.objects.none()

        serializer = self.get_serializer_class()
        offices_choices = serializer(queryset, many=True)
        offices_filter = serializer(query_filter, many=True)

        data = {
            "user-offices-choices": offices_choices.data,
            "user-offices-filter": offices_filter.data
        }

        return Response(data, status=status.HTTP_200_OK)

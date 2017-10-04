# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import get_object_or_404
from rest_framework import status as statuses
from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.filters import OrderingFilter

from django_filters.rest_framework import DjangoFilterBackend

from common.consts import EOI_TYPES
from common.paginations import SmallPagination
from common.permissions import IsAtLeastMemberReader, IsAtLeastMemberEditor, IsAtLeastAgencyMemberEditor
from partner.models import PartnerMember
from .models import Application, EOI, Pin
from .serializers import (
    BaseProjectSerializer,
    DirectProjectSerializer,
    CreateProjectSerializer,
    CreateDirectProjectSerializer,
    ProjectUpdateSerializer,
    ApplicationFullSerializer,
    CreateDirectApplicationNoCNSerializer,
    ApplicationsListSerializer,
    CreateUnsolicitedProjectSerializer,
)
from .filters import BaseProjectFilter, ApplicationsFilter


class BaseProjectAPIView(ListAPIView):
    """
    Base endpoint for Call of Expression of Interest.
    """
    permission_classes = (IsAuthenticated, IsAtLeastMemberReader)
    queryset = EOI.objects.prefetch_related("specializations", "agency")
    serializer_class = BaseProjectSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_class = BaseProjectFilter
    ordering_fields = ('deadline_date', 'start_date', 'status')


class OpenProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting OPEN Call of Expression of Interest.
    """

    def get_queryset(self):
        return self.queryset.filter(display_type=EOI_TYPES.open)

    def post(self, request, *args, **kwargs):
        data = request.data or {}
        try:
            data['eoi']['created_by'] = request.user.id
        except Exception:
            pass  # serializer.is_valid() will take care of right response

        serializer = CreateProjectSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=statuses.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=statuses.HTTP_201_CREATED)


class EOIAPIView(RetrieveUpdateAPIView):

    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    serializer_class = ProjectUpdateSerializer
    queryset = EOI.objects.all()


class DirectProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting DIRECT Call of Expression of Interest.
    """

    serializer_class = DirectProjectSerializer

    def get_partners_pks(self):
        # Partner Member can have many partners! This case is under construction and can change in future!
        return PartnerMember.objects.filter(user=self.request.user).values_list('partner', flat=True)

    def get_queryset(self):
        return self.queryset.filter(display_type=EOI_TYPES.direct)

    def post(self, request, *args, **kwargs):
        data = request.data or {}
        try:
            data['eoi']['created_by'] = request.user.id
        except Exception:
            pass  # serializer.is_valid() will take care of right response

        serializer = CreateDirectProjectSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=statuses.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=statuses.HTTP_201_CREATED)


class PinProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting PINNED Call of Expression of Interest for User Partner.
    """

    ERROR_MSG_WRONG_EOI_PKS = "At least one of given EOI primary key doesn't exists."
    ERROR_MSG_WRONG_PARAMS = "Couldn't properly identify input parameters like 'eoi_ids' and 'pin'."

    def get_queryset(self):
        member = get_object_or_404(PartnerMember, user=self.request.user)
        return self.queryset.filter(pins__partner=member.partner)

    def patch(self, request, *args, **kwargs):
        eoi_ids = request.data.get("eoi_ids")
        pin = request.data.get("pin")
        if EOI.objects.filter(id__in=eoi_ids).count() != len(eoi_ids):
            return Response(
                {"error": self.ERROR_MSG_WRONG_EOI_PKS},
                status=statuses.HTTP_400_BAD_REQUEST
            )
        partner = PartnerMember.objects.get(user=request.user).partner
        if pin and len(eoi_ids) > 0:
            pins = []
            for eoi in eoi_ids:
                pins.append(Pin(eoi_id=eoi, partner=partner, pinned_by=request.user))
            Pin.objects.bulk_create(pins)
            return Response({"eoi_ids": eoi_ids}, status=statuses.HTTP_201_CREATED)
        elif pin is False and len(eoi_ids) > 0:
            Pin.objects.filter(eoi_id__in=eoi_ids, partner=partner, pinned_by=request.user).delete()
            return Response(status=statuses.HTTP_204_NO_CONTENT)
        else:
            return Response(
                {"error": self.ERROR_MSG_WRONG_PARAMS},
                status=statuses.HTTP_400_BAD_REQUEST
            )


class ApplicationsPartnerAPIView(CreateAPIView):
    """
    Create Application for open EOI by partner.
    """
    permission_classes = (IsAuthenticated, IsAtLeastMemberReader)
    queryset = Application.objects.all()
    serializer_class = ApplicationFullSerializer

    def create(self, request, pk, *args, **kwargs):
        request.data['eoi'] = pk
        request.data['submitter'] = request.user.id
        partner_member = PartnerMember.objects.filter(user=request.user).first()
        if partner_member:
            request.data['partner'] = partner_member.partner.id
        return super(ApplicationsPartnerAPIView, self).create(request, *args, **kwargs)


class ApplicationsAgencyAPIView(ApplicationsPartnerAPIView):
    """
    Create Application for direct EOI by agency.
    """
    permission_classes = (IsAuthenticated, IsAtLeastAgencyMemberEditor)
    queryset = Application.objects.all()
    serializer_class = CreateDirectApplicationNoCNSerializer

    def create(self, request, pk, *args, **kwargs):
        request.data['did_win'] = True
        return super(ApplicationsAgencyAPIView, self).create(request, pk, *args, **kwargs)


class ApplicationAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated, IsAtLeastMemberEditor)
    queryset = Application.objects.all()
    serializer_class = ApplicationFullSerializer


class ApplicationsListAPIView(ListAPIView):
    permission_classes = (IsAuthenticated, IsAtLeastMemberReader)
    queryset = Application.objects.all()
    serializer_class = ApplicationsListSerializer
    pagination_class = SmallPagination
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_class = ApplicationsFilter
    ordering_fields = ('status', )
    lookup_field = lookup_url_kwarg = 'pk'

    def get_queryset(self, *args, **kwargs):
        eoi_id = self.kwargs.get(self.lookup_field)
        return Application.objects.filter(eoi_id=eoi_id)


class UnsolicitedProjectAPIView(CreateAPIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = (IsAuthenticated, )
    queryset = Application.objects.all()
    serializer_class = CreateUnsolicitedProjectSerializer

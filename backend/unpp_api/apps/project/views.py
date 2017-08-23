# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import get_object_or_404
from rest_framework import status as statuses
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

import django_filters.rest_framework

from common.consts import EOI_TYPES
from common.paginations import SmallPagination
from common.permissions import IsAtLeastMemberReader
from partner.models import PartnerMember
from .models import EOI, Pin
from .serializers import BaseProjectSerializer, CreateProjectSerializer
from .filters import BaseProjectFilter


class BaseProjectAPIView(ListAPIView):
    """
    Base endpoint for Call of Expression of Interest.
    """
    SORT_TYPE_ASC = 'asc'
    SORT_TYPE_DESC = 'desc'
    ALLOWED_SORT_BY = ['deadline_date', 'start_date', 'status']
    ALLOWED_SORT_TYPE = [SORT_TYPE_ASC, SORT_TYPE_DESC]
    permission_classes = (IsAuthenticated, IsAtLeastMemberReader)
    queryset = EOI.objects.prefetch_related("specializations", "agency", "pinned")
    serializer_class = BaseProjectSerializer
    pagination_class = SmallPagination
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, )
    filter_class = BaseProjectFilter

    def get_queryset(self):
        self.make_custom_queryset()
        self.make_sort()
        return self.queryset

    def make_sort(self):
        sort_by = self.request.query_params.get('sort_by', None)
        sort_type = self.request.query_params.get('sort_type', None)

        if sort_by and sort_by in self.ALLOWED_SORT_BY:

            prefix_sort_type = ""
            if sort_type in self.ALLOWED_SORT_TYPE and sort_type == self.SORT_TYPE_DESC:
                prefix_sort_type = "-"

            self.queryset = self.queryset.order_by("{}{}".format(prefix_sort_type, sort_by))


class OpenProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting Call of Expression of Interest.
    """

    def make_custom_queryset(self):
        self.queryset = self.queryset.filter(display_type=EOI_TYPES.open)

    def post(self, request, *args, **kwargs):
        data = request.data or {}
        data['created_by'] = request.user.id

        serializer = CreateProjectSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=statuses.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=statuses.HTTP_201_CREATED)


class DirectProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting Call of Expression of Interest.
    """

    def make_custom_queryset(self):
        self.queryset = self.queryset.filter(display_type=EOI_TYPES.direct)


class PinProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting Call of Expression of Interest.
    """

    ERROR_MSG_WRONG_EOI_PKS = "At least one of given EOI primary key doesn't exists."
    ERROR_MSG_WRONG_PARAMS = "Couldn't properly identify input parameters like 'eoi_ids' and 'pin'."

    def make_custom_queryset(self):
        member = get_object_or_404(PartnerMember, user=self.request.user)
        self.queryset = self.queryset.filter(pinned__partner=member.partner)

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
            return Response("data", status=statuses.HTTP_201_CREATED)
        elif pin is False and len(eoi_ids) > 0:
            Pin.objects.filter(eoi_id__in=eoi_ids, partner=partner, pinned_by=request.user).delete()
            return Response(status=statuses.HTTP_204_NO_CONTENT)
        else:
            return Response(
                {"error": self.ERROR_MSG_WRONG_PARAMS},
                status=statuses.HTTP_400_BAD_REQUEST
            )

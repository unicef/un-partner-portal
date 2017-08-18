# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListAPIView

import django_filters.rest_framework

from common.consts import EOI_TYPES
from common.paginations import SmallPagination
from common.permissions import IsAuthenticated, IsAtLeastMemberReader
from partner.models import PartnerMember
from .models import EOI
from .serializers import BaseProjectSerializer
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

    def make_custom_queryset(self):
        member = get_object_or_404(PartnerMember, user=self.request.user)
        self.queryset = self.queryset.filter(pinned__partner=member.partner)

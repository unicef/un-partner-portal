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
    permission_classes = (IsAuthenticated, IsAtLeastMemberReader)
    queryset = EOI.objects.prefetch_related("specializations", "agency", "pinned")
    serializer_class = BaseProjectSerializer
    pagination_class = SmallPagination
    filter_backends = (django_filters.rest_framework.DjangoFilterBackend, )
    filter_class = BaseProjectFilter


class OpenProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting Call of Expression of Interest.
    """

    def get_queryset(self):
        return self.queryset.filter(display_type=EOI_TYPES.open)


class DirectProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting Call of Expression of Interest.
    """

    def get_queryset(self):
        return self.queryset.filter(display_type=EOI_TYPES.direct)


class PinProjectAPIView(BaseProjectAPIView):
    """
    Endpoint for getting Call of Expression of Interest.
    """

    def get_queryset(self):
        member = get_object_or_404(PartnerMember, user=self.request.user)
        return self.queryset.filter(pinned__partner=member.partner)

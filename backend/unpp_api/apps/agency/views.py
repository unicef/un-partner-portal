# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from rest_framework.generics import ListAPIView

from common.paginations import SmallPagination
from .serializers import AgencySerializer
from .models import Agency


class AgencyListAPIView(ListAPIView):
    """
    Retreiving All Agencies in the system
    """
    serializer_class = AgencySerializer
    pagination_class = SmallPagination
    queryset = Agency.objects.all()

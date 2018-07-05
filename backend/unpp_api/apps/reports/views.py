from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView

from agency.permissions import AgencyPermission
from common.pagination import SmallPagination
from common.permissions import HasUNPPPermission
from partner.models import Partner
from reports.filters import PartnerProfileReportFilter
from reports.serializers import PartnerProfileReportSerializer


class PartnerProfileReportAPIView(ListAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
            ]
        ),
    )

    filter_backends = (DjangoFilterBackend,)
    filter_class = PartnerProfileReportFilter
    queryset = Partner.objects.filter(is_locked=False)
    serializer_class = PartnerProfileReportSerializer
    pagination_class = SmallPagination

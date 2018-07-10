from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView

from agency.permissions import AgencyPermission
from common.pagination import SmallPagination
from common.permissions import HasUNPPPermission
from partner.models import Partner
from project.models import EOI
from reports.filters import PartnerProfileReportFilter, ProjectReportFilter
from reports.serializers import PartnerProfileReportSerializer, ProjectReportSerializer


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


class ProjectReportAPIView(ListAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.CSO_LIST_AND_DETAIL_VIEW,
            ]
        ),
    )

    filter_backends = (DjangoFilterBackend,)
    filter_class = ProjectReportFilter
    queryset = EOI.objects.filter(is_published=True)
    serializer_class = ProjectReportSerializer
    pagination_class = SmallPagination

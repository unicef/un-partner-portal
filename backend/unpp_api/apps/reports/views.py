from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.generics import ListAPIView

from agency.permissions import AgencyPermission
from common.pagination import SmallPagination
from common.permissions import HasUNPPPermission
from partner.models import Partner
from project.models import EOI
from reports.exports.excel.partner_contact_info import PartnerContactInformationXLSLExporter
from reports.exports.excel.partner_profile_report import PartnerProfileReportXLSLExporter
from reports.exports.excel.partner_verifications_observations import PartnerVerificationsObservationsReportXLSLExporter
from reports.exports.excel.project_details import ProjectDetailsXLSLExporter
from reports.filters import PartnerReportFilter, ProjectReportFilter
from reports.serializers import (
    PartnerProfileReportSerializer,
    ProjectReportSerializer,
    VerificationsAndObservationsReportSerializer,
)


class PartnerProfileReportAPIView(ListAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.RUN_REPORT_CSO_PROFILE,
                AgencyPermission.RUN_REPORT_CSO_MAPPING,
                AgencyPermission.RUN_REPORT_CSO_CONTACT,
            ]
        ),
    )

    filter_backends = (DjangoFilterBackend,)
    filter_class = PartnerReportFilter
    queryset = Partner.objects.filter(is_locked=False)
    serializer_class = PartnerProfileReportSerializer
    pagination_class = SmallPagination


class PartnerProfileReportXLSXReportAPIView(PartnerProfileReportAPIView):

    def get(self, request, *args, **kwargs):
        return PartnerProfileReportXLSLExporter(self.filter_queryset(self.get_queryset())).get_as_response()


class PartnerContactInformationReportXLSXReportAPIView(PartnerProfileReportAPIView):

    def get(self, request, *args, **kwargs):
        return PartnerContactInformationXLSLExporter(self.filter_queryset(self.get_queryset())).get_as_response()


class ProjectReportAPIView(ListAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.RUN_REPORT_CFEI_MANAGEMENT,
            ]
        ),
    )

    filter_backends = (DjangoFilterBackend,)
    filter_class = ProjectReportFilter
    queryset = EOI.objects.filter(is_published=True)
    serializer_class = ProjectReportSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        return super(ProjectReportAPIView, self).get_queryset().filter(agency=self.request.user.agency)


class ProjectDetailsXLSXReportAPIView(ProjectReportAPIView):

    def get(self, request, *args, **kwargs):
        return ProjectDetailsXLSLExporter(self.filter_queryset(self.get_queryset())).get_as_response()


class VerificationsAndObservationsReportAPIView(ListAPIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[
                AgencyPermission.RUN_REPORT_VERIFICATION_AND_FLAGGING,
            ]
        ),
    )

    filter_backends = (DjangoFilterBackend,)
    filter_class = PartnerReportFilter
    queryset = Partner.objects.filter(is_locked=False)
    serializer_class = VerificationsAndObservationsReportSerializer
    pagination_class = SmallPagination


class PartnerVerificationsObservationsXLSXReportAPIView(ProjectReportAPIView):

    def get(self, request, *args, **kwargs):
        return PartnerVerificationsObservationsReportXLSLExporter(
            self.filter_queryset(self.get_queryset())
        ).get_as_response()

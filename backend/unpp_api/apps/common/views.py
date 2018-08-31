from __future__ import absolute_import

from collections import defaultdict

from django.db import connections
from django.db.migrations.recorder import MigrationRecorder
from rest_framework import status as statuses
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from agency.agencies import UNHCR
from agency.permissions import AgencyPermission
from agency.roles import AgencyRole
from common.business_areas import BUSINESS_AREAS
from common.permissions import current_user_has_permission
from common.serializers import (
    ConfigSectorSerializer,
    CommonFileUploadSerializer,
    AdminLevel1Serializer
)
from common.models import Sector, CommonFile, AdminLevel1
from common.countries import COUNTRIES_ALPHA2_CODE_DICT, LOCATION_OPTIONAL_COUNTRIES
from common.pagination import MediumPagination
from common.consts import (
    STAFF_GLOBALLY_CHOICES,
    PARTNER_DONORS_CHOICES,
    WORKING_LANGUAGES_CHOICES,
    CONCERN_CHOICES,
    AUDIT_TYPES,
    FORMAL_CAPACITY_ASSESSMENT,
    PARTNER_TYPES,
    YEARS_OF_EXP_CHOICES,
    BUDGET_CHOICES,
    METHOD_ACC_ADOPTED_CHOICES,
    FINANCIAL_CONTROL_SYSTEM_CHOICES,
    FUNCTIONAL_RESPONSIBILITY_CHOICES,
    POLICY_AREA_CHOICES,
    APPLICATION_STATUSES,
    COMPLETED_REASON,
    DIRECT_SELECTION_SOURCE,
    JUSTIFICATION_FOR_DIRECT_SELECTION,
    EXTENDED_APPLICATION_STATUSES,
    DSR_FINALIZE_RETENTION_CHOICES,
    FLAG_TYPES,
    NOTIFICATION_FREQUENCY_CHOICES,
    USER_CREATED_FLAG_CATEGORIES,
    UNHCR_DSR_COMPLETED_REASONS,
    OTHER_AGENCIES_DSR_COMPLETED_REASONS,
    CFEI_TYPES,
    CFEI_STATUSES,
)
from partner.roles import PartnerRole


class AppliedMigrationsAPIView(APIView):

    def get(self, request, *args, **kwargs):
        migrations = MigrationRecorder(connection=connections['default']).applied_migrations()
        results = defaultdict(list)
        for app_label, migration in migrations:
            results[app_label].append(migration)

        return Response(dict(results), status=statuses.HTTP_200_OK)


class ConfigCountriesAPIView(APIView):

    def get(self, request, *args, **kwargs):
        """
        Return list of defined countries in backend.
        """
        return Response(COUNTRIES_ALPHA2_CODE_DICT, status=statuses.HTTP_200_OK)


class ConfigAdminLevel1ListAPIView(ListAPIView):
    serializer_class = AdminLevel1Serializer
    filter_backends = (DjangoFilterBackend, SearchFilter)
    queryset = AdminLevel1.objects.all()
    filter_fields = ('country_code', )
    search_fields = ('name', )
    pagination_class = MediumPagination


class GeneralConfigAPIView(APIView):

    def get(self, request, *args, **kwargs):
        if self.request.active_partner:
            choices = dict(PartnerRole.get_choices())
        elif self.request.agency_member:
            choices = dict(AgencyRole.get_choices(self.request.user.agency))
        else:
            choices = {}

        if self.request.agency_member and self.request.user.agency.name == UNHCR.name:
            dsr_completed_reason_choices = UNHCR_DSR_COMPLETED_REASONS
        else:
            dsr_completed_reason_choices = OTHER_AGENCIES_DSR_COMPLETED_REASONS

        flag_type_choices = dict(FLAG_TYPES).copy()
        if not current_user_has_permission(request, agency_permissions=[
            AgencyPermission.ADD_RED_FLAG_ALL_CSO_PROFILES,
        ]):
            flag_type_choices.pop(FLAG_TYPES.red)
        else:
            flag_type_choices.pop(FLAG_TYPES.escalated)

        data = {
            "financial-control-system": FINANCIAL_CONTROL_SYSTEM_CHOICES,
            "functional-responsibilities": FUNCTIONAL_RESPONSIBILITY_CHOICES,
            "partner-donors": PARTNER_DONORS_CHOICES,
            "working-languages": WORKING_LANGUAGES_CHOICES,
            "population-of-concern": CONCERN_CHOICES,
            "audit-types": AUDIT_TYPES,
            "formal-capacity-assessment": FORMAL_CAPACITY_ASSESSMENT,
            "partner-type": PARTNER_TYPES,
            "staff-globaly-choices": STAFF_GLOBALLY_CHOICES,
            "years-of-exp-choices": YEARS_OF_EXP_CHOICES,
            "budget-choices": BUDGET_CHOICES,
            "method-acc-adopted-choices": METHOD_ACC_ADOPTED_CHOICES,
            "financial-control-system-choices": FINANCIAL_CONTROL_SYSTEM_CHOICES,
            "functional-responsibility-choices": FUNCTIONAL_RESPONSIBILITY_CHOICES,
            "policy-area-choices": POLICY_AREA_CHOICES,
            "application-statuses": APPLICATION_STATUSES,
            "completed-reason": COMPLETED_REASON,
            "direct-selection-completed-reason": dsr_completed_reason_choices,
            "direct-selection-source": DIRECT_SELECTION_SOURCE,
            "direct-selection-retention": DSR_FINALIZE_RETENTION_CHOICES,
            "direct-justifications": JUSTIFICATION_FOR_DIRECT_SELECTION,
            "extended-application-statuses": EXTENDED_APPLICATION_STATUSES,
            "countries-with-optional-location": LOCATION_OPTIONAL_COUNTRIES,
            "user-role-choices": choices,
            "flag-type-choices": flag_type_choices,
            "flag-types": FLAG_TYPES,
            "flag-category-choices": USER_CREATED_FLAG_CATEGORIES,
            "notification-frequency-choices": NOTIFICATION_FREQUENCY_CHOICES,
            "cfei-types": CFEI_TYPES,
            "cfei-statuses": CFEI_STATUSES,
            "business-areas": BUSINESS_AREAS,
        }
        return Response(data, status=statuses.HTTP_200_OK)


class ConfigSectorsAPIView(APIView):

    def get(self, request, *args, **kwargs):
        """
        Return list of defined Sector & Specialization in backend.
        """
        data = ConfigSectorSerializer(Sector.objects.all(), many=True).data
        return Response(data, status=statuses.HTTP_200_OK)


class CommonFileCreateAPIView(CreateAPIView):
    """
    Create Common File
    """
    permission_classes = (IsAuthenticated, )
    queryset = CommonFile.objects.all()
    serializer_class = CommonFileUploadSerializer

from django.http import Http404
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, get_object_or_404, DestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from agency.permissions import AgencyPermission
from common.permissions import current_user_has_permission, HasUNPPPermission
from externals.models import PartnerVendorNumber
from externals.serializers import PartnerVendorNumberSerializer
from externals.sources.unhcr import UNHCRInfoClient


class PartnerVendorNumberAPIView(CreateAPIView, RetrieveUpdateAPIView, DestroyAPIView):

    serializer_class = PartnerVendorNumberSerializer
    queryset = PartnerVendorNumber.objects.all()
    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[]
        ),
    )

    def get_queryset(self):
        queryset = super(PartnerVendorNumberAPIView, self).get_queryset()
        if not self.request.method == 'GET':
            current_user_has_permission(self.request, agency_permissions=[
                AgencyPermission.ERP_ENTER_VENDOR_NUMBER,
            ], raise_exception=True)
            queryset = queryset.filter(agency=self.request.user.agency)

        return queryset


class PartnerExternalDetailsAPIView(APIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[],
            partner_permissions=[],
        ),
    )
    provider_for_agency = {
        'UNHCR': UNHCRInfoClient,
    }

    def get_queryset(self):
        queryset = PartnerVendorNumber.objects.all()
        if not self.request.agency_member:
            queryset = queryset.filter(partner=self.request.active_partner)

        return queryset

    def get(self, request, *args, **kwargs):
        vendor_number = get_object_or_404(
            self.get_queryset(), partner_id=kwargs['partner_id'], agency_id=kwargs['agency_id']
        )
        provider = self.provider_for_agency.get(vendor_number.agency.name)
        if not provider:
            raise Http404
        return Response({
            'tables': provider().get_tables(vendor_number.number)
        })

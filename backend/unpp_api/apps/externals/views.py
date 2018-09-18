from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, get_object_or_404, DestroyAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied, NotFound

from agency.agencies import UNICEF
from agency.permissions import AgencyPermission
from common.permissions import current_user_has_permission, HasUNPPPermission
from externals.models import PartnerVendorNumber, UNICEFVendorData
from externals.serializers import PartnerVendorNumberSerializer
from externals.sources.unhcr import UNHCRInfoClient
from externals.sources.unicef import UNICEFInfoClient
from externals.sources.wfp import WFPPartnerInfoClient


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

    def perform_create(self, serializer):
        partner = serializer.validated_data['partner']
        user_country = self.request.agency_member.office.country
        if not partner.country_code == user_country.code:
            raise PermissionDenied(
                f'You\'re currently logged in under {user_country.name}, '
                'you cannot add Vendor Numbers outside of that country.'
            )
        serializer.save()


class PartnerExternalDetailsAPIView(APIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[],
            partner_permissions=[],
        ),
    )
    provider_for_agency = {
        'UNHCR': UNHCRInfoClient,
        'UNICEF': UNICEFInfoClient,
        'WFP': WFPPartnerInfoClient,
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
            raise NotFound

        return Response({
            'tables': provider().get_tables(vendor_number),
        })


class PartnerBasicInfoAPIView(APIView):

    permission_classes = (
        HasUNPPPermission(
            agency_permissions=[],
        ),
    )

    def get(self, request, *args, **kwargs):
        if not request.user.agency == UNICEF.model_instance:
            raise NotFound('Your agency doesn\'t support basic partner info lookup.')

        vendor_number = request.GET.get('vendor_number')
        if not vendor_number:
            raise NotFound

        filter_kwargs = {
            'vendor_number': vendor_number
        }
        if 'business_area' in request.GET:
            filter_kwargs['business_area'] = request.GET['business_area']

        vendor_data: UNICEFVendorData = UNICEFVendorData.objects.filter(**filter_kwargs).first()
        if not vendor_data:
            raise NotFound

        return Response({
            'partner_name': vendor_data.vendor_name
        })

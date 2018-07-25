from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView

from agency.permissions import AgencyPermission
from common.permissions import current_user_has_permission, HasUNPPPermission
from externals.models import PartnerVendorNumber
from externals.serializers import PartnerVendorNumberSerializer


class PartnerVendorNumberAPIView(CreateAPIView, RetrieveUpdateAPIView):

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

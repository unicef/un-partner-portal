from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.generics import ListAPIView, RetrieveAPIView

from common.consts import CFEI_TYPES
from common.pagination import SmallPagination
from project.exports.pdf.cfei import CFEIPDFExporter
from project.models import EOI
from public.serializers import PublicProjectSerializer


class OpenProjectPDEFExportAPIView(RetrieveAPIView):
    permission_classes = ()
    queryset = EOI.objects.filter(is_published=True, is_completed=False, display_type=CFEI_TYPES.open)

    @method_decorator(cache_page(60 * 60 * 1))
    def retrieve(self, request, *args, **kwargs):
        return CFEIPDFExporter(self.get_object()).get_as_response()


class OpenProjectListAPIView(ListAPIView):
    permission_classes = ()
    queryset = EOI.objects.filter(
        is_published=True, is_completed=False, display_type=CFEI_TYPES.open
    ).select_related("agency").prefetch_related(
        "specializations", "specializations__category", "locations", "locations__admin_level_1"
    )
    serializer_class = PublicProjectSerializer
    pagination_class = SmallPagination

    def get_queryset(self):
        return super(OpenProjectListAPIView, self).get_queryset().filter(deadline_date__gte=timezone.now().date())

    @method_decorator(cache_page(60 * 60 * 1))
    def list(self, *args, **kwargs):
        return super(OpenProjectListAPIView, self).list(*args, **kwargs)

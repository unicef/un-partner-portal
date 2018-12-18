from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.generics import ListAPIView, RetrieveAPIView

from common.pagination import SmallPagination
from project.exports.pdf.cfei import CFEIPDFExporter
from project.models import EOI
from public.serializers import PublicProjectSerializer


class OpenProjectPDEFExportAPIView(RetrieveAPIView):
    permission_classes = ()
    queryset = EOI.objects.filter(is_published=True, is_completed=False)

    @method_decorator(cache_page(60 * 60 * 1))
    def retrieve(self, request, *args, **kwargs):
        return CFEIPDFExporter(self.get_object()).get_as_response()


class OpenProjectListAPIView(ListAPIView):
    permission_classes = ()
    queryset = EOI.objects.filter(
        is_published=True, is_completed=False
    ).select_related("agency").prefetch_related(
        "specializations", "specializations__category", "locations", "locations__admin_level_1"
    )
    serializer_class = PublicProjectSerializer
    pagination_class = SmallPagination

    @method_decorator(cache_page(60 * 60 * 1))
    def list(self, *args, **kwargs):
        return super(OpenProjectListAPIView, self).list(*args, **kwargs)

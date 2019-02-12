import hashlib

import os
import tempfile

from background_task import background
from django.http import HttpResponse
from django.utils import timezone
from django.utils.module_loading import import_string
from rest_framework import status

from common.excel import AutoWidthWorkBook

MAX_EXPORT_SIZE = 100
ASYNC_EXPORT_SIZE_THRESHOLD = 10


def full_classpath(obj):
    module = obj.__class__.__module__
    if module is None or module == str.__class__.__module__:
        return obj.__class__.__name__  # Avoid reporting __builtin__
    else:
        return module + '.' + obj.__class__.__name__


@background(schedule=5)
def export_task(exporter_class_name, model_class_name, ids, send_to):
    exporter_class = import_string(exporter_class_name)
    model_class = import_string(model_class_name)

    queryset = model_class.objects.filter(id__in=ids)

    exporter = exporter_class(queryset, to_file=True)
    filepath = exporter.get_as_file()
    print(filepath)


export_task = export_task.now  # DEBUG


class BaseXLSXExporter:

    def __init__(self, queryset, to_file=False):
        self.queryset = queryset

        if to_file:
            temp_filename = hashlib.sha256(';'.join([str(p.pk) for p in queryset]).encode('utf-8')).hexdigest()
            self.file_path = os.path.join(tempfile.gettempdir(), temp_filename + '.xlsx')
            write_to = self.file_path
        else:
            self.response = HttpResponse(
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            write_to = self.response

        self.workbook = AutoWidthWorkBook(
            write_to,
            {
                'in_memory': not to_file,
                'default_date_format': 'dd/mm/yy'
            }
        )

    def get_display_name(self):
        return '{} Objects UNPP Export'.format(self.queryset.count())

    def fill_worksheet(self):
        raise NotImplementedError

    def get_as_response(self, request):
        print(full_classpath(self))
        print(self.queryset.model)
        module = import_string(full_classpath(self))
        print(module)

        object_count = self.queryset.count()
        if object_count > MAX_EXPORT_SIZE:
            return HttpResponse(
                'Too many objects selected for export. Use filters to narrow down the search.',
                status=status.HTTP_400_BAD_REQUEST
            )
        elif object_count > MAX_EXPORT_SIZE:
            export_task =

            # TODO: trigger async task
            return HttpResponse(
                f'Report is being generated. Will be sent to {request.user.email} once it\'s completed.',
                status=status.HTTP_202_ACCEPTED
            )
        else:

            self.fill_worksheet()
            self.response['Content-Disposition'] = 'attachment; filename="{}"'.format(
                f"[{timezone.now().strftime('%H.%M.%S %d %b %Y')}] {self.get_display_name()}.xlsx"
            )
            return self.response

    def get_as_file(self):
        self.fill_worksheet()
        return self.file_path

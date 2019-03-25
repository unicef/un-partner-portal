import hashlib
import os
import tempfile

from background_task import background
from django.apps import apps
from django.core.mail import EmailMessage
from django.http import HttpResponse
from django.utils.module_loading import import_string
from rest_framework import status
from rest_framework.response import Response

from common.excel import AutoWidthWorkBook


def full_classpath(obj):
    module = obj.__class__.__module__
    if module is None or module == str.__class__.__module__:
        return obj.__class__.__name__  # Avoid reporting __builtin__
    else:
        return module + '.' + obj.__class__.__name__


@background(schedule=5)
def export_task(exporter_class_name, model_path, ids, send_to):
    exporter_class = import_string(exporter_class_name)
    model_class = apps.get_model(model_path)

    queryset = model_class.objects.filter(id__in=ids)

    exporter = exporter_class(queryset, to_file=True)
    filepath = exporter.get_as_file()

    subject = 'Your UN Partner Portal Report'
    message = f'Attached you\'ll find the requested UNPP Report: "{exporter.get_display_name()}"'
    to = [send_to]
    mail = EmailMessage(
        subject,
        message,
        to=to,
    )

    mail.attach_file(filepath)
    mail.send()


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
        export_task(
            full_classpath(self),
            f'{self.queryset.model._meta.app_label}.{self.queryset.model._meta.model_name}',
            list(self.queryset.values_list('id', flat=True)),
            request.user.email
        )

        return Response(
            data=[f'Report is being generated. Will be sent to {request.user.email} once it\'s completed.'],
            status=status.HTTP_202_ACCEPTED
        )

    def get_as_file(self):
        self.fill_worksheet()
        self.workbook.close()
        return self.file_path

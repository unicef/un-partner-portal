import hashlib

import os
import tempfile

from django.http import HttpResponse
from django.utils import timezone

from common.excel import AutoWidthWorkBook


class BaseXLSXExporter:

    def __init__(self, queryset):
        self.queryset = queryset
        temp_filename = hashlib.sha256(';'.join([str(p.pk) for p in queryset]).encode('utf-8')).hexdigest()
        self.file_path = os.path.join(tempfile.gettempdir(), temp_filename + '.xlsx')
        self.response = HttpResponse(
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        self.workbook = AutoWidthWorkBook(self.response, {'in_memory': True})

    def get_display_name(self):
        return '{} Objects UNPP Export'.format(self.queryset.count())

    def fill_worksheet(self):
        raise NotImplementedError

    def get_as_response(self):
        self.fill_worksheet()
        self.response['Content-Disposition'] = 'attachment; filename="{}"'.format(
            f"[{timezone.now().strftime('%H.%M.%S %d %b %Y')}] {self.get_display_name()}.xlsx"
        )
        return self.response

from collections import defaultdict

from xlsxwriter import Workbook
from xlsxwriter.worksheet import Worksheet


class AutoWidthWorkSheet(Worksheet):

    max_col_widths = defaultdict(int)
    _wrap_format = None

    def write(self, row, col, *args):
        if args and args[0]:
            try:
                column_format = None
                if "\n" in args[0]:
                    column_format = self._wrap_format
                    column_width = max(map(len, args[0].split('\n')))
                else:
                    column_width = len(args[0])

                self.max_col_widths[col] = max(self.max_col_widths[col], column_width)
                self.set_column(col, col, self.max_col_widths[col], column_format)
            except Exception:
                pass
        return super(AutoWidthWorkSheet, self).write(row, col, *args)


class AutoWidthWorkBook(Workbook):

    worksheet_class = AutoWidthWorkSheet

    def add_worksheet(self, *args, **kwargs):
        worksheet = super(AutoWidthWorkBook, self).add_worksheet(*args, **kwargs)
        worksheet._wrap_format = self.add_format({'text_wrap': True})
        return worksheet

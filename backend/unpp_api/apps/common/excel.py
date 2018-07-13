from collections import defaultdict

from xlsxwriter import Workbook
from xlsxwriter.worksheet import Worksheet


class AutoWidthWorkSheet(Worksheet):

    max_col_widths = defaultdict(int)

    def write(self, row, col, *args):
        if args and args[0]:
            try:
                self.max_col_widths[col] = max(self.max_col_widths[col], len(args[0]))
                self.set_column(col, col, self.max_col_widths[col])
            except Exception:
                pass
        return super(AutoWidthWorkSheet, self).write(row, col, *args)


class AutoWidthWorkBook(Workbook):

    worksheet_class = AutoWidthWorkSheet

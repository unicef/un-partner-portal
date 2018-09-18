from urllib import parse

from django.db.models.constants import LOOKUP_SEP
from django_filters import CharFilter


class CommaSeparatedListFilter(CharFilter):
    separator = ','
    choices = None

    def __init__(self, lookup_expr='in', separator=None, choices=None, *args, **kwargs):
        self.separator = self.separator or separator
        self.choices = choices
        super(CharFilter, self).__init__(*args, lookup_expr=lookup_expr, **kwargs)

    def filter(self, qs, value):
        value = parse.unquote(value).split(self.separator)
        filter_function = None
        if self.choices:
            def filter_function(val):
                return val in self.choices

        value = list(filter(filter_function, value))
        # __in filtering over relationships can results in duplicate entries
        if LOOKUP_SEP in self.name:
            self.distinct = True

        return super(CommaSeparatedListFilter, self).filter(qs, value)

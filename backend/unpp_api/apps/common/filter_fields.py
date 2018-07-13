from urllib import parse

from django.db.models.constants import LOOKUP_SEP
from django_filters import CharFilter


class CommaSeparatedListFilter(CharFilter):
    separator = ','

    def __init__(self, lookup_expr='in', separator=None, *args, **kwargs):
        if separator:
            self.separator = separator
        super(CharFilter, self).__init__(*args, lookup_expr=lookup_expr, **kwargs)

    def filter(self, qs, value):
        value = parse.unquote(value).split(self.separator)
        value = list(filter(lambda x: x.isdigit(), value))
        qs = super(CommaSeparatedListFilter, self).filter(qs, value)

        # __in filtering over relationships can results in duplicate entries
        if LOOKUP_SEP in self.name:
            qs = qs.distinct()

        return qs

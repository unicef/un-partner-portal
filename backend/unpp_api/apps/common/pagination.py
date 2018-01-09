from rest_framework.pagination import PageNumberPagination


class BasePagination(PageNumberPagination):
    page_size_query_param = 'page_size'


class TinyResultSetPagination(BasePagination):
    page_size = 5


class SmallPagination(BasePagination):
    page_size = 10
    max_page_size = 100


class MediumPagination(BasePagination):
    page_size = 20
    max_page_size = 100

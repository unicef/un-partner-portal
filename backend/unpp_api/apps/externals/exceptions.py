from rest_framework.exceptions import APIException
from rest_framework import status


class ServiceUnavailable(APIException):
    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    default_detail = '3rd party service didn\'t return a proper response'
    default_code = 'service_unavailable'

import logging

from rest_framework.generics import ListCreateAPIView
from common.permissions import IsAuthenticated
from common.paginations import SmallPagination

from .serializers import SimpleAccountSerializer
from .models import User

logger = logging.getLogger(__name__)


class AccountListCreateAPIView(ListCreateAPIView):

    serializer_class = SimpleAccountSerializer
    permission_classes = (IsAuthenticated, )
    pagination_class = SmallPagination

    # TODO we can add latter filters to get right part of users (partners, agencies)

    def get_queryset(self, *args, **kwargs):
        return User.objects.all()

    # def post(self, request, *args, **kwargs):
    #     """
    #     Create on ClusterObjective model
    #     :return: ClusterObjective object id
    #     """
    #     serializer = ClusterObjectiveSerializer(data=self.request.data)
    #
    #     if not serializer.is_valid():
    #         return Response(serializer.errors, status=statuses.HTTP_400_BAD_REQUEST)
    #
    #     serializer.save()
    #     return Response({'id': serializer.instance.id}, status=statuses.HTTP_201_CREATED)

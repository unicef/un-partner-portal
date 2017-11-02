import logging
from rest_framework.permissions import BasePermission

logger = logging.getLogger(__name__)


class IsNotifiedOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.notified.filter(recipient=request.user).exists()

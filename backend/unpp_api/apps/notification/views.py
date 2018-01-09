# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import get_object_or_404
from rest_framework import status as statuses
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from common.pagination import MediumPagination
from .serializers import NotifiedUserSerializer, NotificationSerializer, NotifiedSerializer
from .models import NotifiedUser, Notification
from .permissions import IsNotifiedOwner


class NotificationsAPIView(ListAPIView):

    permission_classes = (IsAuthenticated, )
    serializer_class = NotifiedUserSerializer
    pagination_class = MediumPagination

    def get_queryset(self):
        return NotifiedUser.objects.select_related("notification").filter(recipient=self.request.user, did_read=False)

    def patch(self, request, *args, **kwargs):
        serializer = NotifiedSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=statuses.HTTP_400_BAD_REQUEST)

        if serializer.data['mark_all_as_read']:
            count = NotifiedUser.objects.filter(recipient=self.request.user,
                                                did_read=False).update(did_read=True)
            msg = "Marked as read ({}) objects.".format(count)
        else:
            msg = "No objects marked as read."
        return Response(msg)


class NotificationAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated, IsNotifiedOwner)
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()

    def patch(self, request, pk, *args, **kwargs):
        notified = get_object_or_404(
            NotifiedUser.objects.select_related('notification'),
            notification_id=pk,
            recipient=request.user
        )
        if 'did_read' in request.data and request.data['did_read'] and notified.did_read is False:
            notified.did_read = True
            notified.save()
        serializer = self.get_serializer(notified.notification)
        return Response(serializer.data)

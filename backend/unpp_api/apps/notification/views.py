# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from rest_framework import status as statuses
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import NotifiedUserSerializer, NotificationSerializer, NotifiedSerializer
from .models import NotifiedUser, Notification
from .permissions import IsNotifiedOwner


class NotificationsAPIView(ListAPIView):

    permission_classes = (IsAuthenticated, )
    serializer_class = NotifiedUserSerializer

    def get_queryset(self):
        return NotifiedUser.objects.filter(recipient=self.request.user)

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

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        notified = instance.notified.filter(recipient=self.request.user).get()  # one notified per user
        if notified.did_read is False:
            notified.did_read = True
            notified.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

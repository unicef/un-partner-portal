# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.shortcuts import get_object_or_404
from rest_framework import status as statuses
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
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


class NotificationAPIView(RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated, IsNotifiedOwner)
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()

    def get_object(self):
        obj = get_object_or_404(self.get_queryset(), pk=self.kwargs["pk"])
        self.check_object_permissions(self.request, obj)
        notified = obj.notified.filter(recipient=self.request.user).get()  # one notified per user
        if notified.did_read is False:
            notified.did_read = True
            notified.save()
        return obj

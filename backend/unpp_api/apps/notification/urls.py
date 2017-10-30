from django.conf.urls import url

from .views import (
    NotificationsAPIView,
    NotificationAPIView,
)


urlpatterns = [
    url(r'^$', NotificationsAPIView.as_view(), name="notifications"),
    url(r'^(?P<pk>\d+)/$', NotificationAPIView.as_view(), name="notification"),
]

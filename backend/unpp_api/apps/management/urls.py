from django.conf.urls import url

from management.views import (
    UserViewSet,
)


urlpatterns = [
    url(r'^users/$', UserViewSet.as_view(), name="user-list"),
    url(r'^user/$', UserViewSet.as_view(), name="user-add"),
    url(r'^user/(?P<pk>\d+)/$', UserViewSet.as_view(), name="user-details"),
]

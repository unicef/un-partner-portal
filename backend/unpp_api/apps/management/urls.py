from django.conf.urls import url

from management.views import (
    UserViewSet,
    OfficeListView,
)


urlpatterns = [
    url(r'^offices/$', OfficeListView.as_view(), name="office-list"),

    url(r'^users/$', UserViewSet.as_view(), name="user-list"),
    url(r'^user/$', UserViewSet.as_view(), name="user-add"),
    url(r'^user/(?P<pk>\d+)/$', UserViewSet.as_view(), name="user-details"),
]

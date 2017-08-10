from django.conf.urls import url

from .views import (
    AccountListCreateAPIView,
)


urlpatterns = [
    url(r'^$', AccountListCreateAPIView.as_view(), name="account-list"),
]

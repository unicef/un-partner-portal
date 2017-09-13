from django.conf.urls import url

from .views import (
    OpenProjectAPIView,
    DirectProjectAPIView,
    PinProjectAPIView,
    UpdateProjectAPIView,
)


urlpatterns = [
    url(r'^(?P<pk>\d+)/update/$', UpdateProjectAPIView.as_view(), name="update"),
    url(r'^open/$', OpenProjectAPIView.as_view(), name="open"),
    url(r'^direct/$', DirectProjectAPIView.as_view(), name="direct"),
    url(r'^pins/$', PinProjectAPIView.as_view(), name="pins"),
]

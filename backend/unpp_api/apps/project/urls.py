from django.conf.urls import url

from .views import (
    OpenProjectAPIView,
    DirectProjectAPIView,
    PinProjectAPIView,
)


urlpatterns = [
    url(r'^open/$', OpenProjectAPIView.as_view(), name="open"),
    url(r'^direct/$', DirectProjectAPIView.as_view(), name="direct"),
    url(r'^pins/$', PinProjectAPIView.as_view(), name="pins"),
]

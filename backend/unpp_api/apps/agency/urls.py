from django.conf.urls import url

from .views import AgencyListAPIView

urlpatterns = [
    url(r'^$', AgencyListAPIView.as_view(), name="agencies"),
]

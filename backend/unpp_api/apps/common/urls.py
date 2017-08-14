from django.conf.urls import url

from .views import (
    CountiresListAPIView,
)


urlpatterns = [
    url(r'^countries$', CountiresListAPIView.as_view(), name="countries$"),

]

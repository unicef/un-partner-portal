from django.conf.urls import url

from .views import AccountRegisterAPIView


urlpatterns = [
    url(r'^registration$', AccountRegisterAPIView.as_view(), name="registration"),
]

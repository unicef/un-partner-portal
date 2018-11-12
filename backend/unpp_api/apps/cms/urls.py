from django.conf.urls import url

from .views import AboutPage, LandingPage, PartnerPage, RegistrationPage

urlpatterns = [
    url(r'^$', LandingPage.as_view(), name='landing'),
    url(r'^about/$', AboutPage.as_view(), name='about'),
    url(r'^partner/$', PartnerPage.as_view(), name='partner'),
    url(r'^registration/$', RegistrationPage.as_view(), name='registration'),
]

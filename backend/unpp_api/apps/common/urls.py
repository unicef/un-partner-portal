from django.conf.urls import url

from .views import (
    ConfigCountriesAPIView,
    ConfigAdminLevel1ListAPIView,
    GeneralConfigAPIView,
    ConfigSectorsAPIView,
    CommonFileCreateAPIView,
    AppliedMigrationsAPIView,
)


urlpatterns = [
    url(r'^countries/$', ConfigCountriesAPIView.as_view(), name="countries"),
    url(r'^admin-levels/$', ConfigAdminLevel1ListAPIView.as_view(), name="admin-levels"),
    url(r'^general/$', GeneralConfigAPIView.as_view(), name="general-config"),
    url(r'^sectors/$', ConfigSectorsAPIView.as_view(), name="sectors"),

    url(r'^applied-migrations/$', AppliedMigrationsAPIView.as_view(), name="applied-migrations"),

    url(r'^file/$', CommonFileCreateAPIView.as_view(), name="file"),
]

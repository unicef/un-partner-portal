from django.conf.urls import url

from public.views import OpenProjectListAPIView, OpenProjectPDEFExportAPIView


urlpatterns = [
    url(r'^export/projects/(?P<pk>\d+)/$', OpenProjectPDEFExportAPIView.as_view(), name="project-export"),
    url(r'^projects/$', OpenProjectListAPIView.as_view(), name="project-listing"),
]

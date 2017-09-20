from __future__ import absolute_import

from django.conf.urls import url, include
from django.conf import settings
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


urlpatterns = [
    url(r'^api/admin/', include(admin.site.urls)),
    url(r'^api/accounts/', include('account.urls', namespace='accounts')),
    url(r'^api/config/', include('common.urls', namespace='config')),
    url(r'^api/projects/', include('project.urls', namespace='projects')),
    url(r'^api/partners/', include('partner.urls', namespace='partners')),
]

if settings.IS_DEV or settings.IS_STAGING:
    from rest_framework_swagger.views import get_swagger_view
    schema_view = get_swagger_view(title='Swagger API')
    urlpatterns += [
        url(r'^api/doc/', schema_view),
    ]

urlpatterns += staticfiles_urlpatterns('/api/static/')

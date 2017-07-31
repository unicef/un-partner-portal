from __future__ import absolute_import

from django.conf.urls import url, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.defaults import page_not_found, server_error

urlpatterns = [
    url(r'api/^', include('marketing.urls')),
    url(r'^api/accounts/', include('accounts.urls')),
    url(r'^api/accounts/', include('allauth.urls')),
    url(r'^api/admin/', include(admin.site.urls)),
    # url(r'^robots.txt$', include('robots.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()

if settings.DEBUG:
    urlpatterns += [
        url(r'^404/$', page_not_found),
        url(r'^500/$', server_error)
    ]

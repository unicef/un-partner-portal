from __future__ import absolute_import

from django.conf.urls import url, include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns


def test_raise_exception_view(request):
    raise Exception('Testing Error Reporting')


urlpatterns = [
    url(r'^api/admin/', include(admin.site.urls)),
    url(r'^api/accounts/', include('account.urls', namespace='accounts')),
    url(r'^api/config/', include('common.urls', namespace='config')),
    url(r'^api/common/', include('common.urls', namespace='common')),
    url(r'^api/projects/', include('project.urls', namespace='projects')),
    url(r'^api/agencies/', include('agency.urls', namespace='agencies')),
    url(r'^api/partners/', include('partner.urls', namespace='partners')),
    url(r'^api/partners/', include('review.urls', namespace='partner-reviews')),
    url(r'^api/manage/', include('management.urls', namespace='management')),
    url(r'^api/notifications/', include('notification.urls', namespace='notifications')),
    url(r'^api/dashboard/', include('dashboard.urls', namespace='dashboard')),
    url(r'^api/reports/', include('reports.urls', namespace='reports')),
    url(r'^api/externals/', include('externals.urls', namespace='externals')),
    url(r'^api/rest-auth/', include('rest_auth.urls')),
    url(r'^api/test-raise-exception/', test_raise_exception_view),
    url(r'^api/social/', include('social_django.urls', namespace='social')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.IS_DEV or settings.IS_STAGING:
    from rest_framework_swagger.views import get_swagger_view
    schema_view = get_swagger_view(title='Swagger API')
    urlpatterns += [
        url(r'^api/doc/', schema_view),
    ]

urlpatterns += staticfiles_urlpatterns()

from django.contrib import admin
from django.apps import apps


legacy_models = apps.get_app_config('legacy').get_models()
for legacy_model in legacy_models:
    admin.site.register(legacy_model)

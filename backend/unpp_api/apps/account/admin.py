# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib import admin
from django.utils.html import format_html
from django.core.urlresolvers import reverse
from django.core.exceptions import PermissionDenied
from django.template import RequestContext
from django.shortcuts import render_to_response

from .models import (
    User,
    UserProfile,
)


def get_link_a_href(url_name, core_text, uri_add='', pk=None):
    if pk:
        url = reverse(url_name, args=(pk,))
    else:
        url = reverse(url_name)
    return format_html('<a href="{}{}">{}</a>', url, uri_add, core_text)


class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', )
    list_filter = ('is_superuser', 'is_staff', 'is_active', )
    search_fields = ('email', 'username', )
    fields = ('username', 'first_name', 'last_name', 'email', 'generate_new_password', 'is_superuser', 'is_staff',
              'is_active', 'last_login', 'date_joined', 'groups', 'user_permissions')
    readonly_fields = ('generate_new_password', )

    def generate_new_password(self, instance):
        uri_add = 'generate_new_password/%s/' % instance.pk
        return get_link_a_href(
            'admin:password_change',
            'click here to generate new password',
            uri_add
        )
    generate_new_password.allow_tags = True
    generate_new_password.short_description = 'Generate new passwrod'


    @staticmethod
    def __generate_new_password(request, **kwargs):
        result = ''

        try:
            instance_id = kwargs.get('id')
            user = User.objects.get(pk=instance_id)
        except User.DoesNotExist:
            user = None

        perm = 'adminsite.generate_new_password'
        if not (user and (request.user.is_superuser or
                request.user.has_perm(perm))):
            raise PermissionDenied()

        if user and request.POST.get('confirm') == 'on':
            if request.POST.get('new_password') == request.POST.get('new_password_2'):
                user.set_password(request.POST.get('new_password'))

        return render_to_response(
            'admin/account/user/generate_new_password.html',
            {
                'user': user,
                'result': result
            },
            context_instance=RequestContext(request)
        )


admin.site.register(User, UserAdmin)
admin.site.register(UserProfile)

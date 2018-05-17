from rest_framework import serializers


class CurrentAgencyFilteredPKField(serializers.PrimaryKeyRelatedField):

    def get_queryset(self):
        queryset = super(CurrentAgencyFilteredPKField, self).get_queryset()
        request = self.context.get('request')
        if request and queryset:
            queryset = queryset.filter(agency=request.user.agency)
        return queryset

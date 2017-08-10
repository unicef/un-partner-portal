from rest_framework import serializers

from .models import User


class SimpleAccountSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'last_name',
            'username',
            'email',
            'date_joined',
        )

from rest_framework import serializers

from sanctionslist.models import SanctionedNameMatch


class SanctionedNameMatchSerializer(serializers.ModelSerializer):

    sanctioned_type = serializers.CharField(source='name.item.sanctioned_type', read_only=True)
    sanctioned_type_display = serializers.CharField(source='name.item.get_sanctioned_type_display', read_only=True)
    match_type_display = serializers.CharField(source='get_match_type_display', read_only=True)

    class Meta:
        model = SanctionedNameMatch
        exclude = (
            'partner',
            'can_ignore',
            'can_ignore_text',
        )

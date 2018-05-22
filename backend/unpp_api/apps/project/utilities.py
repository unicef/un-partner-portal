from rest_framework import serializers

from account.models import User
from agency.roles import VALID_FOCAL_POINT_ROLE_NAMES
from notification.helpers import send_notification_to_cfei_focal_points


def update_cfei_focal_points(cfei, user_ids):
    if user_ids is None:
        return

    user_count = User.objects.filter(agency_members__role__in=VALID_FOCAL_POINT_ROLE_NAMES, id__in=user_ids).count()
    if not user_count == len(set(user_ids)):
        raise serializers.ValidationError(
            'Some of the indicated focal point user(s) do not have necessary permissions'
        )
    cfei.focal_points.through.objects.exclude(user_id__in=user_ids).delete()
    cfei.focal_points.add(*User.objects.filter(id__in=user_ids))
    send_notification_to_cfei_focal_points(cfei)

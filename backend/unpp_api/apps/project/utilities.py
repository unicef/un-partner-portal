from rest_framework import serializers

from account.models import User
from agency.roles import VALID_FOCAL_POINT_ROLE_NAMES, VALID_REVIEWER_ROLE_NAMES
from common.consts import CFEI_STATUSES
from notification.helpers import send_notification_to_cfei_focal_points
from project.models import Assessment


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


def update_cfei_reviewers(cfei, user_ids):
    if user_ids is None:
        return

    if cfei.status not in {CFEI_STATUSES.closed, CFEI_STATUSES.open}:
        raise serializers.ValidationError(
            f'You cannot manage reviewers on a {dict(CFEI_STATUSES)[cfei.status]} CFEI'
        )

    user_count = User.objects.filter(agency_members__role__in=VALID_REVIEWER_ROLE_NAMES, id__in=user_ids).count()
    if not user_count == len(set(user_ids)):
        raise serializers.ValidationError(
            'Some of the indicated reviewer user(s) do not have necessary permissions'
        )
    cfei.reviewers.through.objects.exclude(user_id__in=user_ids).delete()
    cfei.reviewers.add(*User.objects.filter(id__in=user_ids))
    send_notification_to_cfei_focal_points(cfei)

    cfei_assessments = Assessment.objects.filter(application__eoi=cfei)
    cfei_assessments.exclude(reviewer_id__in=user_ids).update(archived=True)
    cfei_assessments.filter(reviewer_id__in=user_ids).update(archived=False)

from rest_framework import serializers

from account.models import User
from agency.roles import VALID_FOCAL_POINT_ROLE_NAMES, VALID_REVIEWER_ROLE_NAMES
from common.consts import CFEI_STATUSES
from notification.helpers import send_notification_to_cfei_focal_points
from project.models import Assessment


def _users_valid_for_agency(cfei, user_ids):
    user_agencies = set(User.objects.filter(id__in=user_ids).values_list(
        'agency_members__office__agency_id', flat=True
    ))

    if user_ids and not len(user_agencies) == 1 or not user_agencies.pop() == cfei.agency_id:
        return False
    return True


def update_cfei_focal_points(eoi, user_ids):
    try:
        user_ids = list(map(int, user_ids))
    except (TypeError, ValueError):
        return

    if user_ids is None:
        return
    elif not user_ids:
        raise serializers.ValidationError({
            'focal_points': 'At least one focal point is needed.'
        })

    if not _users_valid_for_agency(eoi, user_ids):
        raise serializers.ValidationError(
            'Some of the indicated focal point user(s) belong to another agency'
        )

    user_count = User.objects.filter(agency_members__role__in=VALID_FOCAL_POINT_ROLE_NAMES, id__in=user_ids).count()
    if not user_count == len(set(user_ids)):
        raise serializers.ValidationError(
            'Some of the indicated focal point user(s) do not have necessary permissions'
        )
    eoi.focal_points.through.objects.filter(eoi_id=eoi.id).exclude(user_id__in=user_ids).delete()
    eoi.focal_points.add(*User.objects.filter(id__in=user_ids))
    send_notification_to_cfei_focal_points(eoi)


def update_cfei_reviewers(eoi, user_ids):
    try:
        user_ids = list(map(int, user_ids))
    except (TypeError, ValueError):
        return

    if user_ids is None:
        return
    elif not user_ids:
        raise serializers.ValidationError({
            'reviewers': 'At least one reviewer is needed.'
        })

    if eoi.status not in {CFEI_STATUSES.closed, CFEI_STATUSES.open}:
        raise serializers.ValidationError(
            f'You cannot manage reviewers on a {dict(CFEI_STATUSES)[eoi.status]} CFEI'
        )

    if eoi.sent_for_decision:
        raise serializers.ValidationError(
            'You cannot manage reviewers after CFEI has been sent for decision making.'
        )

    if eoi.contains_recommended_applications:
        raise serializers.ValidationError(
            'Reviewers cannot be edited after an application has been recommended.'
        )

    if not _users_valid_for_agency(eoi, user_ids):
        raise serializers.ValidationError(
            'Some of the indicated reviewer user(s) belong to another agency'
        )

    user_count = User.objects.filter(agency_members__role__in=VALID_REVIEWER_ROLE_NAMES, id__in=user_ids).count()
    if not user_count == len(set(user_ids)):
        raise serializers.ValidationError(
            'Some of the indicated reviewer user(s) do not have necessary permissions'
        )
    eoi.reviewers.through.objects.filter(eoi_id=eoi.id).exclude(user_id__in=user_ids).delete()
    eoi.reviewers.add(*User.objects.filter(id__in=user_ids))

    cfei_assessments = Assessment.objects.filter(application__eoi=eoi)
    cfei_assessments.exclude(reviewer_id__in=user_ids).update(archived=True)
    cfei_assessments.filter(reviewer_id__in=user_ids).update(archived=False)

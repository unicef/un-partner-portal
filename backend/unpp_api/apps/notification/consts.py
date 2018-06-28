
class NotificationType(object):
    # TODO: Investigate usage and replace references + improve naming
    ACTIVE_ACCOUNT_PROFILE_CREATE = 'account_active_profile_create'
    ACTIVE_ACCOUNT_SEND_TO_ORG_HEAD = 'account_active_send_to_org_head'
    DUPLICATE_ORGANIZATION_ACCOUNT = 'account_org_duplicate'
    ACCOUNT_REJECTED_BY_SANCTIONS = 'account_reject_sanctions'
    ACCOUNT_REJECTED = 'account_create_reject'
    CFEI_CANCELLED = 'cfei_cancel'
    CFEI_APPLICATION_LOSS = 'cfei_application_lost'
    CFEI_APPLICATION_WITHDRAWN = 'cfei_application_withdraw'
    CFEI_APPLICATION_WIN = 'cfei_application_selected'
    CFEI_APPLICATION_SUBMITTED = 'cfei_application_submitted'
    UNSOLICITED_CONCEPT_NOTE_RECEIVED = 'unsol_application_submitted'
    DIRECT_SELECTION_INITIATED = 'direct_select_un_int'
    DIRECT_SELECTION_FROM_NOTE_INITIATED = 'direct_select_ucn'
    CFEI_INVITE = 'cfei_invitation'
    CFEI_DEADLINE_UPDATE = 'cfei_update_prev'
    SELECTED_AS_CFEI_REVIEWER = 'agency_cfei_reviewers_selected'
    CFEI_REVIEW_REQUIRED = 'cfei_review_required'
    PARTNER_DECISION_MADE = 'agency_application_decision_make'
    ADDED_AS_CFEI_FOCAL_POINT = 'added_as_cfei_local_point'
    DJANGO_ADMIN_NEW_PARTNER_FOR_DELETION = 'superadmin_new_cso_for_deletion'
    NEW_ESCALATED_FLAG = 'new_escalated_flag'

    @classmethod
    def get_choices(cls):
        return [
            (getattr(cls, name), name) for name in dir(cls) if name.isupper()
        ]


NOTIFICATION_DATA = {
    NotificationType.ACTIVE_ACCOUNT_PROFILE_CREATE: {
        'template_name': 'account_approval_activated_create_profile',
        'subject': ''
    },
    NotificationType.ACTIVE_ACCOUNT_SEND_TO_ORG_HEAD: {
        'template_name': 'account_approval_activated_sent_to_head_org',
        'subject': ''
    },
    NotificationType.DUPLICATE_ORGANIZATION_ACCOUNT: {
        'template_name': 'account_approval_rejection_application_duplicate',
        'subject': ''
    },
    NotificationType.ACCOUNT_REJECTED_BY_SANCTIONS: {
        'template_name': 'account_approval_rejection_sanctions_list',
        'subject': ''
    },
    NotificationType.ACCOUNT_REJECTED: {
        'template_name': 'account_creation_rejection',
        'subject': ''
    },
    NotificationType.CFEI_CANCELLED: {
        'template_name': 'cancel_CFEI',
        'subject': 'Call for Expression of Interest Canceled'
    },
    NotificationType.CFEI_APPLICATION_LOSS: {
        'template_name': 'CN_Assessment_not_successful',
        'subject': 'Application Not Selected'
    },
    NotificationType.CFEI_APPLICATION_WITHDRAWN: {
        'template_name': 'CN_Assessment_Withdraw',
        'subject': 'Application Withdrawn'
    },
    NotificationType.CFEI_APPLICATION_WIN: {
        'template_name': 'CN_Assessment_successful',
        'subject': 'Application Selected'
    },
    NotificationType.CFEI_APPLICATION_SUBMITTED: {
        'template_name': 'CN_Submission',
        'subject': 'Application Received'
    },
    NotificationType.UNSOLICITED_CONCEPT_NOTE_RECEIVED: {
        'template_name': 'CN_Unsolicited',
        'subject': 'Unsolicited Concept Note Received'
    },
    NotificationType.DIRECT_SELECTION_INITIATED: {
        'template_name': 'direct_selection_UN_initiated',
        'subject': 'UN has identified your organization for a partnership opportunity via direct selection / retention'
    },
    NotificationType.DIRECT_SELECTION_FROM_NOTE_INITIATED: {
        'template_name': 'direct_selection_via_UCN',
        'subject': 'UN has identified your organization for a partnership opportunity via direct selection on'
                   ' the basis of an unsolicited concept note'
    },
    NotificationType.CFEI_INVITE: {
        'template_name': 'New_CFEI_Inviting',
        'subject': 'UN New Partnership Opportunity'
    },
    NotificationType.CFEI_DEADLINE_UPDATE: {
        'template_name': 'Update_CFEI_prev_invited_submited_app',
        'subject': 'CFEI Deadline Updated'
    },
    NotificationType.SELECTED_AS_CFEI_REVIEWER: {
        'template_name': 'agency_reviewer_selection',
        'subject': 'You have been selected as a reviewer'
    },
    NotificationType.PARTNER_DECISION_MADE: {
        'template_name': 'agency_decision_selected_partner',
        'subject': 'Prospective Partner Decision Made'
    },
    NotificationType.CFEI_REVIEW_REQUIRED: {
        'template_name': 'CFEI_review_required',
        'subject': 'Your CFEI review is required'
    },
    NotificationType.ADDED_AS_CFEI_FOCAL_POINT: {
        'template_name': 'added_as_cfei_local_point',
        'subject': 'You have been added as a CFEI focal point'
    },
    NotificationType.DJANGO_ADMIN_NEW_PARTNER_FOR_DELETION: {
        'template_name': 'superadmin_new_csos_for_deletion',
        'subject': 'CSO Profile Marked for deletion'
    },
    NotificationType.NEW_ESCALATED_FLAG: {
        'template_name': 'new_escalated_flag',
        'subject': 'CSO Profile Flagged'
    },
}

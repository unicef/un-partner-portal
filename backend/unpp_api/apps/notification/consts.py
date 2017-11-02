
NOTIFICATION_KINDS = {

    'account_active_profile_create': {
            'template_name': 'account_approval_activated_create_profile',
            'subject': ''
    },
    'account_active_send_to_org_head': {
            'template_name': 'account_approval_activated_sent_to_head_org',
            'subject': ''
    },
    'account_org_duplicate': {
            'template_name': 'account_approval_rejection_application_duplicate',
            'subject': ''
    },

    'account_reject_sanctions': {
            'template_name': 'account_approval_rejection_sanctions_list',
            'subject': ''
    },

    'account_create_reject': {
            'template_name': 'account_creation_rejection',
            'subject': ''
    },

    'cfei_cancel': {
            'template_name': 'cancel_CFEI',
            'subject': 'Call for Expression of Interest Canceled'
    },

    'cfei_application_lost': {
            'template_name': 'cn_assessment_not_successful',
            'subject': 'Application Not Selected'
    },

    'cfei_application_withdraw': {
            'template_name': 'CN_Assessment_Withdraw',
            'subject': 'Application Withdrawn'
    },

    'cfei_application_selected': {
            'template_name': 'CN_Assessment_successful',
            'subject': 'Application Selected'
    },
    'cfei_application_submitted': {
            'template_name': 'CN_Submission',
            'subject': 'Application Received'
    },
    'unsol_application_submitted': {
            'template_name': 'CN_Unsolicited',
            'subject': 'Unsolicited Concept Note Received'
    },

    'direct_select_un_int': {
            'template_name': 'direct_selection_UN_initiated',
            'subject': 'UN has identified your organization for a partnership opportunity via direct selection'
    },

    'direct_select_ucn': {
            'template_name': 'direct_selection_via_UCN',
            'subject': 'UN has identified your organization for a partnership opportunity via direct selection on the basis of an unsolicited concept note'
    },

    'cfei_invitation': {
            'template_name': 'New_CFEI_Inviting',
            'subject': 'UN New Partnership Opportunity'
    },

    'cfei_update_prev': {
            'template_name': 'Update_CFEI_prev_invited_submited_app',
            'subject': 'CFEI Deadline Updated'
    },
    'agency_cfei_reviewers_selected': {
            'template_name': 'agency_reviewer_selection',
            'subject': 'You have been selected as a reviewe'
    },
    'agency_application_decision_make': {
            'template_name': 'agency_decision_selected_partner',
            'subject': 'Prospective Partner Decision Made'
    },
}

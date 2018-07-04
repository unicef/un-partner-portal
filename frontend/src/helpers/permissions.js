import R from 'ramda';

export const checkPermission = (permission, state) =>
  R.contains(permission, state.session.permissions);

export const isRoleOffice = (role, state) =>
  role === state.session.officeRole;

export const AGENCY_ROLES = {
  ADMINISTRATOR: 'Administrator',
  HQ_EDITOR: 'HQ Editor',
  READER: 'Reader',
  EDITOR_BASIC: 'Basic Editor',
  EDITOR_ADVANCED: 'Advanced Editor',
  PAM_USER: 'PAM USER',
  MFT_USER: 'MFT USER',
};

export const PARTNER_PERMISSIONS = {
  REGISTER: 'REGISTER',
  /* DONE */ VIEW_DASHBOARD: 'VIEW_DASHBOARD',
  /* DONE */ CREATE_COUNTRY_OFFICE: 'CREATE_COUNTRY_OFFICE',

  EDIT_PROFILE: 'EDIT_PROFILE',
  EDIT_HQ_PROFILE: 'EDIT_HQ_PROFILE',

  // Applications
  /* DONE */ CFEI_VIEW: 'CFEI_VIEW', // ALL USERS HAVE ACCESS
  /* DONE */ CFEI_PINNING: 'CFEI_PINNING',
  CFEI_SEND_CLARIFICATION_REQUEST: 'CFEI_SEND_CLARIFICATION_REQUEST',
  /* DONE */ CFEI_SUBMIT_CONCEPT_NOTE: 'CFEI_SUBMIT_CONCEPT_NOTE',
  /* DONE */ CFEI_VIEW_CONCEPT_NOTE: 'CFEI_VIEW_CONCEPT_NOTE', // ALL USERS HAVE ACCESS
  /* DONE */ CFEI_ANSWER_SELECTION: 'CFEI_ANSWER_SELECTION',

  // Unsolicited Concept Notes
  /* DONE */ UCN_VIEW: 'UCN_VIEW', // ALL USERS HAVE ACCESS
  /* DONE */ UCN_DRAFT: 'UCN_DRAFT',
  /* DONE */ UCN_EDIT: 'UCN_EDIT',
  /* DONE */ UCN_SUBMIT: 'UCN_SUBMIT',
  /* DONE */ UCN_DELETE: 'UCN_DELETE',

  // Direct Selection and Retention
  /* DONE */ DSR_VIEW: 'DSR_VIEW', // ALL USERS HAVE ACCESS
  /* DONE */ DSR_ANSWER: 'DSR_ANSWER',
};

export const AGENCY_PERMISSIONS = {
  // User Management
  RESET_CSO_USER_PASSWORD: 'RESET_CSO_USER_PASSWORD',

  // General
  /* DONE */ CSO_LIST_AND_DETAIL_VIEW: 'CSO_LIST_AND_DETAIL_VIEW', // ALL USERS HAVE ACCESS

  // Create Draft CFEI for Own Agency
  /* DONE */ CFEI_DRAFT_CREATE: 'CFEI_DRAFT_CREATE',
  /* DONE */ CFEI_DRAFT_MANAGE: 'CFEI_DRAFT_MANAGE', // # Save, edit, delete, manage CSO's, focal points - if is the creator
  /* DONE */ CFEI_DRAFT_SEND_TO_FOCAL_POINT_TO_PUBLISH: 'CFEI_DRAFT_SEND_TO_FOCAL_POINT_TO_PUBLISH', // If is the creator

  // Publish Draft CFEI for Own Agency
  /* DONE */ CFEI_SENT_EDIT: 'CFEI_SENT_EDIT', // If creator / focal point
  /* DONE */ CFEI_SENT_INVITE_CSO: 'CFEI_SENT_INVITE_CSO', // If creator / focal point
  /* DONE */ CFEI_SENT_PUBLISH: 'CFEI_SENT_PUBLISH', // If focal point
  /* DONE */ CFEI_PUBLISH: 'CFEI_PUBLISH', // If creator

  // Modify Published CFEI for Own Agency
  /* DONE */ CFEI_PUBLISHED_VIEW_AND_ANSWER_CLARIFICATION_QUESTIONS: 'CFEI_PUBLISHED_VIEW_AND_ANSWER_CLARIFICATION_QUESTIONS', // If creator / focal point
  /* DONE */ CFEI_PUBLISHED_EDIT_DATES: 'CFEI_PUBLISHED_EDIT_DATES', // If creator / focal point
  /* DONE */ CFEI_PUBLISHED_INVITE_CSO: 'CFEI_PUBLISHED_INVITE_CSO', // If creator / focal point
  /* DONE */ CFEI_PUBLISHED_CANCEL: 'CFEI_PUBLISHED_CANCEL', // If creator / focal point


  // Assess Applications Submitted for CFEI Published by Own Agency
  /* DONE */ CFEI_MANAGE_REVIEWERS: 'CFEI_MANAGE_REVIEWERS', // If creator / focal point
  /* DONE */ CFEI_VIEW_APPLICATIONS: 'CFEI_VIEW_APPLICATIONS', // If creator / focal point
  /* DONE */ CFEI_PRESELECT_APPLICATIONS: 'CFEI_PRESELECT_APPLICATIONS', // If creator / focal point
  /* DONE */ CFEI_REVIEW_APPLICATIONS: 'CFEI_REVIEW_APPLICATIONS', // If creator / focal point
  /* DONE */ CFEI_VIEW_ALL_REVIEWS: 'CFEI_VIEW_ALL_REVIEWS', // If creator / focal point
  /* DONE */ CFEI_ADD_REVIEW_SUMMARY: 'CFEI_ADD_REVIEW_SUMMARY', // If creator / focal point
  /* DONE */ CFEI_RECOMMEND_PARTNER_FOR_SELECTION: 'CFEI_RECOMMEND_PARTNER_FOR_SELECTION', // If creator / focal point

  // Approve Partner Selection for CFEI Published by Own Agency
  /* DONE */ CFEI_SELECT_RECOMMENDED_PARTNER: 'CFEI_SELECT_RECOMMENDED_PARTNER', // If focal point
  /* DONE */ CFEI_SELECT_PARTNER: 'CFEI_SELECT_PARTNER', // If creator
  /* DONE */ CFEI_DESELECT_PARTNER: 'CFEI_DESELECT_PARTNER', // If creator / focal point

  // Finalize CFEI Published by Own agency
  /* DONE */ CFEI_FINALIZE: 'CFEI_FINALIZE', // If creator / focal point
  CFEI_FINALIZED_VIEW_ALL_REVIEWS: 'CFEI_FINALIZED_VIEW_ALL_REVIEWS', // If creator / focal point / reviewer
  /* DONE */ CFEI_FINALIZED_VIEW_WINNER_AND_CN: 'CFEI_FINALIZED_VIEW_WINNER_AND_CN', // View results tab of finalized CFEI for all agencies: Selected CSO & CN
  /* DONE */ CFEI_FINALIZED_VIEW_ALL_INFO: 'CFEI_FINALIZED_VIEW_ALL_INFO',

  // Direct Selection/Retention

  /* DONE */ CFEI_DIRECT_CREATE_DRAFT_MANAGE_FOCAL_POINTS: 'CFEI_DIRECT_CREATE_DRAFT_MANAGE_FOCAL_POINTS',
  /* DONE */ CFEI_DIRECT_VIEW_OVERVIEW_WITH_JUSTIFICATION: 'CFEI_DIRECT_VIEW_OVERVIEW_WITH_JUSTIFICATION',
  /* DONE */ CFEI_DIRECT_INDICATE_CSO: 'CFEI_DIRECT_INDICATE_CSO',
  /* DONE */ CFEI_DIRECT_SAVE_DRAFT: 'CFEI_DIRECT_SAVE_DRAFT',
  /* DONE */ CFEI_DIRECT_EDIT_DRAFT: 'CFEI_DIRECT_EDIT_DRAFT',
  /* DONE */ CFEI_DIRECT_DELETE_DRAFT: 'CFEI_DIRECT_DELETE_DRAFT',
  /* DONE */ CFEI_DIRECT_SEND_DRAFT_TO_FOCAL_POINT: 'CFEI_DIRECT_SEND_DRAFT_TO_FOCAL_POINT',
  /* DONE */ CFEI_DIRECT_EDIT_SENT: 'CFEI_DIRECT_EDIT_SENT',
  /* DONE */ CFEI_DIRECT_PUBLISH: 'CFEI_DIRECT_PUBLISH',
  /* DONE */ CFEI_DIRECT_EDIT_PUBLISHED: 'CFEI_DIRECT_EDIT_PUBLISHED',
  /* DONE */ CFEI_DIRECT_CANCEL: 'CFEI_DIRECT_CANCEL',

  // Sanctions check
  REVIEW_AND_MARK_SANCTIONS_MATCHES: 'REVIEW_AND_MARK_SANCTIONS_MATCHES',

  // Conduct Verification
  /* DONE */ VERIFY_INGO_HQ: 'VERIFY_INGO_HQ',
  /* DONE */ VERIFY_CSOS_GLOBALLY: 'VERIFY_CSOS_GLOBALLY',
  /* DONE */ VERIFY_CSOS_FOR_OWN_COUNTRY: 'VERIFY_CSOS_FOR_OWN_COUNTRY',
  VERIFY_SEE_COMMENTS: 'VERIFY_SEE_COMMENTS',

  // View Observation & risk flags
  VIEW_PROFILE_OBSERVATION_FLAG_COUNT: 'VIEW_PROFILE_OBSERVATION_FLAG_COUNT', // done TODO: remove observation tab
  VIEW_PROFILE_OBSERVATION_FLAG_COMMENTS: 'VIEW_PROFILE_OBSERVATION_FLAG_COMMENTS',

  // Add Observation & risk flags all
  /* DONE */ RESOLVE_ESCALATED_FLAG_ALL_CSO_PROFILES: 'RESOLVE_ESCALATED_FLAG_ALL_CSO_PROFILES',
  /* DONE */ ADD_FLAG_OBSERVATION_ALL_CSO_PROFILES: 'ADD_FLAG_OBSERVATION_ALL_CSO_PROFILES',
  /* DONE */ ADD_FLAG_OBSERVATION_COUNTRY_CSO_PROFILES: 'ADD_FLAG_OBSERVATION_COUNTRY_CSO_PROFILES', // Users country must match CSOs country

  // Reports
  RUN_REPORT_CSO_PROFILE: 'RUN_REPORT_CSO_PROFILE',
  RUN_REPORT_CSO_MAPPING: 'RUN_REPORT_CSO_MAPPING',
  RUN_REPORT_CSO_CONTACT: 'RUN_REPORT_CSO_CONTACT',
  RUN_REPORT_CFEI_MANAGEMENT: 'RUN_REPORT_CFEI_MANAGEMENT',
  RUN_REPORT_VERIFICATION_AND_FLAGGING: 'RUN_REPORT_VERIFICATION_AND_FLAGGING',

  // ERP
  ERP_ENTER_VENDOR_NUMBER: 'ERP_ENTER_VENDOR_NUMBER',
};

export const COMMON_PERMISSIONS = {
  /* DONE */ MANAGE_USERS: 'MANAGE_USERS',
  /* DONE */ RECEIVE_NOTIFICATIONS: 'RECEIVE_NOTIFICATIONS',
  /* DONE */ CFEI_FINALIZE: 'CFEI_FINALIZE', // DONE  FOR DSR
  /* DONE */ VIEW_DASHBOARD: 'VIEW_DASHBOARD', // ALL USERS HAVE ACCESS
  /* DONE */ CFEI_VIEW: 'CFEI_VIEW', // ALL USERS HAVE ACCESS
};

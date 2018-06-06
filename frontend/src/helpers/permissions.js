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
  // Applications
  /* DONE */ CFEI_PINNING: 'CFEI_PINNING',
  CFEI_SEND_CLARIFICATION_REQUEST: 'CFEI_SEND_CLARIFICATION_REQUEST', // TODO
  CFEI_SUBMIT_CONCEPT_NOTE: 'CFEI_SUBMIT_CONCEPT_NOTE', // DONE
  CFEI_ANSWER_SELECTION: 'CFEI_ANSWER_SELECTION',
  UCN_VIEW: 'UCN_VIEW', // ALL USERS HAVE ACCESS

  UCN_DRAFT: 'UCN_DRAFT',
  UCN_SAVE: 'UCN_SAVE',
  UCN_SUBMIT: 'UCN_SUBMIT',
  UCN_DELETE: 'UCN_DELETE',
  DSR_VIEW: 'DSR_VIEW',
  DSR_ANSWER: 'DSR_ANSWER',

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
  CFEI_PUBLISHED_SEE_CLARIFICATION_QUESTIONS: 'CFEI_PUBLISHED_SEE_CLARIFICATION_QUESTIONS', // If creator / focal point
  CFEI_PUBLISHED_ANSWER_CLARIFICATION_QUESTIONS: 'CFEI_PUBLISHED_ANSWER_CLARIFICATION_QUESTIONS', // If creator / focal point
  CFEI_PUBLISHED_EDIT_DATES: 'CFEI_PUBLISHED_EDIT_DATES', // If creator / focal point
  /* DONE */ CFEI_PUBLISHED_INVITE_CSO: 'CFEI_PUBLISHED_INVITE_CSO', // If creator / focal point
  CFEI_PUBLISHED_CANCEL: 'CFEI_PUBLISHED_CANCEL', // If creator / focal point

  // Assess Applications Submitted for CFEI Published by Own Agency
  CFEI_MANAGE_REVIEWERS: 'CFEI_MANAGE_REVIEWERS', // If creator / focal point
  CFEI_VIEW_APPLICATIONS: 'CFEI_VIEW_APPLICATIONS', // If creator / focal point
  CFEI_PRESELECT_APPLICATIONS: 'CFEI_PRESELECT_APPLICATIONS', // If creator / focal point
  CFEI_ASSES_PRESELECTED_APPLICATIONS: 'CFEI_ASSES_PRESELECTED_APPLICATIONS', // If creator / focal point
  CFEI_VIEW_MY_ASSESSMENT: 'CFEI_VIEW_MY_ASSESSMENT', // If creator / focal point
  CFEI_EDIT_MY_ASSESSMENT: 'CFEI_EDIT_MY_ASSESSMENT', // If creator / focal point
  CFEI_VIEW_ALL_ASSESSMENTS: 'CFEI_VIEW_ALL_ASSESSMENTS', // If creator / focal point
  CFEI_EDIT_ALL_ASSESSMENTS: 'CFEI_EDIT_ALL_ASSESSMENTS', // If creator / focal point
  CFEI_ADD_REVIEW_SUMMARY: 'CFEI_ADD_REVIEW_SUMMARY', // If creator / focal point
  CFEI_RECOMMEND_PARTNER_FOR_SELECTION: 'CFEI_RECOMMEND_PARTNER_FOR_SELECTION', // If creator / focal point

  // Direct Selection & Retention

  /* DONE */ CFEI_DIRECT_CREATE_DRAFT_MANAGE_FOCAL_POINTS: 'CFEI_DIRECT_CREATE_DRAFT_MANAGE_FOCAL_POINTS',
  CFEI_DIRECT_VIEW_OVERVIEW_WITH_JUSTIFICATION: 'CFEI_DIRECT_VIEW_OVERVIEW_WITH_JUSTIFICATION',
  CFEI_DIRECT_INDICATE_CSO: 'CFEI_DIRECT_INDICATE_CSO',
  CFEI_DIRECT_SAVE_DRAFT: 'CFEI_DIRECT_SAVE_DRAFT',
  /* DONE */ CFEI_DIRECT_EDIT_DRAFT: 'CFEI_DIRECT_EDIT_DRAFT',
  /* DONE */ CFEI_DIRECT_DELETE_DRAFT: 'CFEI_DIRECT_DELETE_DRAFT',
  /* DONE */ CFEI_DIRECT_SEND_DRAFT_TO_FOCAL_POINT: 'CFEI_DIRECT_SEND_DRAFT_TO_FOCAL_POINT',
  /* DONE */ CFEI_DIRECT_EDIT_SENT: 'CFEI_DIRECT_EDIT_SENT',
  /* DONE */ CFEI_DIRECT_PUBLISH: 'CFEI_DIRECT_PUBLISH',
  /* DONE */ CFEI_DIRECT_EDIT_PUBLISHED: 'CFEI_DIRECT_EDIT_PUBLISHED',
  /* DONE */ CFEI_DIRECT_CANCEL: 'CFEI_DIRECT_CANCEL',
};

export const COMMON_PERMISSIONS = {
  /* DONE */ MANAGE_USERS: 'MANAGE_USERS',
  /* DONE */ RECEIVE_NOTIFICATIONS: 'RECEIVE_NOTIFICATIONS',
  /* DONE */ CFEI_FINALIZE: 'CFEI_FINALIZE', // DONE  FOR DSR
  /* DONE */ VIEW_DASHBOARD: 'VIEW_DASHBOARD', // ALL USERS HAVE ACCESS
  /* DONE */ CFEI_VIEW: 'CFEI_VIEW', // ALL USERS HAVE ACCESS
};

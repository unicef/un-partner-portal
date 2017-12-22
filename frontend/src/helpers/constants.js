
// roles 
export const ROLES = {
  AGENCY: 'agency',
  PARTNER: 'partner',
};

// project types
export const PROJECT_TYPES = {
  OPEN: 'open',
  PINNED: 'pinned',
  DIRECT: 'direct',
  UNSOLICITED: 'unsolicited',
};

// project details items
export const DETAILS_ITEMS = {
  OVERVIEW: 'overview',
  FEEDBACK: 'feedback',
  SUBMISSION: 'submission',
  RESULTS: 'results',
  PRESELECTED: 'preselected',
  APPLICATIONS: 'applications',
  RESPONSE: 'response',
};

export const APPLICATION_STATUSES = {
  PRE: 'Pre',
  REJ: 'Rej',
  PEN: 'Pen',
};

export const SESSION_STATUS = {
  INITIAL: 'initial',
  CHANGING: 'changing',
  READY: 'ready',
};

export const AGENCY_MEMBERS_POSITIONS = {
  ADMIN: 'Administrator',
  EDITOR: 'Editor',
  READER: 'Reader',
};

// duplicates of above, but incoming role changes will not be symmetrical
export const PARTNER_MEMBERS_POSITIONS = {
  ADMIN: 'Administrator',
  EDITOR: 'Editor',
  READER: 'Reader',
};

export const PROJECT_STATUSES = {
  OPE: 'Ope',
  CLO: 'Clo',
  COM: 'Com',
};

export const FLAGS = {
  YELLOW: 'Yel',
  RED: 'Red',
};

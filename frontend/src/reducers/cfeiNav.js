
import { SESSION_READY } from './session';
import { PARTNER, AGENCY, filterItems } from './nav';
import { PROJECT_TYPES } from '../helpers/constants';

const initialState = [
  { id: 0, path: PROJECT_TYPES.OPEN, label: 'Overview', roles: [PARTNER] },
  { id: 1, path: PROJECT_TYPES.PINNED, label: 'Pinned', roles: [PARTNER] },
  { id: 0, path: PROJECT_TYPES.OPEN, label: 'Calls for expressions of interest', roles: [AGENCY] },
  { id: 1, path: PROJECT_TYPES.DIRECT, label: 'Direct Selection/Retention', roles: [AGENCY] },
  { id: 2, path: PROJECT_TYPES.UNSOLICITED, label: 'Unsolicited Concept Notes', roles: [AGENCY] },
];

export default function cfeiNavReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_READY: {
      return filterItems(initialState, action.getState().session.role);
    }
    default:
      return state;
  }
}

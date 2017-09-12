
import { SESSION_INIT } from './session';
import { PARTNER, AGENCY, filterItems } from './nav';
import { PROJECT_TYPES } from '../helpers/constants';

const initialState = [
  { id: 0, path: PROJECT_TYPES.OPEN, label: 'Overview', roles: [PARTNER] },
  { id: 1, path: PROJECT_TYPES.PINNED, label: 'Pinned', roles: [PARTNER] },
  { id: 0, path: PROJECT_TYPES.OPEN, label: 'Calls for expression of interest', roles: [AGENCY] },
  { id: 1, path: PROJECT_TYPES.DIRECT, label: 'Direct Selections', roles: [AGENCY] },
  { id: 2, path: PROJECT_TYPES.UNSOLICITED, label: 'Unsolicited Concept Notes', roles: [AGENCY] },
];

export default function cfeiNavReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return filterItems(state, action.session.role);
    }
    default:
      return state;
  }
}

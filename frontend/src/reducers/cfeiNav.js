
import { SESSION_INIT } from './session';
import { PARTNER, AGENCY, filterItems } from './nav';

const initialState = [
  { id: 0, path: 'open', label: 'Overview', roles: [PARTNER] },
  { id: 1, path: 'pinned', label: 'Pinned', roles: [PARTNER] },
  { id: 0, path: 'open', label: 'Calls for expression of interest', roles: [AGENCY] },
  { id: 1, path: 'direct', label: 'Direct Selections', roles: [AGENCY] },
  { id: 2, path: 'unsolicited', label: 'Unsolicited Concept Notes', roles: [AGENCY] },
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

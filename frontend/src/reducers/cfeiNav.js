
import { SESSION_INIT } from './session';

import { PARTNER, AGENCY, filterItems } from './nav';

const initialState = [
  { path: '/cfei/overview', label: 'Overview', roles: [PARTNER] },
  { path: '/cfei/pinned', label: 'Pinned', roles: [PARTNER] },
  { path: '/cfei/calls', label: 'Calls for expression of interest', roles: [AGENCY] },
  { path: '/cfei/direct', label: 'direct selections', roles: [AGENCY] },
  { path: '/cfei/unsolicited', label: 'Unsolicited Concept Notes', roles: [AGENCY] },
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

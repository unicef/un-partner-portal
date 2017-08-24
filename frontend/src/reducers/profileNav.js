import { SESSION_INIT } from './session';

import { PARTNER, filterItems } from './nav';

const initialState = [
  { path: '/profile/overview', label: 'Overview', roles: [PARTNER] },
];


export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return filterItems(state, action.session.role);
    }
    default:
      return state;
  }
}

import { SESSION_INIT } from './session';

const PARTNER = 'partner';
const AGENCY = 'agency';

const initialState = {
  sidebar: [
    { path: '/dashboard', label: 'Dashboard', roles: [PARTNER, AGENCY] },
    { path: '/cfei', label: 'CFEIs', roles: [PARTNER, AGENCY] },
    { path: '/partner', label: 'Partners', roles: [AGENCY] },
    { path: '/applications', label: 'Your Applications', roles: [PARTNER] },
    { path: '/profile', label: 'Organization Profile', roles: [PARTNER] },
    { path: '/settings', label: 'Agency Settings', roles: [AGENCY] },
  ],
};

const filterItems = (state, role) => {
  const result = {};
  Object.keys(state).map((menu) => {
    result[menu] = state[menu].filter(item => item.roles.includes(role));
  });
  return result;
};

export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return filterItems(state, action.session.role);
    }
    default:
      return state;
  }
}

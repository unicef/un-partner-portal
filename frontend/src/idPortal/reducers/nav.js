import partnersIcon from 'material-ui-icons/Group';
import dashboardIcon from 'material-ui-icons/Dashboard';

import { SESSION_READY } from '../../reducers/session';

export const PARTNER = 'partner';
export const AGENCY = 'agency';

const initialState = [
  { path: '/idp/dashboard', label: 'Dashboard', roles: [PARTNER, AGENCY], icon: dashboardIcon },
  { path: '/idp/users', label: 'Users', roles: [PARTNER, AGENCY], icon: partnersIcon },
];

export const filterItems = (state, role) => state.filter(
  item => item.roles.includes(role),
);

export default function navReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_READY: {
      return filterItems(initialState, action.getState().session.role);
    }
    default:
      return state;
  }
}

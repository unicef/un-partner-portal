import cfeiIcon from 'material-ui-icons/Language';
import applicationsIcon from 'material-ui-icons/Assignment';
import settingsIcon from 'material-ui-icons/Settings';
import partnersIcon from 'material-ui-icons/Group';
import dashboardIcon from 'material-ui-icons/Dashboard';


import { SESSION_INIT } from './session';

export const PARTNER = 'partner';
export const AGENCY = 'agency';

const initialState = [
  { path: '/dashboard', label: 'Dashboard', roles: [PARTNER, AGENCY], icon: dashboardIcon },
  { path: '/cfei', label: 'CFEIs', roles: [PARTNER, AGENCY], icon: cfeiIcon },
  { path: '/partner', label: 'Partners', roles: [AGENCY], icon: partnersIcon },
  { path: '/applications', label: 'Your Applications', roles: [PARTNER], icon: applicationsIcon },
  { path: '/profile', label: 'Organization Profile', roles: [PARTNER], icon: settingsIcon },
  { path: '/settings', label: 'Agency Settings', roles: [AGENCY], icon: settingsIcon },
];

export const filterItems = (state, role) => state.filter(
  item => item.roles.includes(role),
);


export default function sessionReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return filterItems(state, 'partner');
    }
    default:
      return state;
  }
}

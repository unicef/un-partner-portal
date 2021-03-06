import cfeiIcon from 'material-ui-icons/Language';
import applicationsIcon from 'material-ui-icons/Assignment';
import settingsIcon from 'material-ui-icons/Settings';
import partnersIcon from 'material-ui-icons/Group';
import dashboardIcon from 'material-ui-icons/Dashboard';
import help from 'material-ui-icons/Help';


import { SESSION_READY } from './session';

export const PARTNER = 'partner';
export const AGENCY = 'agency';

const initialState = [
  { path: '/dashboard', label: 'Dashboard', roles: [PARTNER, AGENCY], icon: dashboardIcon },
  { path: '/cfei', label: 'Partnership Opportunities', roles: [PARTNER, AGENCY], icon: cfeiIcon },
  { path: '/partner', label: 'Partners', roles: [AGENCY], icon: partnersIcon },
  { path: '/applications', label: 'Your Applications', roles: [PARTNER], icon: applicationsIcon },
  { path: '/profile', label: 'Profile', roles: [PARTNER], icon: settingsIcon },
  { path: '/reports', label: 'Reports', roles: [AGENCY], icon: applicationsIcon },
  { path: 'https://unpartnerportalcso.zendesk.com/hc/en-us', external: true, label: 'Resource Library', roles: [PARTNER], icon: help },
  { path: 'https://unpartnerportalhelpcenter.zendesk.com/hc/en-us', external: true, label: 'Resource Library', roles: [AGENCY], icon: help },
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

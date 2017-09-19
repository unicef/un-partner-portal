
import { SESSION_INIT } from './session';

const initialState = {
  tabs: [
    { path: 'overview', label: 'Overview', name: 'a' },
    { path: 'details', label: 'Profile details', name: 'a' },
    { path: 'users', label: 'Users', name: 'a' },
    { path: 'applications', label: 'Applications', name: 'a' },
  ],
};

export default function agencyPartnerProfileNavReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return state;
    }
    default:
      return state;
  }
}

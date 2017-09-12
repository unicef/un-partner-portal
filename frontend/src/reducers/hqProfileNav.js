
import { SESSION_INIT } from './session';

const initialState = [
  { path: '/profile/hq/overview', label: 'Overview', name: 'a' },
  { path: '/profile/hq/user', label: 'User management', name: 'a' },
];

export default function hqProfileNavReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return state;
    }
    default:
      return state;
  }
}

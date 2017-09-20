
import { SESSION_INIT } from './session';

const initialState = [
  { id: 0, path: 'overview', label: 'Overview', name: 'a' },
  { id: 1, path: 'users', label: 'User management', name: 'a' },
];

export default function organizationProfileNavReducer(state = initialState, action) {
  switch (action.type) {
    case SESSION_INIT: {
      return state;
    }
    default:
      return state;
  }
}

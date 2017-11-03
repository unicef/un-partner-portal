import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
} from './apiStatus';

export const CLEAR_DASHBOARD_ERROR = 'CLEAR_DASHBOARD_ERROR';
export const LOAD_DASHBOARD_STARTED = 'LOAD_DASHBOARD_STARTED';
export const LOAD_DASHBOARD_ENDED = 'LOAD_DASHBOARD_ENDED';
export const LOAD_DASHBOARD_SUCCESS = 'LOAD_DASHBOARD_SUCCESS';
export const LOAD_DASHBOARD_FAILURE = 'LOAD_DASHBOARD_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load dashboard information, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_DASHBOARD_ERROR });
export const loadDashboardStarted = () => ({ type: LOAD_DASHBOARD_STARTED });
export const loadDashboardEnded = () => ({ type: LOAD_DASHBOARD_ENDED });
export const loadDashboardSuccess = dashboard => (
  { type: LOAD_DASHBOARD_SUCCESS, dashboard });
export const loadDashboardFailure = error => (
  { type: LOAD_DASHBOARD_FAILURE, error });

export const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error || R.path(['error', 'message'], action),
  },
  state);


export default function applicationStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_DASHBOARD_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_DASHBOARD_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_DASHBOARD_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_DASHBOARD_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}

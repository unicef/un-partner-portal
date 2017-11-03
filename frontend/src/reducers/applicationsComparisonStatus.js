import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
} from './apiStatus';

export const CLEAR_APPLICATIONS_COMPARISON_ERROR = 'CLEAR_APPLICATIONS_COMPARISON_ERROR';
export const LOAD_APPLICATIONS_COMPARISON_STARTED = 'LOAD_APPLICATIONS_COMPARISON_STARTED';
export const LOAD_APPLICATIONS_COMPARISON_ENDED = 'LOAD_APPLICATIONS_COMPARISON_ENDED';
export const LOAD_APPLICATIONS_COMPARISON_SUCCESS = 'LOAD_APPLICATIONS_COMPARISON_SUCCESS';
export const LOAD_APPLICATIONS_COMPARISON_FAILURE = 'LOAD_APPLICATIONS_COMPARISON_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load review summary, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_APPLICATIONS_COMPARISON_ERROR });
export const loadApplicationsComparisonStarted = () =>
  ({ type: LOAD_APPLICATIONS_COMPARISON_STARTED });
export const loadApplicationsComparisonEnded = () => ({ type: LOAD_APPLICATIONS_COMPARISON_ENDED });
export const loadApplicationsComparisonSuccess = comparison => (
  { type: LOAD_APPLICATIONS_COMPARISON_SUCCESS, comparison });
export const loadApplicationsComparisonFailure = error => (
  { type: LOAD_APPLICATIONS_COMPARISON_FAILURE, error });

export const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error || R.path(['error', 'message'], action),
  },
  state);


export default function ApplicationsComparisonStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_APPLICATIONS_COMPARISON_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_APPLICATIONS_COMPARISON_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_APPLICATIONS_COMPARISON_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_APPLICATIONS_COMPARISON_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}

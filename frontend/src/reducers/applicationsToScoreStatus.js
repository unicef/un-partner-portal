import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
} from './apiStatus';

export const CLEAR_APPLICATIONS_TO_SCORE_ERROR = 'CLEAR_APPLICATIONS_TO_SCORE_ERROR';
export const LOAD_APPLICATIONS_TO_SCORE_STARTED = 'LOAD_APPLICATIONS_TO_SCORE_STARTED';
export const LOAD_APPLICATIONS_TO_SCORE_ENDED = 'LOAD_APPLICATIONS_TO_SCORE_ENDED';
export const LOAD_APPLICATIONS_TO_SCORE_SUCCESS = 'LOAD_APPLICATIONS_TO_SCORE_SUCCESS';
export const LOAD_APPLICATIONS_TO_SCORE_FAILURE = 'LOAD_APPLICATIONS_TO_SCORE_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load applications information, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_APPLICATIONS_TO_SCORE_ERROR });
export const loadApplicationsToScoreStarted = () => ({ type: LOAD_APPLICATIONS_TO_SCORE_STARTED });
export const loadApplicationsToScoreEnded = () => ({ type: LOAD_APPLICATIONS_TO_SCORE_ENDED });
export const loadApplicationsToScoreSuccess = (applications, count) => (
  { type: LOAD_APPLICATIONS_TO_SCORE_SUCCESS, applications, count });
export const loadApplicationsToScoreFailure = error => (
  { type: LOAD_APPLICATIONS_TO_SCORE_FAILURE, error });

export const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error,
  },
  state);


export default function applicationStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_APPLICATIONS_TO_SCORE_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_APPLICATIONS_TO_SCORE_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_APPLICATIONS_TO_SCORE_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_APPLICATIONS_TO_SCORE_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}

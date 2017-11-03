import R from 'ramda';
import {
  clearError,
  startLoading,
  stopLoading,
} from './apiStatus';

export const CLEAR_SUBMITTED_CN_ERROR = 'CLEAR_SUBMITTED_CN_ERROR';
export const LOAD_SUBMITTED_CN_STARTED = 'LOAD_SUBMITTED_CN_STARTED';
export const LOAD_SUBMITTED_CN_ENDED = 'LOAD_SUBMITTED_CN_ENDED';
export const LOAD_SUBMITTED_CN_SUCCESS = 'LOAD_SUBMITTED_CN_SUCCESS';
export const LOAD_SUBMITTED_CN_FAILURE = 'LOAD_SUBMITTED_CN_FAILURE';

const initialState = {
  loading: false,
  error: {},
};

const messages = {
  loadingFailure: 'Couldn\'t load submitted CN, ' +
  'please refresh page and try again',
};

export const errorToBeCleared = () => ({ type: CLEAR_SUBMITTED_CN_ERROR });
export const loadSubmittedCNStarted = () => ({ type: LOAD_SUBMITTED_CN_STARTED });
export const loadSubmittedCNEnded = () => ({ type: LOAD_SUBMITTED_CN_ENDED });
export const loadSubmittedCNSuccess = (cfei, count) => (
  { type: LOAD_SUBMITTED_CN_SUCCESS, cfei, count });
export const loadSubmittedCNFailure = error => (
  { type: LOAD_SUBMITTED_CN_FAILURE, error });

export const saveErrorMsg = (state, action) => R.assoc(
  'error',
  {
    message: messages.loadingFailure,
    error: action.error || R.path(['error', 'message'], action),
  },
  state);


export default function pendingOffersStatus(state = initialState, action) {
  switch (action.type) {
    case LOAD_SUBMITTED_CN_FAILURE: {
      return saveErrorMsg(state, action);
    }
    case LOAD_SUBMITTED_CN_STARTED: {
      clearError(state);
      return startLoading(state);
    }
    case LOAD_SUBMITTED_CN_ENDED: {
      return stopLoading(state);
    }
    case CLEAR_SUBMITTED_CN_ERROR: {
      return clearError(state);
    }
    default:
      return state;
  }
}
